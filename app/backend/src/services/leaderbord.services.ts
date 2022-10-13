import MatchesModel from '../database/models/MatchesModel';
import IModel from '../interfaces/model.interface';
import TeamsModel from '../database/models/TeamsModel';
import IResult from '../interfaces/result.interface';
import ILeaderboard from '../interfaces/leaderboard.interface';
import HttpStatus from '../helper/httpStatus.helper';

class LeaderboardServices {
  constructor(
    private model: IModel<MatchesModel>,
    private teamsModel: IModel<TeamsModel>
  ) {}

  public async getAll(): Promise<IResult> {
    const responseMatches = await this.model.findAll();
    const responseTeams = await this.teamsModel.findAll();

    const finishedMatches = responseMatches.filter((match) => match.inProgress === false);
    const allTeams = responseTeams.map((team) => team.teamName);
    let leaderboard = allTeams.map((team) => {
      const lb: ILeaderboard = {
        name: team,
        totalPoints: 0,
        totalGames: 0,
        totalVictories: 0,
        totalDraws: 0,
        totalLosses: 0,
        goalsFavor: 0,
        goalsOwn: 0,
        goalsBalance: 0,
        efficiency: 0
      }

      return lb;
    });

    finishedMatches.forEach((match) => { // Updating Initial State of Leaderboard
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = match;

      const homeTeamName = responseTeams.find((team) => team.id === homeTeam)?.teamName;
      const awayTeamName = responseTeams.find((team) => team.id === awayTeam)?.teamName;

      if (homeTeamGoals !== awayTeamGoals) { // Match with a winner and a loser
        const homePoints = homeTeamGoals > awayTeamGoals
          ? { teamName: homeTeamName, points: 3 } : { teamName: homeTeamName, points: 0 }; // Calc home points
        
        const awayPoints = awayTeamGoals > homeTeamGoals
          ? { teamName: awayTeamName, points: 3 } : { teamName: awayTeamName, points: 0 }; // Calc away points

        leaderboard.forEach((team) => {
          if (team.name === homePoints.teamName) { // Updating Home Team
            const recoverTeamIndex = leaderboard.findIndex((team) => team.name === homePoints.teamName);
            leaderboard[recoverTeamIndex].totalPoints += homePoints.points;
            leaderboard[recoverTeamIndex].totalGames ++;
            leaderboard[recoverTeamIndex].totalVictories += homePoints.points > 1 ? 1 : 0;
            leaderboard[recoverTeamIndex].totalLosses += homePoints.points === 0 ? 1 : 0;
            leaderboard[recoverTeamIndex].goalsFavor += homeTeamGoals;
            leaderboard[recoverTeamIndex].goalsOwn += awayTeamGoals;
          }

          if (team.name === awayPoints.teamName) { // Updating Away Team
            const recoverTeamIndex = leaderboard.findIndex((team) => team.name === awayPoints.teamName);
            leaderboard[recoverTeamIndex].totalPoints += awayPoints.points;
            leaderboard[recoverTeamIndex].totalGames ++;
            leaderboard[recoverTeamIndex].totalVictories += awayPoints.points > 1 ? 1 : 0;
            leaderboard[recoverTeamIndex].totalLosses += awayPoints.points === 0 ? 1 : 0;
            leaderboard[recoverTeamIndex].goalsFavor += awayTeamGoals;
            leaderboard[recoverTeamIndex].goalsOwn += homeTeamGoals;
          }
        });

        return null;
      }

      leaderboard.forEach((team) => { // Match without winner or looser, a draft.
        if (team.name === homeTeamName) { // Updating Home Team
          const recoverTeamIndex = leaderboard.findIndex((team) => team.name === homeTeamName);
          leaderboard[recoverTeamIndex].totalPoints ++;
          leaderboard[recoverTeamIndex].totalGames ++;
          leaderboard[recoverTeamIndex].totalDraws ++;
          leaderboard[recoverTeamIndex].goalsFavor += homeTeamGoals;
          leaderboard[recoverTeamIndex].goalsOwn += awayTeamGoals;
        }

        if (team.name === awayTeamName) { // Updating Away Team
          const recoverTeamIndex = leaderboard.findIndex((team) => team.name === awayTeamName);
          leaderboard[recoverTeamIndex].totalPoints ++;
          leaderboard[recoverTeamIndex].totalGames ++;
          leaderboard[recoverTeamIndex].totalDraws ++;
          leaderboard[recoverTeamIndex].goalsFavor += awayTeamGoals;
          leaderboard[recoverTeamIndex].goalsOwn += homeTeamGoals;
        }
      });
    });

    leaderboard.forEach((team, index) => { // Adding stats for teams on Leaderboard
      const teamEfficiencyCalc = (team.totalPoints / (team.totalGames * 3) * 100).toFixed(2);
      const teamEfficiency = parseFloat(teamEfficiencyCalc);
      const teamGoalsBalance = team.goalsFavor - team.goalsOwn;
      leaderboard[index].efficiency = teamEfficiency;
      leaderboard[index].goalsBalance = teamGoalsBalance;
    });

    leaderboard.sort((a, b) => {
      if (b.totalPoints === a.totalPoints) { // The team have the same total of points [ No Draft 1 ]
        return b.goalsBalance - a.goalsBalance;
      };

      if (b.totalPoints === a.totalPoints
      && b.goalsBalance === a.goalsBalance) { // The team have the same goals balance [ No Draft 2 ]
        return b.goalsFavor - a.goalsFavor;
      }

      if (b.totalPoints === a.totalPoints
      && b.goalsBalance === a.goalsBalance
      && b.goalsFavor === a.goalsFavor) { // The team have the same goals favor [ No Draft 3 ]
        return a.goalsOwn - b.goalsOwn;
      }

      return b.totalPoints - a.totalPoints;
    });

    return { data: leaderboard, code: HttpStatus.OK };
  }
}

export default LeaderboardServices;

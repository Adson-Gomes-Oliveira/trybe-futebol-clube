import ITeam from '../interfaces/team.interface';
import ILeaderboard from '../interfaces/leaderboard.interface';
import IMatch from '../interfaces/match.interface';

class LeaderBoardHelper {
  protected startLeaderboardState(team: string): ILeaderboard {
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
  }

  protected fillLeaderboard(matchs: IMatch[], teams: ITeam[], leaderboard: ILeaderboard[]): ILeaderboard[] {
    const updateLeaderboard = leaderboard;
    
    matchs.forEach((match) => {
      const { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals } = match;

      const homeTeamName = teams.find((team) => team.id === homeTeam)?.teamName;
      const awayTeamName = teams.find((team) => team.id === awayTeam)?.teamName;

      if (homeTeamGoals !== awayTeamGoals) { // If the match has a winner
        const homePoints = homeTeamGoals > awayTeamGoals
          ? { teamName: homeTeamName, points: 3 } : { teamName: homeTeamName, points: 0 };
          
        const awayPoints = awayTeamGoals > homeTeamGoals
          ? { teamName: awayTeamName, points: 3 } : { teamName: awayTeamName, points: 0 };

        updateLeaderboard.forEach((team) => {
          if (team.name === homePoints.teamName) {
            const recoverTeamIndex = updateLeaderboard.findIndex((team) => team.name === homePoints.teamName);
            updateLeaderboard[recoverTeamIndex].totalPoints += homePoints.points;
            updateLeaderboard[recoverTeamIndex].totalGames ++;
            updateLeaderboard[recoverTeamIndex].totalVictories += homePoints.points > 1 ? 1 : 0;
            updateLeaderboard[recoverTeamIndex].totalLosses += homePoints.points === 0 ? 1 : 0;
            updateLeaderboard[recoverTeamIndex].goalsFavor += homeTeamGoals;
            updateLeaderboard[recoverTeamIndex].goalsOwn += awayTeamGoals;
          }

          if (team.name === awayPoints.teamName) { // Updating Away Team
            const recoverTeamIndex = updateLeaderboard.findIndex((team) => team.name === awayPoints.teamName);
            updateLeaderboard[recoverTeamIndex].totalPoints += awayPoints.points;
            updateLeaderboard[recoverTeamIndex].totalGames ++;
            updateLeaderboard[recoverTeamIndex].totalVictories += awayPoints.points > 1 ? 1 : 0;
            updateLeaderboard[recoverTeamIndex].totalLosses += awayPoints.points === 0 ? 1 : 0;
            updateLeaderboard[recoverTeamIndex].goalsFavor += awayTeamGoals;
            updateLeaderboard[recoverTeamIndex].goalsOwn += homeTeamGoals;
          }
        });

        return updateLeaderboard;
      }

      updateLeaderboard.forEach((team) => { // If the match was a Draft 
        if (team.name === homeTeamName) { 
          const recoverTeamIndex = leaderboard.findIndex((team) => team.name === homeTeamName);
          leaderboard[recoverTeamIndex].totalPoints ++;
          leaderboard[recoverTeamIndex].totalGames ++;
          leaderboard[recoverTeamIndex].totalDraws ++;
          leaderboard[recoverTeamIndex].goalsFavor += homeTeamGoals;
          leaderboard[recoverTeamIndex].goalsOwn += awayTeamGoals;
        }

        if (team.name === awayTeamName) { 
          const recoverTeamIndex = leaderboard.findIndex((team) => team.name === awayTeamName);
          leaderboard[recoverTeamIndex].totalPoints ++;
          leaderboard[recoverTeamIndex].totalGames ++;
          leaderboard[recoverTeamIndex].totalDraws ++;
          leaderboard[recoverTeamIndex].goalsFavor += awayTeamGoals;
          leaderboard[recoverTeamIndex].goalsOwn += homeTeamGoals;
        }
      });
    })

    return updateLeaderboard;
  }

  protected addingStatsToLeaderboard(leaderboard: ILeaderboard[]): ILeaderboard[] {
    const updateLeaderboard = leaderboard;

    updateLeaderboard.forEach((team, index) => {
      const teamEfficiencyCalc = (team.totalPoints / (team.totalGames * 3) * 100).toFixed(2);
      const teamEfficiency = parseFloat(teamEfficiencyCalc);
      const teamGoalsBalance = team.goalsFavor - team.goalsOwn;
      updateLeaderboard[index].efficiency = teamEfficiency;
      leaderboard[index].goalsBalance = teamGoalsBalance;
    });

    return updateLeaderboard;
  }

  protected sortingLeaderboard(leaderboard: ILeaderboard[]): ILeaderboard[] {
    const updateLeaderboard = leaderboard;

    updateLeaderboard.sort((a, b) => {
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

    return updateLeaderboard;
  }
}

export default LeaderBoardHelper;

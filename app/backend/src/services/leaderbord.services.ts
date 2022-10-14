import MatchesModel from '../database/models/MatchesModel';
import IModel from '../interfaces/model.interface';
import TeamsModel from '../database/models/TeamsModel';
import IResult from '../interfaces/result.interface';
import ILeaderboard from '../interfaces/leaderboard.interface';
import HttpStatus from '../helper/httpStatus.helper';
import LeaderBoardHelper from '../helper/leaderboard.helper';

class LeaderboardServices extends LeaderBoardHelper {
  constructor(
    private model: IModel<MatchesModel>,
    private teamsModel: IModel<TeamsModel>,
    private leaderboard: ILeaderboard[] = [],
  ) {
    super();
  }

  public async getAll(): Promise<IResult> {
    const responseMatches = await this.model.findAll();
    const responseTeams = await this.teamsModel.findAll();

    const finishedMatches = responseMatches.filter((match) => match.inProgress === false);
    const allTeams = responseTeams.map((team) => team.teamName);

    this.leaderboard = allTeams.map(this.startLeaderboardState);
    this.leaderboard = this.fillLeaderboard(finishedMatches, responseTeams, this.leaderboard);
    this.leaderboard = this.addingStatsToLeaderboard(this.leaderboard);
    this.leaderboard = this.sortingLeaderboard(this.leaderboard);

    return { data: this.leaderboard, code: HttpStatus.OK };
  }
}

export default LeaderboardServices;

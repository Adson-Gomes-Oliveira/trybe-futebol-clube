import HttpStatus from '../helper/httpStatus.helper';
import ILeaderboard from './leaderboard.interface';
import IMatch from './match.interface';
import ITeam from './team.interface';
import IUser from './user.interface';

interface IResult {
  data?: string | IUser | IUser[] | ITeam | ITeam[] | IMatch | IMatch[] | ILeaderboard[];
  code: HttpStatus;
  message?: string;
}

export default IResult;

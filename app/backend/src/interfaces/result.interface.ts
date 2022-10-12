import HttpStatus from '../helper/httpStatus.helper';
import IMatch from './match.interface';
import ITeam from './team.interface';
import IUser from './user.interface';

interface IResult {
  data?: string | IUser | IUser[] | ITeam | ITeam[] | IMatch | IMatch[];
  code: HttpStatus;
  message?: string;
}

export default IResult;

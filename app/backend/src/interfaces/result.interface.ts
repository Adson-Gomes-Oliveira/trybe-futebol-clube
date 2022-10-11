import HttpStatus from '../helper/httpStatus.helper';
import IUser from './user.interface';

interface IResult {
  data?: string | IUser | IUser[];
  code: HttpStatus;
  message?: string;
}

export default IResult;

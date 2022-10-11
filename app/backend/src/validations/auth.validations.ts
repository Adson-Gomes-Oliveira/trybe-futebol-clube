import * as JOI from 'joi';
import IResult from '../interfaces/result.interface';
import HttpStatus from '../helper/httpStatus.helper';
import ILogin from '../interfaces/login.interface';

class AuthValidations {
  static verifyPayloadToSignIn(payload: ILogin): IResult | null {
    const { error } = JOI.object({
      email: JOI.string().email().required(),
      password: JOI.string().min(6).required(),
    }).validate(payload);

    if (error) return { message: error.details[0].message, code: HttpStatus.BAD_REQUEST };
    return null;
  }
}

export default AuthValidations;

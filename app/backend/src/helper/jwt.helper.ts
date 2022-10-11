import 'dotenv/config';
import * as JWT from 'jsonwebtoken';
import IUser from '../interfaces/user.interface';
import HttpStatus from './httpStatus.helper';

class ManageToken {
  static generateToken(payload: IUser): string {
    const token = JWT.sign(payload, process.env.JWT_SECRET as JWT.Secret, {
      algorithm: 'HS256',
      expiresIn: '1d',
    });

    return token;
  }

  static isValid(token: string): string | JWT.JwtPayload {
    const validToken = JWT.verify(token, process.env.JWT_SECRET as JWT.Secret);

    if(!validToken) {
      const err = new Error('Your token is invalid or expired!');
      err.name = 'INVALID_TOKEN';
      err.stack = HttpStatus.UNAUTHORIZED.toString();
      throw err;
    }

    return validToken;
  }
}

export default ManageToken;

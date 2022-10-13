import 'dotenv/config';
import * as JWT from 'jsonwebtoken';
import JWTPayload from '../interfaces/jwt.interface';
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

  static isValid(token: string): JWTPayload {
    try {
      const validToken = JWT.verify(token, process.env.JWT_SECRET as JWT.Secret) as JWTPayload;
      return validToken;
    } catch (error) {
      const err = new Error('Token must be a valid token');
      err.name = 'NOT_AUTHORIZED';
      err.stack = HttpStatus.UNAUTHORIZED.toString();
      throw err;
    }
  }
}

export default ManageToken;

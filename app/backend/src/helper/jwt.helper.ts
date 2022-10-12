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
    const validToken = JWT.verify(token, process.env.JWT_SECRET as JWT.Secret) as JWTPayload;
    return validToken;
  }
}

export default ManageToken;

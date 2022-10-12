import { JwtPayload } from 'jsonwebtoken';
import IUser from './user.interface';

interface JWTPayload extends JwtPayload {
  dataValues: IUser;
};

export default JWTPayload;

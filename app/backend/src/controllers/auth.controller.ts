import { Request, Response, NextFunction } from 'express';
import IUser from '../interfaces/user.interface';
import ManageToken from '../helper/jwt.helper';
import ILogin from '../interfaces/login.interface';
import AuthServices from '../services/auth.services';
import HttpStatus from '../helper/httpStatus.helper';

class AuthController {
  constructor(private services: AuthServices) {
    this.signIn = this.signIn.bind(this);
  };

  public async signIn(req: Request, res: Response)
  : Promise<Response> {
    const payload = req.body as ILogin;
    const responseToken = await this.services.LoginAndToken(payload);

    return res.status(responseToken.code).json({
      token: responseToken.data,
    });
  }

  static async authorizationMiddleware(req: Request, res: Response, next: NextFunction)
    : Promise<void> {
      const { authorization } = req.headers;

      if(!authorization) {
        const err = new Error('Token is required');
        err.name = 'MISSING_TOKEN';
        err.stack = HttpStatus.UNAUTHORIZED.toString();
        throw err;
      }

      const validation = ManageToken.isValid(authorization as string);
      res.locals = validation;

      next();
    }

  public async validateLogin(req: Request, res: Response)
  : Promise<Response> {
    const { authorization } = req.headers;

    if(!authorization) {
      const err = new Error('Token is required');
      err.name = 'MISSING_TOKEN';
      err.stack = HttpStatus.BAD_REQUEST.toString();
      throw err;
    }

    const { dataValues } = ManageToken.isValid(authorization as string);
    
    return res.status(HttpStatus.OK).json({ 
      role: dataValues.role,
    });
  }
}

export default AuthController;

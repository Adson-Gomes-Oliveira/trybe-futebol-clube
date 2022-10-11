import { Request, Response, NextFunction } from 'express';
import ILogin from '../interfaces/login.interface';
import AuthServices from '../services/auth.services';

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
}

export default AuthController;

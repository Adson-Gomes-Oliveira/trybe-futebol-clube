import { Request, Response } from 'express';
import ILogin from '../interfaces/login.interface';

class Authenticate {
  async auth(req: Request, res: Response) {
    const payload: ILogin = req.body;
  }
}
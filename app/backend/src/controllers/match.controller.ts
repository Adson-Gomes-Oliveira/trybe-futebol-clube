import { Request, Response } from 'express';
import MatchServices from '../services/match.services';

class MatchController {
  constructor(private services: MatchServices) {
    this.getAll = this.getAll.bind(this);
  }

  public async getAll(req: Request, res: Response)
  : Promise<Response> {
    const response = await this.services.getAll();
    return res.status(response.code).json(response.data);
  }
}

export default MatchController;

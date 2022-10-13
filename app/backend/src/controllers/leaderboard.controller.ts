import { Request, Response } from 'express';
import LeaderboardServices from '../services/leaderbord.services';

class LeaderboardController {
  constructor(private services: LeaderboardServices) {
    this.getAll = this.getAll.bind(this);
  }

  public async getAll(req: Request, res: Response)
  : Promise<Response> {
    const response = await this.services.getAll();
    return res.status(response.code).json(response.data);
  }
}

export default LeaderboardController;

import { Request, Response } from 'express';
import TeamServices from '../services/team.services';

class TeamController {
  constructor(private service: TeamServices) {
    this.getAll = this.getAll.bind(this);
  }

  public async getAll(req: Request, res: Response)
    : Promise<Response> {
      const response = await this.service.getAll();
      return res.status(response.code).json(response.data);
    }
}

export default TeamController;

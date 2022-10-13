import { Request, Response } from 'express';
import IMatch from '../interfaces/match.interface';
import MatchServices from '../services/match.services';

class MatchController {
  constructor(private services: MatchServices) {
    this.getAll = this.getAll.bind(this);
    this.createMatch = this.createMatch.bind(this);
  }

  public async getAll(req: Request, res: Response)
  : Promise<Response> {
    const { inProgress } = req.query;

    if (inProgress !== undefined) {
      const matchesInProgress = inProgress === 'true' && true;
      const response = await this.services.getAllMatchesInProgress(matchesInProgress);
      return res.status(response.code).json(response.data);
    }

    const response = await this.services.getAll();
    return res.status(response.code).json(response.data);
  }

  public async createMatch(req: Request, res: Response)
  : Promise<Response> {
    const payload = req.body as IMatch;

    const response = await this.services.createMatch(payload);
    return res.status(response.code).json(response.data);
  }
}

export default MatchController;

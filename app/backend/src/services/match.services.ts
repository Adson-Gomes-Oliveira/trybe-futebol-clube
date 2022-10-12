import IModel from '../interfaces/model.interface';
import HttpStatus from '../helper/httpStatus.helper';
import IResult from '../interfaces/result.interface';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';

class MatchServices {
  constructor(private model: IModel<MatchesModel>) {}

  public async getAll(): Promise<IResult> {
    const response = await this.model.findAll({
      include: [
        { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ]
    });

    return { data: response, code: HttpStatus.OK };
  }
}

export default MatchServices;

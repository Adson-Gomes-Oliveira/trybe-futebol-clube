import IModel from '../interfaces/model.interface';
import HttpStatus from '../helper/httpStatus.helper';
import IResult from '../interfaces/result.interface';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import IMatch from '../interfaces/match.interface';
import MatchValidation from '../validations/match.validations';

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

  public async getAllMatchesInProgress(query: boolean)
  : Promise<IResult> {
    const response = await this.model.findAll({
      include: [
        { model: TeamsModel, as: 'teamHome', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'teamAway', attributes: { exclude: ['id'] } },
      ],
      where: { inProgress: query },
    });

    return { data: response, code: HttpStatus.OK };
  }

  public async createMatch(payload: IMatch)
  : Promise<IResult> {
    const validate = MatchValidation.verifyPayloadToCreate(payload);

    if(validate?.message) {
      const err = new Error(validate.message);
      err.name = 'INVALID_PAYLOAD';
      err.stack = validate.code.toString();
      throw err;
    }

    const response = await this.model.create(payload);
    return { data: response, code: HttpStatus.CREATED };
  }
}

export default MatchServices;

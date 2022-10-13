import IModel from '../interfaces/model.interface';
import HttpStatus from '../helper/httpStatus.helper';
import IResult from '../interfaces/result.interface';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import IMatch from '../interfaces/match.interface';
import MatchValidation from '../validations/match.validations';

class MatchServices {
  constructor(
    private model: IModel<MatchesModel>,
    private TeamsModel: IModel<TeamsModel>,
  ) {}

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

    const verifyIDHome = await this.TeamsModel.findByPk(payload.homeTeam);
    const verifyIDAway = await this.TeamsModel.findByPk(payload.awayTeam);

    if (verifyIDHome === null || verifyIDAway === null) {
      const err = new Error('There is no team with such id!');
      err.name = 'INVALID_PAYLOAD';
      err.stack = HttpStatus.NO_CONTENT.toString();
      throw err;
    }

    const response = await this.model.create(payload);
    return { data: response, code: HttpStatus.CREATED };
  }

  public async finishMatch(ID: number): Promise<IResult> {
    await this.model.update({ inProgress: false }, { where: { id: ID } });
    return { message: 'Finished', code: HttpStatus.OK };
  }

  public async updateMatch(ID: number, payload: IMatch): Promise<IResult> {
    const validate = MatchValidation.verifyPayloadToUpdate(payload);

    if (validate?.message) {
      const err = new Error(validate.message);
      err.name = 'INVALID_PAYLOAD';
      err.stack = validate.code.toString();
      throw err;
    }

    await this.model.update(
      { homeTeamGoals: payload.homeTeamGoals, awayTeamGoals: payload.awayTeamGoals },
      { where: { id: ID } },
    );

    const matchUpdated = await this.model.findByPk(ID);

    return { data: matchUpdated as IMatch, code: HttpStatus.OK };
  }
}

export default MatchServices;

import IModel from '../interfaces/model.interface';
import HttpStatus from '../helper/httpStatus.helper';
import IResult from '../interfaces/result.interface';
import TeamsModel from '../database/models/TeamsModel';

class TeamServices {
  constructor(private model: IModel<TeamsModel>) {}

  public async getAll(): Promise<IResult> {
    const response = await this.model.findAll();
    return { data: response, code: HttpStatus.OK };
  }
}

export default TeamServices;

import * as JOI from 'joi';
import IResult from '../interfaces/result.interface';
import HttpStatus from '../helper/httpStatus.helper';
import IMatch from '../interfaces/match.interface';

class MatchValidation {
  static verifyPayloadToCreate(payload: IMatch): IResult | null {
    const { error } = JOI.object({
      homeTeam: JOI.number().min(1).required(),
      awayTeam: JOI.number().min(1).required(),
      homeTeamGoals: JOI.number().min(1).required(),
      awayTeamGoals: JOI.number().min(1).required(),
      inProgress: JOI.boolean().equal(true).required(),
    }).validate(payload);

    if (error) return { message: error.details[0].message, code: HttpStatus.BAD_REQUEST };
    return null;
  }
}

export default MatchValidation;

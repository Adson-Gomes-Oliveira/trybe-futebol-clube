import 'dotenv/config';
import { compareSync } from 'bcryptjs';

import IModel from '../interfaces/model.interface';
import ILogin from '../interfaces/login.interface';
import ManageToken from '../helper/jwt.helper';
import HttpStatus from '../helper/httpStatus.helper';
import IResult from '../interfaces/result.interface';
import UsersModel from '../database/models/UsersModel';
import AuthValidations from '../validations/auth.validations';

class AuthServices {
  constructor(private model: IModel<UsersModel>) {};

  public async LoginAndToken(payload: ILogin): Promise<IResult> {
    const validate = AuthValidations.verifyPayloadToSignIn(payload);
    if (validate?.message) {
      const err = new Error(validate.message);
      err.name = 'INVALID_PAYLOAD';
      err.stack = validate.code.toString();
      throw err;
    }

    const findUser = await this.model.findOne({ where: { email: payload.email } });
    if (!findUser) {
      const err = new Error('Email not found!');
      err.name = 'INVALID_EMAIL';
      err.stack = HttpStatus.UNAUTHORIZED.toString();
      throw err;
    };

    const isValidPassword = compareSync(payload.password, findUser.password as string);
    if (!isValidPassword) {
      const err = new Error('Wrong Password!');
      err.name = 'INVALID_PASSWORD';
      err.stack = HttpStatus.UNAUTHORIZED.toString();
      throw err;
    };

    const { password: _, ...userWithoutPassword } = findUser;
    const token = ManageToken.generateToken(userWithoutPassword);
    return { data: token, code: HttpStatus.OK };
  }
}

export default AuthServices;

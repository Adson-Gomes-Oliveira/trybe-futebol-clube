import ILogin from '../interfaces/login.interface';

export const SUCCESSFULLY_LOGIN_MOCK: ILogin = {
  email: 'admin@admin.com',
  password: 'secret_admin',
};
export const FAILED_LOGIN_MOCK: ILogin = {
  email: 'admin@admin.com',
  password: 'wrong_password',
};
export const TEAM_ID_MOCK = 1;

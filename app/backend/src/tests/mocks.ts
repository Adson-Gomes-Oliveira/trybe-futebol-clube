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
export const SUCCESSFULLY_MATCH_MOCK = {
  homeTeam: 16,
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
  inProgress: true,
};
export const FAILED_MATCH_MOCK = {
  awayTeam: 8,
  homeTeamGoals: 2,
  awayTeamGoals: 2,
  inProgress: true,
};
export const EDIT_MATCH_MOCK = {
  homeTeamGoals: 5,
  awayTeamGoals: 5,
}

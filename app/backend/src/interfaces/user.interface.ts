export default interface IUser<T> {
  id?: T;
  username: string;
  role: string;
  email: string;
  password: string;
};

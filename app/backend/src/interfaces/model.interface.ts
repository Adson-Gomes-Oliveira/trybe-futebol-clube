import { Model, FindOptions } from 'sequelize';

interface IModel<T extends Model> {
  findAll(): Promise<T[]>;
  findOne(options: FindOptions): Promise<T | null>;
}

export default IModel;

import { Model, FindOptions } from 'sequelize';

interface IModel<T extends Model> {
  findOne(options: FindOptions): Promise<T | null>;
}

export default IModel;

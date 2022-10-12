import { Model, FindOptions, Identifier } from 'sequelize';

interface IModel<T extends Model> {
  findAll(): Promise<T[]>;
  findByPk(ID: Identifier): Promise<T | null>
  findOne(options: FindOptions): Promise<T | null>;
}

export default IModel;

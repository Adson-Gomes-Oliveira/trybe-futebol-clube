import { Model, FindOptions, Identifier, AttributeType } from 'sequelize';

interface IModel<T extends Model> {
  findAll(options?: FindOptions): Promise<T[]>;
  findByPk(ID: Identifier): Promise<T | null>
  findOne(options: FindOptions): Promise<T | null>;
  create(payload: any): Promise<T>;
}

export default IModel;

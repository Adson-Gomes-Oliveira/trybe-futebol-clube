import { Model, DataTypes } from 'sequelize';
import db from '.';
import IUser from '../../interfaces/user.interface';

class UsersModel extends Model implements IUser {
  id!: number;
  username!: string;
  role!: string;
  email!: string;
  password!: string;
};

UsersModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: DataTypes.STRING,
  role: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  tableName: 'users',
  sequelize: db,
  underscored: true,
  timestamps: false,
})

export default UsersModel;

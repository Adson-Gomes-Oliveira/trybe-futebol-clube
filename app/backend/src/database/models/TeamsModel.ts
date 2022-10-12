import { Model, DataTypes } from 'sequelize';
import db from '.';
import ITeam from '../../interfaces/team.interface';

class TeamsModel extends Model implements ITeam {
  id!: number;
  teamName!: string;
}

TeamsModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  teamName: DataTypes.STRING,
}, {
  tableName: 'teams',
  sequelize: db,
  underscored: true,
  timestamps: false,
});

export default TeamsModel;

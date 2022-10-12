import { Model, DataTypes } from 'sequelize';
import db from '.';
import IMatch from '../../interfaces/match.interface';
import TeamsModel from './TeamsModel';

class MatchesModel extends Model implements IMatch {
  id!: number;
  homeTeam!: number;
  homeTeamGoals!: number;
  awayTeam!: number;
  awayTeamGoals!: number;
  inProgress!: number;
}

MatchesModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  homeTeam: DataTypes.INTEGER,
  homeTeamGoals: DataTypes.INTEGER,
  awayTeam: DataTypes.INTEGER,
  awayTeamGoals: DataTypes.INTEGER,
  inProgress: DataTypes.INTEGER,
}, {
  tableName: 'matches',
  sequelize: db,
  underscored: true,
  timestamps: false,
});

MatchesModel.belongsTo(TeamsModel, { as: 'teamHome', foreignKey: 'homeTeam' });
MatchesModel.belongsTo(TeamsModel, { as: 'teamAway', foreignKey: 'awayTeam' });

export default MatchesModel;

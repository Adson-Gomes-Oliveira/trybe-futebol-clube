import * as express from 'express';
import MatchesModel from '../database/models/MatchesModel';
import TeamsModel from '../database/models/TeamsModel';
import LeaderboardServices from '../services/leaderbord.services';
import LeaderboardController from '../controllers/leaderboard.controller';

const router = express.Router();
const newService = new LeaderboardServices(MatchesModel, TeamsModel);
const newController = new LeaderboardController(newService);

router.get('/', newController.getAll);

export default router;

import * as express from 'express';
import MatchesModel from '../database/models/MatchesModel';
import MatchServices from '../services/match.services';
import MatchController from '../controllers/match.controller';

const router = express.Router();
const newService = new MatchServices(MatchesModel);
const newController = new MatchController(newService);

router.get('/', newController.getAll);

export default router;

import * as express from 'express';
import TeamsModel from '../database/models/TeamsModel';
import TeamServices from '../services/team.services';
import TeamController from '../controllers/team.controller';

const router = express.Router();
const newService = new TeamServices(TeamsModel);
const newController = new TeamController(newService);

router.get('/', newController.getAll);
router.get('/:id', newController.getByID);

export default router;

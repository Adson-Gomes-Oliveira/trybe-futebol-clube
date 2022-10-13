import * as express from 'express';
import MatchesModel from '../database/models/MatchesModel';
import MatchServices from '../services/match.services';
import MatchController from '../controllers/match.controller';
import AuthController from '../controllers/auth.controller';
import TeamsModel from '../database/models/TeamsModel';

const router = express.Router();
const newService = new MatchServices(MatchesModel, TeamsModel);
const newController = new MatchController(newService);

router.get('/', newController.getAll);
router.use(AuthController.authorizationMiddleware);
router.post('/', newController.createMatch);
router.patch('/:id', newController.updateMatch);
router.patch('/:id/finish', newController.finishMatch);

export default router;

import * as express from 'express';
import MatchesModel from '../database/models/MatchesModel';
import MatchServices from '../services/match.services';
import MatchController from '../controllers/match.controller';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const newService = new MatchServices(MatchesModel);
const newController = new MatchController(newService);

router.get('/', newController.getAll);
router.use(AuthController.authorizationMiddleware);
router.post('/', newController.createMatch);
router.patch('/:id/finish', newController.finishMatch);

export default router;

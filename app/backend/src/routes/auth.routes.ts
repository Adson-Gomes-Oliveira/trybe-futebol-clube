import * as express from 'express';
import UsersModel from '../database/models/UsersModel';
import AuthServices from '../services/auth.services';
import AuthController from '../controllers/auth.controller';

const router = express.Router();
const newService = new AuthServices(UsersModel);
const newController = new AuthController(newService);

router.post('/', newController.signIn);

export default router;

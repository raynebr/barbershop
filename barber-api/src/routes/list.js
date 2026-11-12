import { Router } from 'express';
import { ListController } from '../controllers/ListController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const listRoutes = Router();
const listController = new ListController();

listRoutes.get('/barbers', ensureAuthenticated, listController.listBarbers);

export { listRoutes };
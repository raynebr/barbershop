import { Router } from 'express';
import { ServicesController } from '../controllers/ServicesController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';
import { ensureAdmin } from '../middlewares/ensureAdmin.js';

const servicesRoutes = Router();
const servicesController = new ServicesController();

servicesRoutes.post('/create', ensureAuthenticated, ensureAdmin, servicesController.create);
servicesRoutes.get('/list', ensureAuthenticated, servicesController.list);

export {servicesRoutes};
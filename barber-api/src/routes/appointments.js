import { Router } from 'express';
import { AppointmentController } from '../controllers/AppointmentController.js';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js';

const appointmentsRoutes = Router();
const appointmentController = new AppointmentController();

appointmentsRoutes.post('/create', ensureAuthenticated, appointmentController.create);
appointmentsRoutes.get('/available', ensureAuthenticated, appointmentController.listAvailableTimes);
appointmentsRoutes.get('/client', ensureAuthenticated, appointmentController.listClientAppointments);
appointmentsRoutes.get('/barber', ensureAuthenticated, appointmentController.listBarberAppointments);
appointmentsRoutes.patch('/:id/cancel', ensureAuthenticated, appointmentController.cancelAppointment);

export { appointmentsRoutes };
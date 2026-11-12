import { CreateAppointmentService } from '../services/CreateAppointmentService.js';
import { ListAppointmentsService } from '../services/ListAppointmentsService.js';
import { ListAvailableTimesService } from '../services/ListAvailableTimesService.js';
import { CancelAppointmentService } from '../services/CancelAppointmentService.js';

export class AppointmentController {
  async create(request, response) {
    try {
      const { barber_id, service_id, date } = request.body;
      const client_id = request.user.id;

      const appointment = await new CreateAppointmentService().execute({
        date: new Date(date),
        client_id,
        barber_id,
        service_id
      });

      return response.status(201).json(appointment);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      const status = error.message.includes('disponível') ? 409 : 400;
      return response.status(status).json({ error: error.message });
    }
  }

  async listAvailableTimes(request, response) {
    try {
      const { barber_id, date } = request.query;

      if (!barber_id || !date) {
        return response.status(400).json({ error: 'barber_id e date são obrigatórios' });
      }

      const availableTimes = await new ListAvailableTimesService().listAvailableTimes(barber_id, date);
      return response.json(availableTimes);
    } catch (error) {
      console.error('Erro ao listar horários:', error);
      return response.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
    }
  }

  async listClientAppointments(request, response) {
    try {
      const client_id = request.user.id;
      const appointments = await new ListAppointmentsService().listClientAppointments(client_id);
      return response.json(appointments);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return response.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  async listBarberAppointments(request, response) {
    try {
      const barber_id = request.user.id;
      const appointments = await new ListAppointmentsService().listBarberAppointments(barber_id);
      return response.json(appointments);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      return response.status(500).json({ error: 'Erro ao buscar agendamentos' });
    }
  }

  async cancelAppointment(request, response) {
    try {
      const { id } = request.params;
      const userId = request.user.id;

      const appointment = await new CancelAppointmentService().execute(id, userId);
      return response.json(appointment);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      const status = error.message.includes('não encontrado') ? 404 :
                     error.message.includes('autorizado') ? 403 : 400;
      return response.status(status).json({ error: error.message });
    }
  }
}
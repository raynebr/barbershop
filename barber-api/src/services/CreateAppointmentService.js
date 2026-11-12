import { prisma } from '../config/prisma.js';

export class CreateAppointmentService {
  async execute({ date, client_id, barber_id, service_id }) {
    const service = await prisma.service.findUnique({
      where: { id: service_id }
    });

    if (!service) {
      throw new Error('Serviço não encontrado');
    }

    const newAppointmentTime = new Date(date);
    const durationInMs = service.duration_minutes * 60 * 1000;
    const newAppointmentEnd = new Date(newAppointmentTime.getTime() + durationInMs);

    const appointments = await prisma.appointment.findMany({
      where: {
        barber_id,
        status: { notIn: ['CANCELLED', 'COMPLETED'] }
      },
      include: {
        service: true
      }
    });

    const newStartLocal = new Date(newAppointmentTime.getTime() - (3 * 60 * 60 * 1000));
    const newEndLocal = new Date(newStartLocal.getTime() + durationInMs);

    const hasConflict = appointments.some(app => {
      const startTimeLocal = new Date(app.date.getTime() - (3 * 60 * 60 * 1000));
      const appDurationInMs = app.service.duration_minutes * 60 * 1000;
      const endTimeLocal = new Date(startTimeLocal.getTime() + appDurationInMs);

      return newStartLocal < endTimeLocal && newEndLocal > startTimeLocal;
    });

    if (hasConflict) {
      throw new Error('Horário não disponível');
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        client_id,
        barber_id,
        service_id,
        status: 'PENDING'
      },
      include: {
        service: true,
        barber: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } }
      }
    });

    return appointment;
  }
}
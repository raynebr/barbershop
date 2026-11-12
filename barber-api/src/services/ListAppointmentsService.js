import { prisma } from '../config/prisma.js';

export class ListAppointmentsService {
  async listClientAppointments(client_id) {
    const appointments = await prisma.appointment.findMany({
      where: { client_id },
      include: {
        service: true,
        barber: { select: { id: true, name: true, avatar_url: true } }
      },
      orderBy: { date: 'asc' }
    });

    return appointments;
  }

  async listBarberAppointments(barber_id) {
    const appointments = await prisma.appointment.findMany({
      where: { barber_id },
      include: {
        service: true,
        client: { select: { id: true, name: true, phone: true, avatar_url: true } }
      },
      orderBy: { date: 'asc' }
    });

    return appointments;
  }
}
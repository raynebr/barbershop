import { prisma } from '../config/prisma.js';

export class CancelAppointmentService {
  async execute(appointmentId, userId) {
    // Verifica se o agendamento existe e pertence ao usuário
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId }
    });

    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    if (appointment.client_id !== userId) {
      throw new Error('Não autorizado a cancelar este agendamento');
    }

    if (appointment.status === 'CANCELLED') {
      throw new Error('Agendamento já está cancelado');
    }

    if (appointment.status === 'COMPLETED') {
      throw new Error('Não é possível cancelar um agendamento concluído');
    }

    const cancelledAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
      include: {
        service: true,
        barber: { select: { id: true, name: true } },
        client: { select: { id: true, name: true } }
      }
    });

    return cancelledAppointment;
  }
}
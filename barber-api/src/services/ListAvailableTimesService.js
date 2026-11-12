import { prisma } from '../config/prisma.js';
import { isSameDay } from 'date-fns';

export class ListAvailableTimesService {
  async listAvailableTimes(barber_id, date) {
    const now = new Date();
    const searchDate = new Date(`${date}T12:00:00Z`);
    const isToday = isSameDay(searchDate, now);

    const appointments = await prisma.appointment.findMany({
      where: {
        barber_id,
        date: {
          gte: new Date(`${date}T00:00:00.000Z`),
          lte: new Date(`${date}T23:59:59.999Z`),
        },
        status: { notIn: ['CANCELLED', 'COMPLETED'] }
      },
      include: {
        service: true
      }
    });

    const barberSchedule = [
      "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
      "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
      "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
    ];

    const available = barberSchedule.filter(slot => {
      const [slotHour, slotMin] = slot.split(':').map(Number);

      if (isToday) {
        const nowBrasilia = new Date(now.getTime() - (3 * 60 * 60 * 1000));
        const slotDateTime = new Date(nowBrasilia);
        slotDateTime.setHours(slotHour, slotMin, 0, 0);

        if (slotDateTime <= nowBrasilia) {
          return false;
        }
      }

      const isOccupied = appointments.some(app => {
        const startTimeLocal = new Date(app.date.getTime() - (3 * 60 * 60 * 1000));
        const durationInMs = app.service.duration_minutes * 60 * 1000;
        const endTimeLocal = new Date(startTimeLocal.getTime() + durationInMs);

        const slotDate = new Date(startTimeLocal);
        slotDate.setUTCHours(slotHour, slotMin, 0, 0);

        return slotDate >= startTimeLocal && slotDate < endTimeLocal;
      });

      return !isOccupied;
    });

    return available;
  }
}
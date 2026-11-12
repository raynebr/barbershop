import { prisma } from '../config/prisma.js';

export class ListBarbersService {
  async listBarbers() {
    const barbers = await prisma.user.findMany({
      where: {
        role: 'BARBER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar_url: true
      }
    });
    return barbers;
  }
}
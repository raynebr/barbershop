import { prisma } from '../config/prisma.js';

export class GetUserRole {
  async execute(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true, avatar_url: true },
    });
  }
}
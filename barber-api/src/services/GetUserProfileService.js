import { prisma } from '../config/prisma.js';

export class GetUserProfileService {
  async execute(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar_url: true,
        created_at: true,
      }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return user;
  }
}

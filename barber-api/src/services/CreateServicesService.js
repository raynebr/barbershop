import { prisma } from '../config/prisma.js';

export class CreateServicesService {
  async execute({ name, description, price, duration_minutes }) {

    const existingService = await prisma.service.findFirst({ where: { name } });

    if (existingService) {
      throw new Error('Serviço já existe');
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        price,
        duration_minutes,
      },
    });

    return {
      message: 'Serviço criado com sucesso',
      service: { name: service.name }
    };
  }
}

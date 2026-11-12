import { prisma } from '../config/prisma.js';

export class GetServicesService {
  async execute() {
    const services = await prisma.service.findMany();

    return services;
  }
}
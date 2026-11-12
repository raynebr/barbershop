import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export class RegisterService {
  async execute({ email, password, name, phone }) {
    if (!email || !password || !name) {
      throw new Error('Email, senha e nome são obrigatórios');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error('Usuário já existe com este email');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password_hash: passwordHash,
        phone,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'barberflow-secret-key',
      { expiresIn: '7d' }
    );

    return {
      message: 'Usuário criado com sucesso',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  }
}

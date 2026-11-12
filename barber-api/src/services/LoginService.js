import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export class LoginService {
  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password_hash) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'barberflow-secret-key',
      { expiresIn: '7d' }
    );

    return {
      message: 'Login realizado com sucesso',
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url },
      token,
    };
  }
}

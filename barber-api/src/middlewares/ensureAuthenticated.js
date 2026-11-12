import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';

export async function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token faltando' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token malformatado' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'barberflow-secret-key');

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, avatar_url: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Token é inválido - usuário não encontrado' });
    }

    req.user = user;
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado', error: err.message });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido', error: err.message });
    }
    return res.status(401).json({ message: 'Falha na autenticação', error: err.message });
  }
}
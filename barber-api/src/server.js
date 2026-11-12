import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { authRoutes } from './routes/auth.js';
import { profileRoutes } from './routes/profile.js';
import { servicesRoutes } from './routes/services.js';
import { appointmentsRoutes } from './routes/appointments.js';
import { listRoutes } from './routes/list.js';

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

const port = Number(process.env.PORT) || 3333;

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/services', servicesRoutes);
app.use('/appointments', appointmentsRoutes);
app.use('/list', listRoutes);

app.get('/hello', (req, res) => {
  return res.json({
    message: 'Back-end vivo e ouvindo!',
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
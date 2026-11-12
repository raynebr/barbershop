import { GetUserRole } from '../services/GetUserRole.js';
import { LoginService } from '../services/LoginService.js';
import { RegisterService } from '../services/RegisterService.js';

export class AuthController {
  async register(request, response) {
    try {
      const { email, password, name, phone } = request.body;

      const result = await new RegisterService().execute({ email, password, name, phone });

      return response.status(201).json(result);
    } catch (error) {
      console.error('Erro no registro:', error);
      const status = error.message.includes('obrigatórios') || error.message.includes('já existe') ? 400 : 500;
      return response.status(status).json({ error: error.message });
    }
  }

  async login(request, response) {
    try {
      const { email, password } = request.body;

      const result = await new LoginService().execute({ email, password });

      return response.status(200).json(result);
    } catch (error) {
      console.error('Erro no login:', error);
      const status = error.message.includes('obrigatórios') ? 400 : error.message.includes('Credenciais') ? 401 : 500;
      return response.status(status).json({ error: error.message });
    }
  }

  async me(request, response) {
    try {
      const { id } = request.user;
      const user = await new GetUserRole().execute(id);
      return response.status(200).json(user);
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao obter sessão.' });
    }
  }
}
import { GetUserProfileService } from '../services/GetUserProfileService.js';

export class ProfileController {
  async index(request, response) {
    try {
      const { id } = request.user;

      const user = await new GetUserProfileService().execute(id);

      return response.status(200).json(user);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      const status = error.message.includes('não encontrado') ? 404 : 500;
      return response.status(status).json({ error: error.message });
    }
  }
}

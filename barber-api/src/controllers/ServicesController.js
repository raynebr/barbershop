import { CreateServicesService } from "../services/CreateServicesService.js";
import { GetServicesService } from "../services/GetServicesService.js";

export class ServicesController {
  async create(request, response) {
    try {
      const { name, description, price, duration_minutes } = request.body;

      const result = await new CreateServicesService().execute({ name, description, price, duration_minutes });

      return response.status(201).json(result);
    } catch (error) {
      console.error('Erro no registro:', error);
      const status = error.message.includes('obrigatórios') || error.message.includes('já existe') ? 400 : 500;
      return response.status(status).json({ error: error.message });
    }
  }

  async list(request, response) {
    try {
      const result = await new GetServicesService().execute();
      return response.status(200).json(result);
    } catch (error) {
      console.error('Erro na listagem:', error);
      return response.status(500).json({ error: 'Erro ao listar serviços' });
    }
  }
}
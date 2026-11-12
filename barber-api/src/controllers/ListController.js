import { ListBarbersService } from "../services/ListBarbersService.js";

export class ListController {
  async listBarbers(request, response) {
    try {
      const barbers = await new ListBarbersService().listBarbers();
      return response.status(200).json(barbers);
    } catch (error) {
      console.error('Erro ao listar barbeiros:', error);
      return response.status(500).json({ error: 'Erro ao listar barbeiros' });
    }
  }
}
// front/src/services/freshdesk/historico-tickets.service.ts
import { api } from '../api';
import { TicketHistoricoDto } from './types';

class HistoricoTicketsService {
  async getHistoricoCliente(clienteId: string, page: number = 1, limit: number = 20): Promise<any> {
    const response = await api.get(`/freshdesk/historico-tickets/cliente/${clienteId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getUltimosTickets(clienteId: string, quantidade: number = 3): Promise<TicketHistoricoDto[]> {
    const response = await api.get(`/freshdesk/historico-tickets/ultimos/${clienteId}?quantidade=${quantidade}`);
    return response.data;
  }

  async getHistoricoPorPeriodo(dataInicio: Date, dataFim: Date, page: number = 1, limit: number = 20): Promise<any> {
    const response = await api.get(
      `/freshdesk/historico-tickets/periodo?dataInicio=${dataInicio.toISOString()}&dataFim=${dataFim.toISOString()}&page=${page}&limit=${limit}`
    );
    return response.data;
  }
}

export const historicoTicketsService = new HistoricoTicketsService();
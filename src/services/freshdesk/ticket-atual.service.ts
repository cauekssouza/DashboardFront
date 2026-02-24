// front/src/services/freshdesk/ticket-atual.service.ts
import { api } from '../api';
import { TicketAtualDto } from './types';

class TicketAtualService {
  async getTicket(id: string): Promise<TicketAtualDto> {
    const response = await api.get(`/freshdesk/ticket-atual/${id}`);
    return response.data;
  }

  async getTicketDoCliente(clienteId: string): Promise<TicketAtualDto | null> {
    const response = await api.get(`/freshdesk/ticket-atual/cliente/${clienteId}`);
    return response.data;
  }

  async listarTickets(status?: string, atendente?: string, page: number = 1, limit: number = 20): Promise<any> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (atendente) params.append('atendente', atendente);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await api.get(`/freshdesk/ticket-atual?${params.toString()}`);
    return response.data;
  }

  async responderTicket(id: string, mensagem: string, publico: boolean = true): Promise<TicketAtualDto> {
    const response = await api.post(`/freshdesk/ticket-atual/${id}/responder`, { mensagem, publico });
    return response.data;
  }

  async resolverTicket(id: string, solucao: string): Promise<TicketAtualDto> {
    const response = await api.post(`/freshdesk/ticket-atual/${id}/resolver`, { solucao });
    return response.data;
  }
}

export const ticketAtualService = new TicketAtualService();
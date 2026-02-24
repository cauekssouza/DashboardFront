// front/src/services/tickets.service.ts
import { api } from './api';

export interface Ticket {
  id: string;
  numero: number;
  assunto: string;
  descricao?: string;
  tipo: string;
  prioridade: number;
  status: number;
  clienteId: string;
  clienteNome: string;
  atendenteId?: string;
  atendenteNome?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  prazoSLA: Date;
  tags: string[];
  respostas?: TicketResposta[];
}

export interface TicketResposta {
  id: string;
  mensagem: string;
  usuarioId: string;
  usuarioNome: string;
  criadoEm: Date;
  publico: boolean;
}

class TicketsService {
  async listar(filtros?: any) {
    const response = await api.get('/tickets', { params: filtros });
    return response.data;
  }

  async buscarPorId(id: string): Promise<Ticket> {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  }

  async criar(dados: Partial<Ticket>): Promise<Ticket> {
    const response = await api.post('/tickets', dados);
    return response.data;
  }

  async atualizar(id: string, dados: Partial<Ticket>): Promise<Ticket> {
    const response = await api.put(`/tickets/${id}`, dados);
    return response.data;
  }

  async responder(id: string, mensagem: string, publico: boolean = true): Promise<TicketResposta> {
    const response = await api.post(`/tickets/${id}/responder`, { mensagem, publico });
    return response.data;
  }

  async resolver(id: string, solucao: string): Promise<Ticket> {
    const response = await api.post(`/tickets/${id}/resolver`, { solucao });
    return response.data;
  }

  async reabrir(id: string, motivo: string): Promise<Ticket> {
    const response = await api.post(`/tickets/${id}/reabrir`, { motivo });
    return response.data;
  }

  async atribuir(id: string, atendenteId: string): Promise<Ticket> {
    const response = await api.post(`/tickets/${id}/atribuir`, { atendenteId });
    return response.data;
  }

  async adicionarTag(id: string, tag: string): Promise<Ticket> {
    const response = await api.post(`/tickets/${id}/tags`, { tag });
    return response.data;
  }

  async removerTag(id: string, tag: string): Promise<Ticket> {
    const response = await api.delete(`/tickets/${id}/tags/${tag}`);
    return response.data;
  }
}

export const ticketsService = new TicketsService();
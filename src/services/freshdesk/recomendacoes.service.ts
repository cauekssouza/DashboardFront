// front/src/services/freshdesk/recomendacoes.service.ts
import { api } from '../api';
import { RecomendacaoDto, RecomendacaoTicketDto } from './types';

class RecomendacoesService {
  async getRecomendacaoPorTicket(ticketId: string): Promise<RecomendacaoDto> {
    const response = await api.get(`/freshdesk/recomendacoes/ticket/${ticketId}`);
    return response.data;
  }

  async getRecomendacoesPorCliente(clienteId: string): Promise<any> {
    const response = await api.get(`/freshdesk/recomendacoes/cliente/${clienteId}`);
    return response.data;
  }

  async getTicketsSlaRisco(limite: number = 10): Promise<RecomendacaoTicketDto[]> {
    const response = await api.get(`/freshdesk/recomendacoes/sla-risco?limite=${limite}`);
    return response.data;
  }

  async aplicarRecomendacao(ticketId: string, acao: string, observacoes?: string): Promise<void> {
    await api.post(`/freshdesk/recomendacoes/ticket/${ticketId}/aplicar`, { acao, observacoes });
  }
}

export const recomendacoesService = new RecomendacoesService();
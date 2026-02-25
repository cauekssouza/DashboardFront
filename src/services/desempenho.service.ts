import { api } from './api';

export type Periodo = '7d' | '30d' | '1m' | '3m' | '6m' | '1y';

export interface PerformanceMetrics {
  periodo: string;
  totalTickets: number;
  ticketsAbertos: number;
  ticketsFechados: number;
  ticketsUrgentes: number;
  ticketsVIP: number;
  ticketsEspecializados: number;
  taxaResolucao: number;
  tempoMedioResposta: number;
  taxaCancelamento: number;
  clientesTotal: number;
  clientesNovos: number;
  scoreRiscoAlto: number;
  scoreRecorrenciaAlta: number;
}

export interface ProfitabilityAnalysis {
  periodo: string;
  totalClientes: number;
  clientesLucrativos: number;
  clientesNaoLucrativos: number;
  ticketsTotal: number;
  ticketsUrgentes: number;
  ticketsVIP: number;
  taxaEsforco: number;
  custoEstimado: number;
  scoreMedio: number;
}

export interface TicketData {
  id: string;
  timestamp: string;
  ticketId: number | null;
  nome: string | null;
  email: string | null;
  assunto: string | null;
  totalTickets: number;
  urgente: boolean;
  vip: boolean;
  especializado: boolean;
  scoreRisco: string | null;
  scoreRecorrencia: string | null;
  classificacao: string | null;
  recomendacao: string | null;
  cancelou: boolean;
  integracao: boolean;
  problemaPagamento: boolean;
  clienteDesde: string | null;
  diasCliente: number;
  status: string | null;
  prazo: string | null;
  periodo: string;
}

export interface FiltrosTickets {
  urgente?: boolean;
  vip?: boolean;
  especializado?: boolean;
  classificacao?: string;
  scoreRisco?: string;
  cancelou?: boolean;
  status?: string;
}

class DesempenhoService {
  private getBackendUrl() {
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  }

  /**
   * Obter TODOS os dados brutos da planilha
   */
  async getAllRawData(periodo: Periodo = '30d'): Promise<any[]> {
    try {
      const response = await api.get(`/sheets/all`, {
        params: { periodo }
      });
      return response.data.data || [];
    } catch (error) {
      console.error('Erro ao buscar dados brutos:', error);
      return [];
    }
  }

  async getPerformance(periodo: Periodo = '30d'): Promise<PerformanceMetrics | null> {
    try {
      const response = await api.get(`/sheets/performance`, {
        params: { periodo }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar métricas de desempenho:', error);
      return null;
    }
  }

  async getProfitability(periodo: Periodo = '30d'): Promise<ProfitabilityAnalysis | null> {
    try {
      const response = await api.get(`/sheets/profitability`, {
        params: { periodo }
      });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar análise de lucratividade:', error);
      return null;
    }
  }

  async getTickets(periodo: Periodo = '30d', filtros?: FiltrosTickets, limit?: number): Promise<TicketData[]> {
    try {
      const params: any = { periodo };
      if (filtros) {
        if (filtros.urgente !== undefined) params.urgente = filtros.urgente;
        if (filtros.vip !== undefined) params.vip = filtros.vip;
        if (filtros.especializado !== undefined) params.especializado = filtros.especializado;
        if (filtros.classificacao) params.classificacao = filtros.classificacao;
        if (filtros.scoreRisco) params.scoreRisco = filtros.scoreRisco;
        if (filtros.cancelou !== undefined) params.cancelou = filtros.cancelou;
        if (filtros.status) params.status = filtros.status;
      }
      if (limit) params.limit = limit;

      const response = await api.get(`/sheets/tickets`, { params });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar tickets:', error);
      return [];
    }
  }

  async exportData(periodo: Periodo = '30d', formato: 'csv' | 'json' = 'csv') {
    try {
      const response = await api.get(`/sheets/export`, {
        params: { periodo, formato },
        responseType: formato === 'json' ? 'json' : 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }

  async refreshData(periodo: Periodo = '30d') {
    try {
      // Usar GET em vez de POST, pois o backend espera query params
      const response = await api.get(`/sheets/refresh`, {
        params: { periodo }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      throw error;
    }
  }

  downloadFile(data: string | object, filename: string, contentType: string = 'text/csv') {
    const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], {
      type: contentType
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
}

export const desempenhoService = new DesempenhoService();


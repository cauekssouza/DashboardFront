import { api } from './api';

export interface DadosBrutos {
  timestamp: string;
  ticketId: number;
  assunto: string;
  totalTickets: number;
  urgente: boolean;
  vip: boolean;
  especializado: boolean;
  scoreRisco: string;
  scoreRecorrencia: string;
  classificacao: string;
  cancelou: boolean;
  integracao: boolean;
  problemaPagamento: boolean;
  clienteDesde: string;
  diasCliente: number;
  status: number;
  prazo: string;
}

export interface TicketAtual {
  id: number;
  assunto: string;
  tipo: string;
  prioridade: number;
  prioridadeLabel: string;
  status: number;
  statusLabel: string;
  criadoEm: string;
  prazoFinal: string;
}

export interface DashboardData {
  alertas: any;
  perfil: any;
  historicoComportamento: any;
  ticketAtual: TicketAtual;
  recomendacoes: any[];
  metricas: any;
  historico: any[];
  dadosBrutos: DadosBrutos[];
}

class PlanilhaService {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get('/planilha/dashboard');
    return response.data.data;
  }

  async getDadosBrutos(): Promise<DadosBrutos[]> {
    const response = await api.get('/planilha/dados-brutos');
    return response.data;
  }

  async getTicketAtual(): Promise<TicketAtual> {
    const response = await api.get('/planilha/ticket-atual');
    return response.data;
  }

  async getUltimosTickets(): Promise<any[]> {
    const response = await api.get('/planilha/ultimos-tickets');
    return response.data;
  }
}

export const planilhaService = new PlanilhaService();
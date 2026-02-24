// front/src/services/freshdesk/types.ts
export enum ScoreRisco {
  ALTO = 'ALTO',
  MEDIO = 'MÉDIO',
  BAIXO = 'BAIXO'
}

export enum ScoreRecorrencia {
  ALTA = 'ALTA',
  MEDIA = 'MÉDIA',
  BAIXA = 'BAIXA'
}

export enum ClassificacaoCliente {
  VIP = 'VIP',
  RECORRENTE = 'RECORRENTE',
  OCASIONAL = 'OCASIONAL',
  NOVO = 'NOVO',
  COMUM = 'COMUM'
}

export enum StatusTicket {
  ABERTO = 2,
  PENDENTE = 3,
  RESOLVIDO = 4,
  FECHADO = 5
}

export enum PrioridadeTicket {
  BAIXA = 1,
  MEDIA = 2,
  ALTA = 3,
  URGENTE = 4
}

// Alertas
export interface AlertasDto {
  flagUrgente: boolean;
  flagVIP: boolean;
  flagEspecializado: boolean;
  scoreRisco: ScoreRisco;
  scoreRecorrencia: ScoreRecorrencia;
  classificacao: ClassificacaoCliente;
  dadosAdicionais?: {
    totalCancelamentos?: number;
    ticketsAbertos?: number;
    tempoMedioResolucao?: number;
  };
}

// Recomendações
export interface RecomendacaoDto {
  id?: string;
  acaoSugerida: string;
  detalhes: string;
  prioridadeSugerida: number;
  prazoRecomendado?: Date;
  categoria?: string;
  automatica?: boolean;
  criadoEm?: Date;
}

export interface RecomendacaoTicketDto {
  ticketId: string;
  ticketNumero: number;
  assunto: string;
  clienteId: string;
  clienteNome: string;
  prioridade: string;
  slaEmRisco: boolean;
  tempoRestanteSLA?: number;
  recomendacao: RecomendacaoDto;
  criadoEm: Date;
}

// Perfil Cliente
export interface PerfilClienteDto {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  totalTickets: number;
  clienteDesde: Date;
  diasComoCliente: number;
  ticketsAbertos: number;
  ticketsResolvidos: number;
  ticketsCancelados: number;
  ultimoTicket: Date;
  ultimoTicketDias: number;
  ticketMedioResolucao: number;
  processadoEm: Date;
}

// Ticket Atual
export interface TicketAtualDto {
  id: string;
  numero: number;
  assunto: string;
  descricao?: string;
  tipo: string;
  prioridade: number;
  prioridadeLabel: string;
  status: number;
  statusLabel: string;
  criadoEm: Date;
  atualizadoEm: Date;
  prazoSLA: Date;
  prazoPrimeiraResposta: Date;
  slaEmRisco: boolean;
  tempoRestanteSLA: number;
  grupo?: string;
  atendente?: string;
  tags?: string[];
}

// Métricas
export interface MetricasDto {
  ticketsHoje: number;
  ticketsAbertos: number;
  ticketsEmAndamento: number;
  ticketsResolvidosHoje: number;
  tempoMedioResposta: number;
  tempoMedioResolucao: number;
  slaCumprido: number;
  csatMedio: number;
}

// Histórico
export interface TicketHistoricoDto {
  id: string;
  numero: number;
  assunto: string;
  criadoEm: Date;
  resolvidoEm?: Date;
  status: string;
  prioridade: string;
  tipo: string;
  atendente?: string;
  tempoResolucao?: number;
  avaliacao?: number;
}

// Dashboard Completo
export interface DashboardCompletoDto {
  alertas: AlertasDto;
  perfil: PerfilClienteDto;
  ticketAtual: TicketAtualDto | null;
  recomendacoes: RecomendacaoDto[];
  metricas: MetricasDto;
  historico: TicketHistoricoDto[];
  timestamp: string;
}
// src/types/freshdesk.ts
export type RiskLevel = 'ALTO' | 'MÉDIO' | 'BAIXO'
export type PriorityLevel = 'ALTA' | 'MÉDIA' | 'BAIXA'
export type Classification = 'VIP' | 'COMUM' | 'ESPECIALIZADO'

export interface ClientProfile {
  totalTickets: number
  clientSince: string
  clientSinceDays: number
  ticketsAbertos: number
  ultimoTicket: string
  ultimoTicketDays: number
  processadoEm: string
}

export interface AlertsAndPriorities {
  flagUrgente: boolean
  flagVIP: boolean
  flagEspecializado: boolean
  scoreRisco: RiskLevel
  scoreRecorrencia: PriorityLevel
  classificacao: Classification
}

export interface Recommendations {
  acaoSugerida: string
  detalhes: string
  prioridadeSugerida: number
}

export interface HistoryAndBehavior {
  jaCancelouAntes: boolean
  problemaPagamento: boolean
  precisouIntegracao: boolean
}

export interface CurrentTicket {
  id: number
  assunto: string
  tipo: string
  prioridade: number
  prioridadeLabel: string
  status: number
  statusLabel: string
  criadoEm: string
  atualizadoEm: string
  prazoFinal: string
  prazoFR: string
  formID: number
  escalado: boolean
  grupo?: string
  solicitante?: string
  empresa?: string
}

export interface TicketHistory {
  id: number
  assunto: string
  criadoEm: string
  status: string
}

export interface FreshdeskDashboardData {
  alertas: AlertsAndPriorities
  recomendacoes: Recommendations
  perfilCliente: ClientProfile
  historicoComportamento: HistoryAndBehavior
  ticketAtual: CurrentTicket
  ultimosTickets: TicketHistory[]
  dadosBrutos: Record<string, any>
}
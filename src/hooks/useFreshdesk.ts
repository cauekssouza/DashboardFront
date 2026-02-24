// front/src/hooks/useFreshdesk.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '@/services/freshdesk/dashboard.service';
import { DashboardCompletoDto } from '@/services/freshdesk/types';

export function useFreshdesk(clienteId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<DashboardCompletoDto | null>(null);
  const [alertas, setAlertas] = useState<any>(null);
  const [perfil, setPerfil] = useState<any>(null);
  const [ticketAtual, setTicketAtual] = useState<any>(null);
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<any>(null);
  const [historico, setHistorico] = useState<any[]>([]);

  const carregarDashboard = useCallback(async () => {
    if (!clienteId) {
      setError('ID do cliente não fornecido');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await dashboardService.getDashboardCompleto(clienteId);
      
      setDashboard(data);
      setAlertas(data.alertas);
      setPerfil(data.perfil);
      setTicketAtual(data.ticketAtual);
      setRecomendacoes(data.recomendacoes || []);
      setMetricas(data.metricas);
      setHistorico(data.historico || []);
      
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    if (clienteId) {
      carregarDashboard();
    }
  }, [clienteId, carregarDashboard]);

  const recarregar = useCallback(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  return {
    loading,
    error,
    dashboard,
    alertas,
    perfil,
    ticketAtual,
    recomendacoes,
    metricas,
    historico,
    recarregar
  };
}
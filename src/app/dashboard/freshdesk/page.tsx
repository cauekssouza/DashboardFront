// front/src/app/dashboard/freshdesk/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Download, 
  Calendar, 
  AlertCircle,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Cards
import { AlertasCard } from '@/components/freshdaesk/AlertasCard';
import { PerfilClienteCard } from '@/components/freshdaesk/PerfilClienteCard';
import { HistoricoComportamentoCard } from '@/components/freshdaesk/HistoricoComportamentoCard';
import { TicketAtualCard } from '@/components/freshdaesk/TicketAtualCard';
import { RecomendacoesCard } from '@/components/freshdaesk/RecomendacoesCard';
import { MetricasCard } from '@/components/freshdaesk/MetricasCard';
import { HistoricoTicketsTable } from '@/components/freshdaesk/HistoricoTicketsTable';
import { PlanilhaDataCard } from '@/components/freshdaesk/PlanilhaDataCard';

// Services
import { api } from '@/services/api';
import { toast } from 'sonner';

// Tipos de período
type Periodo = '7d' | '30d' | '1m' | '3m' | '6m' | '1y';

interface PeriodoOption {
  value: Periodo;
  label: string;
  descricao: string;
}

const PERIODOS: PeriodoOption[] = [
  { value: '7d', label: 'Últimos 7 dias', descricao: 'Última semana' },
  { value: '30d', label: 'Últimos 30 dias', descricao: 'Último mês' },
  { value: '1m', label: 'Último mês', descricao: 'Mês atual' },
  { value: '3m', label: 'Últimos 3 meses', descricao: 'Trimestre' },
  { value: '6m', label: 'Últimos 6 meses', descricao: 'Semestre' },
  { value: '1y', label: 'Último ano', descricao: 'Ano completo' },
];

export default function FreshdeskDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const [clienteId] = useState('1008006'); // ID do cliente fixo ou dinâmico

  const carregarDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/freshdesk/dashboard/${clienteId}`, {
        params: { periodo }
      });
      setData(response.data.data);
      toast.success(`Dashboard atualizado! Período: ${getPeriodoLabel(periodo)}`);
    } catch (err: any) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.message || 'Erro ao conectar com o servidor');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [clienteId, periodo]);

  // Carregar dados quando o período mudar
  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  // Função para obter label do período
  const getPeriodoLabel = (p: Periodo): string => {
    return PERIODOS.find(opt => opt.value === p)?.label || 'Últimos 30 dias';
  };

  // Função para exportar dados
  const exportarDashboard = async (formato: 'csv' | 'json' | 'pdf') => {
    setExporting(true);
    try {
      const response = await api.get(`/freshdesk/export/${clienteId}`, {
        params: { periodo, formato },
        responseType: formato === 'json' ? 'json' : 'blob',
      });

      // Criar link de download
      const url = window.URL.createObjectURL(
        new Blob([formato === 'csv' ? response.data : JSON.stringify(response.data, null, 2)])
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `dashboard-${clienteId}-${periodo}.${formato === 'pdf' ? 'json' : formato}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Dashboard exportado em formato ${formato.toUpperCase()}`);
    } catch (err: any) {
      console.error('Erro ao exportar:', err);
      toast.error('Erro ao exportar dashboard');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen p-6">
          <div className="text-center space-y-4 max-w-md">
            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-full inline-block mx-auto">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Erro de Conexão</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={carregarDashboard} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Atendimento</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe métricas, gerencie tickets e ofereça o melhor suporte
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selector de Período */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {getPeriodoLabel(periodo)}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {PERIODOS.map((p) => (
                  <DropdownMenuItem 
                    key={p.value}
                    onClick={() => setPeriodo(p.value)}
                    className={periodo === p.value ? 'bg-accent' : ''}
                  >
                    <div className="flex flex-col">
                      <span>{p.label}</span>
                      <span className="text-xs text-muted-foreground">{p.descricao}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Menu de Exportação */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={exporting}>
                  {exporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportarDashboard('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportarDashboard('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportarDashboard('pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="default" size="sm" onClick={carregarDashboard} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Indicador de período atual */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Período selecionado:</span>
          <span className="font-medium text-foreground">{getPeriodoLabel(periodo)}</span>
          {data?.periodoLabel && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{data.periodoLabel}</span>
            </>
          )}
        </div>

        {/* Cards */}
        <div className="grid gap-6 lg:grid-cols-4">
          {data?.alertas && <AlertasCard data={data.alertas} />}
          {data?.perfil && <PerfilClienteCard data={data.perfil} />}
          {data?.historicoComportamento && (
            <HistoricoComportamentoCard data={data.historicoComportamento} />
          )}
          <PlanilhaDataCard />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {data?.ticketAtual && <TicketAtualCard data={data.ticketAtual} />}
          {data?.recomendacoes && (
            <RecomendacoesCard 
              recomendacoes={data.recomendacoes} 
              onAplicar={(id) => toast.success('Recomendação aplicada!')}
              onIgnorar={(id) => toast.info('Recomendação ignorada')}
            />
          )}
        </div>

        {data?.metricas && <MetricasCard data={data.metricas} />}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">📝 Histórico de Tickets</h2>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/tickets'}>
              Ver todos
            </Button>
          </div>
          {data?.historico && data.historico.length > 0 ? (
            <HistoricoTicketsTable 
              tickets={data.historico} 
              onVerDetalhes={(id) => console.log('Ver ticket:', id)}
            />
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground">Nenhum ticket no histórico</p>
            </div>
          )}
        </div>

        {/* Resumo rápido */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {data?.metricas?.ticketsHoje || 0}
            </p>
            <p className="text-xs text-muted-foreground">Tickets hoje</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {data?.metricas?.ticketsAbertos || 0}
            </p>
            <p className="text-xs text-muted-foreground">Abertos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {data?.metricas?.ticketsResolvidosHoje || 0}
            </p>
            <p className="text-xs text-muted-foreground">Resolvidos hoje</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {data?.metricas?.totalTickets || 0}
            </p>
            <p className="text-xs text-muted-foreground">Total período</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


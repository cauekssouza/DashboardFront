'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Activity,
  Ticket, 
  Users,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { desempenhoService, type PerformanceMetrics, type ProfitabilityAnalysis, type TicketData } from '@/services/desempenho.service';
import { toast } from 'sonner';

interface PeriodoOption {
  value: string;
  label: string;
}

const PERIODOS: PeriodoOption[] = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '1m', label: '1 mês' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1y', label: '1 ano' },
];

export default function Dashboard() {
  const [periodo, setPeriodo] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [profitability, setProfitability] = useState<ProfitabilityAnalysis | null>(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);

  const getPeriodoLabel = (p: string): string => {
    return PERIODOS.find(opt => opt.value === p)?.label || '30 dias';
  };

  // Verificar se o backend está online
  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:3001/sheets/latest', {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      setBackendOnline(response.ok);
      return response.ok;
    } catch {
      setBackendOnline(false);
      return false;
    }
  };

  // Buscar dados do backend
  const carregarDados = async () => {
    if (!backendOnline) return;
    
    setLoading(true);
    try {
      const [metricsData, profitabilityData, ticketsData] = await Promise.all([
        desempenhoService.getPerformance(periodo as any),
        desempenhoService.getProfitability(periodo as any),
        desempenhoService.getTickets(periodo as any, undefined, 500)
      ]);
      
      setMetrics(metricsData);
      setProfitability(profitabilityData);
      setTickets(ticketsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verificar backend ao iniciar
  useEffect(() => {
    checkBackend();
  }, []);

  // Quando Auto estiver ON, buscar dados
  useEffect(() => {
    if (autoRefresh && backendOnline) {
      carregarDados();
    } else if (!autoRefresh) {
      // Limpar dados quando Auto estiver OFF
      setMetrics(null);
      setProfitability(null);
      setTickets([]);
      setLastUpdate(null);
    }
  }, [autoRefresh, backendOnline]);

  // Atualizar quando mudar o período
  useEffect(() => {
    if (autoRefresh && backendOnline) {
      carregarDados();
    }
  }, [periodo]);

  // Verificar backend periodicamente
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        checkBackend();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleExport = async (formato: 'csv' | 'json') => {
    if (!backendOnline) {
      toast.error('Backend offline. Conecte o backend para exportar.');
      return;
    }
    try {
      const response = await desempenhoService.exportData(periodo as any, formato);
      if (formato === 'csv') {
        desempenhoService.downloadFile(response.data, `dashboard-${periodo}.csv`, 'text/csv');
      }
      toast.success(`Exportado em ${formato.toUpperCase()}`);
    } catch (error) {
      toast.error('Erro ao exportar');
    }
  };

  const hasData = metrics !== null && metrics.totalTickets > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 lg:p-8">
      {/* Header profissional */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Dashboard de Atendimento
                </h1>
                <p className="text-slate-500 text-sm">
                  {autoRefresh ? (backendOnline ? 'Conectado - dados em tempo real' : 'Conectando...') : 'Desconectado - ative para ver os dados'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Controles */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Status do Backend */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
              backendOnline ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {backendOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-xs font-medium">
                {backendOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Menu de períodos */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Calendar className="w-4 h-4 mr-2" />
                  {getPeriodoLabel(periodo)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {PERIODOS.map((p) => (
                  <DropdownMenuItem 
                    key={p.value}
                    onClick={() => setPeriodo(p.value)}
                    className={periodo === p.value ? 'bg-blue-50 text-blue-700' : ''}
                  >
                    {p.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Exportar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9" disabled={!backendOnline}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>Exportar CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>Exportar JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auto-refresh - agora é o toggle de conexão */}
            <div className="flex items-center gap-2 ml-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              <Switch 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh} 
                id="auto-refresh" 
                className="data-[state=checked]:bg-green-500"
                disabled={!backendOnline}
              />
              <Label htmlFor="auto-refresh" className="text-xs text-slate-500 cursor-pointer">
                {autoRefresh ? 'Conectado' : 'Conectar'}
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-7xl mx-auto mb-4">
          <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-xl">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-blue-700">Carregando dados...</span>
          </div>
        </div>
      )}

      {/* Última atualização */}
      {lastUpdate && autoRefresh && (
        <div className="max-w-7xl mx-auto mb-4 text-center">
          <p className="text-xs text-slate-400">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      )}

      {/* KPIs - Cards principais */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Ticket className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Total de Tickets</p>
          <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
            {autoRefresh && backendOnline ? (metrics?.totalTickets ?? '-') : '-'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Clientes Ativos</p>
          <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
            {autoRefresh && backendOnline ? (metrics?.clientesTotal ?? '-') : '-'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Ticket Médio</p>
          <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
            {autoRefresh && backendOnline ? (metrics?.clientesTotal ? (metrics.totalTickets / metrics.clientesTotal).toFixed(1) : '-') : '-'}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-50 rounded-xl">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Taxa de Esforço</p>
          <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
            {autoRefresh && backendOnline ? (profitability?.taxaEsforco?.toFixed(1) ?? '-') : '-'}%
          </p>
        </div>
      </div>

      {/* Gráficos principais */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            Tickets por Período
          </h2>
          <div className={`h-[280px] flex items-center justify-center rounded-xl ${
            autoRefresh && backendOnline && hasData ? 'bg-slate-50' : 'bg-slate-50'
          }`}>
            {autoRefresh && backendOnline && hasData ? (
              <p className="text-slate-400">Gráfico configurado</p>
            ) : (
              <p className="text-slate-300">
                {autoRefresh && !backendOnline ? 'Aguardando conexão com o backend...' : 'Ative para ver os dados'}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            Tendência
          </h2>
          <div className={`h-[280px] flex items-center justify-center rounded-xl`}>
            {autoRefresh && backendOnline && hasData ? (
              <p className="text-slate-400">Gráfico configurado</p>
            ) : (
              <p className="text-slate-300">
                {autoRefresh && !backendOnline ? 'Aguardando conexão com o backend...' : 'Ative para ver os dados'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Indicadores rápidos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Tickets Urgentes</p>
                <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
                  {autoRefresh && backendOnline ? (metrics?.ticketsUrgentes ?? '-') : '-'}
                </p>
              </div>
              <div className="p-3 bg-slate-200 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Clientes VIP</p>
                <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
                  {autoRefresh && backendOnline ? (metrics?.ticketsVIP ?? '-') : '-'}
                </p>
              </div>
              <div className="p-3 bg-slate-200 rounded-xl">
                <Star className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">Resolução</p>
                <p className={`text-3xl font-bold mt-1 ${hasData ? 'text-slate-800' : 'text-slate-300'}`}>
                  {autoRefresh && backendOnline ? (metrics?.taxaResolucao?.toFixed(1) ?? '-') : '-'}%
                </p>
              </div>
              <div className="p-3 bg-slate-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-slate-400">
          Período: <span className="font-medium text-slate-500">{getPeriodoLabel(periodo)}</span>
          {lastUpdate && autoRefresh && (
            <> • Última sync: <span className="font-medium text-slate-500">{lastUpdate.toLocaleTimeString('pt-BR')}</span></>
          )}
        </p>
      </div>
    </div>
  );
}


'use client'

import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  Download, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown,
  Users,
  Ticket,
  AlertTriangle,
  Star,
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Loader2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { 
  desempenhoService, 
  type Periodo, 
  type PerformanceMetrics, 
  type ProfitabilityAnalysis,
  type TicketData,
  type FiltrosTickets
} from '@/services/desempenho.service';
import { toast } from 'sonner';

interface PeriodoOption {
  value: Periodo;
  label: string;
  descricao: string;
}

const PERIODOS: PeriodoOption[] = [
  { value: '7d', label: 'Últimos 7 dias', descricao: 'Última semana' },
  { value: '30d', label: 'Últimos 30 dias', descricao: 'Mês atual' },
  { value: '1m', label: 'Último mês', descricao: 'Mês completo' },
  { value: '3m', label: 'Últimos 3 meses', descricao: 'Trimestre' },
  { value: '6m', label: 'Últimos 6 meses', descricao: 'Semestre' },
  { value: '1y', label: 'Último ano', descricao: 'Ano completo' },
];

export default function DesempenhoPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [profitability, setProfitability] = useState<ProfitabilityAnalysis | null>(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  
  // Filtros
  const [filtros, setFiltros] = useState<FiltrosTickets>({});
  const [showFilters, setShowFilters] = useState(false);

  const getPeriodoLabel = (p: Periodo): string => {
    return PERIODOS.find(opt => opt.value === p)?.label || 'Últimos 30 dias';
  };

  const carregarDados = useCallback(async () => {
    try {
      const [metricsData, profitabilityData, ticketsData] = await Promise.all([
        desempenhoService.getPerformance(periodo),
        desempenhoService.getProfitability(periodo),
        desempenhoService.getTickets(periodo, filtros, 100)
      ]);
      
      setMetrics(metricsData);
      setProfitability(profitabilityData);
      setTickets(ticketsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, [periodo, filtros]);

  // Carregar dados iniciais e configurar polling
  useEffect(() => {
    setLoading(true);
    carregarDados();
  }, [carregarDados]);

  // Polling automático a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refresh: atualizando dados...');
      carregarDados();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [autoRefresh, carregarDados]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await desempenhoService.refreshData(periodo);
      await carregarDados();
      toast.success('Dados atualizados com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar dados');
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (formato: 'csv' | 'json') => {
    setExporting(true);
    try {
      const response = await desempenhoService.exportData(periodo, formato);
      
      if (formato === 'csv') {
        desempenhoService.downloadFile(
          response.data, 
          `desempenho-atendimento-${periodo}.csv`,
          'text/csv'
        );
      } else {
        desempenhoService.downloadFile(
          response, 
          `desempenho-atendimento-${periodo}.json`,
          'application/json'
        );
      }
      
      toast.success(`Dados exportados em formato ${formato.toUpperCase()}`);
    } catch (error) {
      toast.error('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const handleFiltroChange = (key: keyof FiltrosTickets, value: boolean | string | undefined) => {
    setFiltros(prev => {
      if (value === undefined || value === '') {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: value };
    });
  };

  const clearFilters = () => {
    setFiltros({});
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Carregando dados de desempenho...</p>
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
            <h1 className="text-3xl font-bold tracking-tight">📊 Desempenho de Atendimento</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe métricas de desempenho e lucratividade do atendimento
            </p>
            {lastUpdate && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <RefreshCw className="h-3 w-3" />
                Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                {autoRefresh && <Badge variant="outline" className="ml-2 text-xs">Auto-atualização ativada</Badge>}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Selector de Período */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  {getPeriodoLabel(periodo)}
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

            {/* Botão de filtros */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {Object.keys(filtros).length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(filtros).length}
                </Badge>
              )}
            </Button>

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
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="default" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            
            {/* Toggle Auto-refresh */}
            <div className="flex items-center gap-2 ml-2">
              <Switch 
                checked={autoRefresh} 
                onCheckedChange={setAutoRefresh}
                id="auto-refresh"
              />
              <Label htmlFor="auto-refresh" className="text-xs text-muted-foreground cursor-pointer">
                Auto
              </Label>
            </div>
          </div>
        </div>

        {/* Painel de Filtros */}
        {showFilters && (
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar Filtros
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="urgente" 
                    checked={filtros.urgente === true}
                    onCheckedChange={(checked) => handleFiltroChange('urgente', checked ? true : undefined)}
                  />
                  <Label htmlFor="urgente" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                    Urgente
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vip" 
                    checked={filtros.vip === true}
                    onCheckedChange={(checked) => handleFiltroChange('vip', checked ? true : undefined)}
                  />
                  <Label htmlFor="vip" className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    VIP
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="especializado" 
                    checked={filtros.especializado === true}
                    onCheckedChange={(checked) => handleFiltroChange('especializado', checked ? true : undefined)}
                  />
                  <Label htmlFor="especializado" className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-purple-500" />
                    Especializado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="cancelou" 
                    checked={filtros.cancelou === true}
                    onCheckedChange={(checked) => handleFiltroChange('cancelou', checked ? true : undefined)}
                  />
                  <Label htmlFor="cancelou" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-orange-500" />
                    Cancelou
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Score Risco</Label>
                  <Select 
                    value={filtros.scoreRisco || ''} 
                    onValueChange={(value) => handleFiltroChange('scoreRisco', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALTO">Alto</SelectItem>
                      <SelectItem value="MEDIO">Médio</SelectItem>
                      <SelectItem value="BAIXO">Baixo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Classificação</Label>
                  <Select 
                    value={filtros.classificacao || ''} 
                    onValueChange={(value) => handleFiltroChange('classificacao', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIP">VIP</SelectItem>
                      <SelectItem value="ESPECIAL">Especial</SelectItem>
                      <SelectItem value="PADRAO">Padrão</SelectItem>
                      <SelectItem value="PROBLEMA">Problema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de Métricas Principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Tickets</p>
                  <p className="text-3xl font-bold">{metrics?.totalTickets || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Ticket className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {metrics?.ticketsAbertos || 0} abertos • {metrics?.ticketsFechados || 0} fechados
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Resolução</p>
                  <p className="text-3xl font-bold text-green-600">
                    {metrics?.taxaResolucao?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Meta: 80%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Ativos</p>
                  <p className="text-3xl font-bold">{metrics?.clientesTotal || 0}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {metrics?.clientesNovos || 0} novos neste período
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxa de Esforço</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {profitability?.taxaEsforco?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Tickets urgentes / total
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Análise de Lucratividade */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Clientes Lucrativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {profitability?.clientesLucrativos || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                de {profitability?.totalClientes || 0} clientes total
              </p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ 
                    width: `${profitability?.totalClientes 
                      ? (profitability.clientesLucrativos / profitability.totalClientes * 100) 
                      : 0}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Clientes Não Lucrativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-600">
                {profitability?.clientesNaoLucrativos || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                requieren mais esforço
              </p>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500"
                  style={{ 
                    width: `${profitability?.totalClientes 
                      ? (profitability.clientesNaoLucrativos / profitability.totalClientes * 100) 
                      : 0}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-600" />
                Score Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">
                {profitability?.scoreMedio?.toFixed(0) || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                de 100 pontos
              </p>
              <div className="mt-4 flex gap-1">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < Math.ceil((profitability?.scoreMedio || 0) / 10)
                        ? 'bg-yellow-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicadores de Alerta */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className={metrics?.ticketsUrgentes && metrics.ticketsUrgentes > 0 ? "border-red-300" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tickets Urgentes</p>
                  <p className="text-2xl font-bold text-red-600">{metrics?.ticketsUrgentes || 0}</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes VIP</p>
                  <p className="text-2xl font-bold text-yellow-600">{metrics?.ticketsVIP || 0}</p>
                </div>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Score Risco Alto</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics?.scoreRiscoAlto || 0}</p>
                </div>
                <TrendingDown className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recorrência Alta</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics?.scoreRecorrenciaAlta || 0}</p>
                </div>
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Tickets Recentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>📋 Tickets ({tickets.length})</CardTitle>
              <Badge variant="outline">
                Período: {getPeriodoLabel(periodo)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Ticket ID</th>
                      <th className="text-left p-2">Cliente</th>
                      <th className="text-left p-2">Assunto</th>
                      <th className="text-left p-2">Total</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Classificação</th>
                      <th className="text-left p-2">Score Risco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.slice(0, 20).map((ticket, idx) => (
                      <tr key={ticket.id || idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-mono">{ticket.ticketId || '-'}</td>
                        <td className="p-2">{ticket.nome || ticket.email || '-'}</td>
                        <td className="p-2">{ticket.assunto || '-'}</td>
                        <td className="p-2">{ticket.totalTickets}</td>
                        <td className="p-2">
                          {ticket.urgente && <Badge variant="destructive" className="mr-1">Urgente</Badge>}
                          {ticket.vip && <Badge className="bg-yellow-500 mr-1">VIP</Badge>}
                          {ticket.especializado && <Badge className="bg-purple-500 mr-1">Esp</Badge>}
                          {!ticket.urgente && !ticket.vip && !ticket.especializado && 
                            <Badge variant="outline">{ticket.status || 'N/A'}</Badge>
                          }
                        </td>
                        <td className="p-2">{ticket.classificacao || '-'}</td>
                        <td className="p-2">
                          <Badge variant={ticket.scoreRisco === 'ALTO' ? 'destructive' : 'outline'}>
                            {ticket.scoreRisco || '-'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tickets.length > 20 && (
                  <p className="text-center text-muted-foreground p-4">
                    Mostrando 20 de {tickets.length} tickets. Exporte para ver todos.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum ticket encontrado para o período e filtros selecionados.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo Final */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics?.ticketsVIP || 0}</p>
            <p className="text-xs text-muted-foreground">VIPs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics?.ticketsEspecializados || 0}</p>
            <p className="text-xs text-muted-foreground">Especializados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{metrics?.taxaCancelamento?.toFixed(1) || 0}%</p>
            <p className="text-xs text-muted-foreground">Taxa Cancelamento</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {profitability?.ticketsTotal ? (profitability.ticketsVIP / profitability.ticketsTotal * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">% Tickets VIP</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


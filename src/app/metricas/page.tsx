'use client'

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Users,
  Ticket,
  Download,
  Calendar,
  Star,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface Metricas {
  ticketsHoje: number;
  ticketsAbertos: number;
  ticketsEmAndamento: number;
  ticketsResolvidosHoje: number;
  tempoMedioResposta: number;
  tempoMedioResolucao: number;
  slaCumprido: number;
  csatMedio: number;
}

export default function MetricasPage() {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30d');
  const [metricas, setMetricas] = useState<Metricas | null>(null);

  useEffect(() => {
    carregarMetricas();
  }, [periodo]);

  const carregarMetricas = async () => {
    try {
      setLoading(true);
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
      toast.error('Erro ao carregar métricas');
      setMetricas(null); // 🔥 ZERADO SE DER ERRO
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <h1 className="text-3xl font-bold tracking-tight">Métricas</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe o desempenho do atendimento
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={carregarMetricas}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Tickets</p>
                  <p className="text-3xl font-bold">{metricas?.ticketsHoje || 0}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tempo Médio Resposta</p>
                  <p className="text-3xl font-bold">{metricas?.tempoMedioResposta || 0} min</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SLA Cumprido</p>
                  <p className="text-3xl font-bold">{metricas?.slaCumprido || 0}%</p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">CSAT Médio</p>
                  <p className="text-3xl font-bold">{metricas?.csatMedio || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <Tabs defaultValue="visao-geral" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
            <TabsTrigger value="evolucao">Evolução</TabsTrigger>
            <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
          </TabsList>

          <TabsContent value="visao-geral" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Status</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tickets por Prioridade</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="evolucao">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Tickets</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detalhado">
            <Card>
              <CardHeader>
                <CardTitle>Métricas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tickets Abertos</p>
                    <p className="text-2xl font-bold mt-2">{metricas?.ticketsAbertos || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Em Andamento</p>
                    <p className="text-2xl font-bold mt-2">{metricas?.ticketsEmAndamento || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Resolvidos Hoje</p>
                    <p className="text-2xl font-bold mt-2">{metricas?.ticketsResolvidosHoje || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Tempo Resolução</p>
                    <p className="text-2xl font-bold mt-2">{metricas?.tempoMedioResolucao || 0}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
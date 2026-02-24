'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, CheckCircle2, Star } from 'lucide-react';

interface MetricasCardProps {
  data?: {
    ticketsHoje?: number;
    ticketsAbertos?: number;
    ticketsResolvidosHoje?: number;
    tempoMedioResposta?: number;
    tempoMedioResolucao?: number;
    slaCumprido?: number;
    csatMedio?: number;
  };
}

export function MetricasCard({ data }: MetricasCardProps) {
  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma métrica disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">📊 Métricas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{data.ticketsHoje || 0}</p>
            <p className="text-xs">Tickets hoje</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{data.ticketsAbertos || 0}</p>
            <p className="text-xs">Abertos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{data.ticketsResolvidosHoje || 0}</p>
            <p className="text-xs">Resolvidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{data.csatMedio || 0}</p>
            <p className="text-xs">CSAT</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
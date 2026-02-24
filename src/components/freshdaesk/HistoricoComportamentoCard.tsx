'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, XCircle, CheckCircle2 } from 'lucide-react';

interface HistoricoComportamentoCardProps {
  data?: {
    jaCancelouAntes?: boolean;
    problemaPagamento?: boolean;
    precisouIntegracao?: boolean;
    mediaAvaliacoes?: number;
    ticketsPorMes?: number;
  };
}

export function HistoricoComportamentoCard({ data }: HistoricoComportamentoCardProps) {
  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum histórico disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">📋 Histórico</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Cancelou antes:</span>
          {data.jaCancelouAntes ? (
            <Badge variant="destructive">SIM</Badge>
          ) : (
            <Badge variant="outline">NÃO</Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Problema pagamento:</span>
          {data.problemaPagamento ? (
            <Badge variant="destructive">SIM</Badge>
          ) : (
            <Badge variant="outline">NÃO</Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Precisou integração:</span>
          {data.precisouIntegracao ? (
            <Badge variant="secondary">SIM</Badge>
          ) : (
            <Badge variant="outline">NÃO</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
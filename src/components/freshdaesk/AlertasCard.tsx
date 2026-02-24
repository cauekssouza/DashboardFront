// front/src/components/freshdesk/AlertasCard.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Crown, Wrench } from 'lucide-react';

interface AlertasCardProps {
  data?: {
    flagUrgente?: boolean;
    flagVIP?: boolean;
    flagEspecializado?: boolean;
    scoreRisco?: 'ALTO' | 'MÉDIO' | 'BAIXO';
    scoreRecorrencia?: 'ALTA' | 'MÉDIA' | 'BAIXA';
    classificacao?: string;
    dadosAdicionais?: {
      totalCancelamentos?: number;
      ticketsAbertos?: number;
      tempoMedioResolucao?: number;
    };
  };
}

export function AlertasCard({ data }: AlertasCardProps) {
  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum alerta disponível
        </CardContent>
      </Card>
    );
  }

  // ✅ FUNÇÃO CORRIGIDA - sem "warning"
  const getScoreRiscoColor = (risco?: string) => {
    switch(risco) {
      case 'ALTO': 
        return 'destructive';
      case 'MÉDIO': 
        return 'secondary'; // Usa secondary com cor personalizada
      default: 
        return 'outline';
    }
  };

  // ✅ FUNÇÃO CORRIGIDA - sem "warning"
  const getScoreRecorrenciaColor = (recorrencia?: string) => {
    switch(recorrencia) {
      case 'ALTA': 
        return 'destructive';
      case 'MÉDIA': 
        return 'secondary'; // Usa secondary com cor personalizada
      default: 
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">🚨 Alertas</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Urgente:</span>
            {data.flagUrgente ? 
              <Badge variant="destructive">SIM</Badge> : 
              <Badge variant="outline">NÃO</Badge>
            }
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">VIP:</span>
            {data.flagVIP ? 
              <Badge className="bg-yellow-500 hover:bg-yellow-600">SIM</Badge> : 
              <Badge variant="outline">NÃO</Badge>
            }
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Especializado:</span>
            {data.flagEspecializado ? 
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">SIM</Badge> : 
              <Badge variant="outline">NÃO</Badge>
            }
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Risco:</span>
            <Badge 
              variant={getScoreRiscoColor(data.scoreRisco)}
              className={
                data.scoreRisco === 'MÉDIO' ? 'bg-yellow-100 text-yellow-800' : 
                data.scoreRisco === 'ALTO' ? '' : ''
              }
            >
              {data.scoreRisco || 'N/A'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Recorrência:</span>
            <Badge 
              variant={getScoreRecorrenciaColor(data.scoreRecorrencia)}
              className={
                data.scoreRecorrencia === 'MÉDIA' ? 'bg-yellow-100 text-yellow-800' : 
                data.scoreRecorrencia === 'ALTA' ? '' : ''
              }
            >
              {data.scoreRecorrencia || 'N/A'}
            </Badge>
          </div>
        </div>

        {data.dadosAdicionais && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cancelamentos:</span>
              <span className="font-medium">{data.dadosAdicionais.totalCancelamentos || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tickets abertos:</span>
              <span className="font-medium">{data.dadosAdicionais.ticketsAbertos || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tempo médio:</span>
              <span className="font-medium">{data.dadosAdicionais.tempoMedioResolucao || 0}h</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
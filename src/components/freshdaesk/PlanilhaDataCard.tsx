'use client'

import { usePlanilhaData } from '@/hooks/usePolling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertTriangle, Star, Zap, Clock } from 'lucide-react';

interface PlanilhaData {
  flag_urgente?: string;
  flag_vip?: string;
  flag_especializado?: string;
  score_risco?: string;
  score_recorrencia?: string;
  classificacao?: string;
  acao_sugerida?: string;
  detalhes?: string;
  prioridade_sugerida?: string;
  total_de_tickets?: string;
  tickets_abertos?: string;
  ultimo_ticket?: string;
  cliente_desde?: string;
  tempo_como_cliente?: string;
  ja_cancelou_antes?: string;
  problema_pagamento?: string;
  status?: string;
  tipo?: string;
  prioridade?: string;
  prazo_final?: string;
}

export function PlanilhaDataCard() {
  const { data, loading, error, refresh } = usePlanilhaData(30000); // 30 segundos

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Erro ao carregar dados da planilha</p>
            <button onClick={refresh} className="text-sm underline mt-2">
              Tentar novamente
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const planilhaData: PlanilhaData = data?.[0] || {};

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            📊 Dados da Planilha
          </CardTitle>
          <div className="flex items-center gap-2">
            {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Auto-refresh 30s
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && !planilhaData.flag_urgente ? (
          <div className="text-center py-4 text-muted-foreground">
            Carregando dados...
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Alertas */}
            <div className="flex flex-wrap gap-2">
              {planilhaData.flag_urgente?.includes('SIM') && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Urgente
                </Badge>
              )}
              {planilhaData.flag_vip?.includes('SIM') && (
                <Badge className="bg-yellow-500 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  VIP
                </Badge>
              )}
              {planilhaData.flag_especializado?.includes('SIM') && (
                <Badge className="bg-purple-500 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Especializado
                </Badge>
              )}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Score Risco: </span>
                <span className={`font-medium ${
                  planilhaData.score_risco === 'ALTO' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {planilhaData.score_risco || '-'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Score Recorrência: </span>
                <span className={`font-medium ${
                  planilhaData.score_recorrencia === 'ALTA' ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {planilhaData.score_recorrencia || '-'}
                </span>
              </div>
            </div>

            {/* Ação Sugerida */}
            {planilhaData.acao_sugerida && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">Ação Sugerida</p>
                <p className="text-sm font-semibold">{planilhaData.acao_sugerida}</p>
                {planilhaData.detalhes && (
                  <p className="text-xs text-muted-foreground mt-1">{planilhaData.detalhes}</p>
                )}
              </div>
            )}

            {/* Info Cliente */}
            <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
              <div>
                <span className="text-muted-foreground">Total Tickets: </span>
                <span className="font-medium">{planilhaData.total_de_tickets || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Abertos: </span>
                <span className="font-medium">{planilhaData.tickets_abertos || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Cliente desde: </span>
                <span className="font-medium">{planilhaData.cliente_desde || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Último ticket: </span>
                <span className="font-medium">{planilhaData.ultimo_ticket || '-'}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


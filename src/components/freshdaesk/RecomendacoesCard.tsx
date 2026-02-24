'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

interface Recomendacao {
  id?: string;
  acaoSugerida?: string;
  detalhes?: string;
  prioridadeSugerida?: number;
}

interface RecomendacoesCardProps {
  recomendacoes?: Recomendacao[];
  onAplicar?: (id: string) => void;
  onIgnorar?: (id: string) => void;
}

export function RecomendacoesCard({ recomendacoes = [], onAplicar, onIgnorar }: RecomendacoesCardProps) {
  if (recomendacoes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhuma recomendação
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">💡 Recomendações</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {recomendacoes.map((rec) => (
          <div key={rec.id} className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="outline" className="mb-2">
                  {rec.acaoSugerida || 'Ação'}
                </Badge>
                <p className="text-sm">{rec.detalhes || 'Sem detalhes'}</p>
              </div>
              <div className="flex gap-1">
                {onAplicar && rec.id && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => onAplicar(rec.id!)}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                {onIgnorar && rec.id && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => onIgnorar(rec.id!)}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Ticket, Calendar } from 'lucide-react';

interface TicketAtualCardProps {
  data?: {
    id?: string;
    numero?: number;
    assunto?: string;
    tipo?: string;
    prioridade?: number;
    status?: number;
    criadoEm?: Date;
    prazoSLA?: Date;
    atendente?: string;
  };
}

export function TicketAtualCard({ data }: TicketAtualCardProps) {
  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum ticket atual
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">🎫 Ticket Atual</CardTitle>
          </div>
          {data.numero && <Badge variant="outline">#{data.numero}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-semibold">{data.assunto || 'Sem assunto'}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Tipo</p>
            <p>{data.tipo || 'N/A'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prioridade</p>
            <p>{data.prioridade || 'N/A'}</p>
          </div>
        </div>

        {data.criadoEm && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Criado: {new Date(data.criadoEm).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
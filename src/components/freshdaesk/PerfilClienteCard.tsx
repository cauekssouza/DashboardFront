'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, Building2 } from 'lucide-react';

interface PerfilClienteCardProps {
  data?: {
    id?: string;
    nome?: string;
    email?: string;
    telefone?: string;
    empresa?: string;
    totalTickets?: number;
    ticketsAbertos?: number;
    clienteDesde?: Date;
    diasComoCliente?: number;
  };
}

export function PerfilClienteCard({ data }: PerfilClienteCardProps) {
  if (!data) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center text-muted-foreground">
          Nenhum perfil disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">👤 Perfil</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{data.nome?.charAt(0) || 'C'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{data.nome || 'Nome não informado'}</p>
            <p className="text-sm text-muted-foreground">{data.empresa || 'Empresa não informada'}</p>
          </div>
        </div>

        <div className="space-y-2">
          {data.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{data.email}</span>
            </div>
          )}
          {data.telefone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{data.telefone}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Total Tickets</p>
            <p className="text-lg font-semibold">{data.totalTickets || 0}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Tickets Abertos</p>
            <p className="text-lg font-semibold text-red-600">{data.ticketsAbertos || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
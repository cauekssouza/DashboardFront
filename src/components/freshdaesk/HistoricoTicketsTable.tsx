'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface Ticket {
  id: string;
  numero?: number;
  assunto?: string;
  criadoEm?: Date;
  status?: string;
  prioridade?: string;
  tipo?: string;
}

interface HistoricoTicketsTableProps {
  tickets?: Ticket[];
  onVerDetalhes?: (id: string) => void;
}

export function HistoricoTicketsTable({ tickets = [], onVerDetalhes }: HistoricoTicketsTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Nenhum ticket no histórico</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-mono">#{ticket.numero || 'N/A'}</TableCell>
              <TableCell>{ticket.assunto || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.tipo || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.prioridade || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{ticket.status || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                {ticket.criadoEm ? new Date(ticket.criadoEm).toLocaleDateString() : '-'}
              </TableCell>
              <TableCell className="text-right">
                {onVerDetalhes && (
                  <Button variant="ghost" size="icon" onClick={() => onVerDetalhes(ticket.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
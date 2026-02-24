// front/src/app/tickets/page.tsx
'use client'

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Download
} from 'lucide-react';
import { ticketsService, Ticket } from '@/services/tickets.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ModalNovoTicket } from '@/components/freshdaesk/ModalNovoTicket';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TicketsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarTickets();
  }, []);

  const carregarTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsService.listar();
      setTickets(data.tickets || []);
    } catch (error) {
      toast.error('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch(status) {
      case 2: return <Badge variant="destructive">Aberto</Badge>;
      case 3: return <Badge>Pendente</Badge>;
      case 4: return <Badge variant="secondary" className="bg-green-100 text-green-800">Resolvido</Badge>;
      case 5: return <Badge variant="outline">Fechado</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPrioridadeBadge = (prioridade: number) => {
    switch(prioridade) {
      case 4: return <Badge variant="destructive" className="font-bold">Urgente</Badge>;
      case 3: return <Badge>Alta</Badge>;
      case 2: return <Badge variant="secondary" className="font-bold">Média</Badge>;
      default: return <Badge variant="outline" className="font-bold">Baixa</Badge>;
    }
  };

  const ticketsFiltrados = tickets.filter(t => {
    const matchesSearch = t.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.clienteNome?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || t.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <ModalNovoTicket 
        open={modalAberto}
        onOpenChange={setModalAberto}
        onTicketCriado={carregarTickets}
      />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie todos os tickets de atendimento
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={() => setModalAberto(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ticket
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por assunto ou cliente..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="2">Abertos</SelectItem>
              <SelectItem value="3">Pendentes</SelectItem>
              <SelectItem value="4">Resolvidos</SelectItem>
              <SelectItem value="5">Fechados</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabela */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nº</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : ticketsFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Nenhum ticket encontrado
                  </TableCell>
                </TableRow>
              ) : (
                ticketsFiltrados.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono font-medium">#{ticket.numero}</TableCell>
                    <TableCell className="max-w-md truncate">{ticket.assunto}</TableCell>
                    <TableCell>{ticket.clienteNome}</TableCell>
                    <TableCell>{getPrioridadeBadge(ticket.prioridade)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {new Date(ticket.criadoEm).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/tickets/${ticket.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Resolver
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
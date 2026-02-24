// front/src/components/tickets/TabelaTickets.tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock,
  AlertCircle,
  MessageSquare,
  User,
  Tag,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Ticket {
  id: string;
  numero: number;
  assunto: string;
  descricao?: string;
  tipo: string;
  prioridade: number;
  status: number;
  clienteId: string;
  clienteNome: string;
  atendenteId?: string;
  atendenteNome?: string;
  criadoEm: Date;
  atualizadoEm: Date;
  prazoSLA: Date;
  tags: string[];
}

interface TabelaTicketsProps {
  tickets: Ticket[];
  onTicketClick?: (id: string) => void;
  onResolver?: (id: string) => void;
  onResponder?: (id: string) => void;
  onAtribuir?: (id: string) => void;
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
}

export function TabelaTickets({ 
  tickets, 
  onTicketClick,
  onResolver,
  onResponder,
  onAtribuir,
  showFilters = true,
  showPagination = true,
  pageSize = 10
}: TabelaTicketsProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>('todas');

  // Funções de formatação
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR');
  };

  // ✅ FUNÇÃO CORRIGIDA - sem "warning"
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 2: 
        return <Badge variant="destructive" className="font-medium">Aberto</Badge>;
      case 3: 
        // ✅ Usa 'secondary' com cor personalizada em vez de 'warning'
        return <Badge variant="secondary" className="font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">Pendente</Badge>;
      case 4: 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">Resolvido</Badge>;
      case 5: 
        return <Badge variant="outline" className="font-medium">Fechado</Badge>;
      default: 
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  // ✅ FUNÇÃO CORRIGIDA - sem "warning"
  const getPrioridadeBadge = (prioridade: number) => {
    switch(prioridade) {
      case 4: 
        return <Badge variant="destructive" className="font-bold">Urgente</Badge>;
      case 3: 
        // ✅ Usa 'destructive' com cor laranja em vez de 'warning'
        return <Badge variant="destructive" className="font-bold bg-orange-500 hover:bg-orange-600">Alta</Badge>;
      case 2: 
        return <Badge variant="secondary" className="font-bold bg-blue-100 text-blue-800">Média</Badge>;
      case 1: 
        return <Badge variant="outline" className="font-bold">Baixa</Badge>;
      default: 
        return <Badge variant="outline">{prioridade}</Badge>;
    }
  };

  // ✅ FUNÇÃO CORRIGIDA - sem "warning"
  const getSlaStatus = (prazoSLA: Date) => {
    const agora = new Date();
    const prazo = new Date(prazoSLA);
    const diffHoras = (prazo.getTime() - agora.getTime()) / (1000 * 60 * 60);
    
    if (diffHoras < 0) {
      return <Badge variant="destructive" className="font-bold">Expirado</Badge>;
    }
    if (diffHoras < 4) {
      // ✅ Usa 'destructive' com cor laranja em vez de 'warning'
      return <Badge variant="destructive" className="font-bold bg-orange-500">Crítico</Badge>;
    }
    if (diffHoras < 24) {
      // ✅ Usa 'secondary' com cor amarela em vez de 'warning'
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Atenção</Badge>;
    }
    return <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">OK</Badge>;
  };

  // Filtros
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchTerm === '' || 
      ticket.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.numero.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'todos' || ticket.status.toString() === statusFilter;
    const matchesPrioridade = prioridadeFilter === 'todas' || ticket.prioridade.toString() === prioridadeFilter;
    
    return matchesSearch && matchesStatus && matchesPrioridade;
  });

  // Paginação
  const totalPages = Math.ceil(filteredTickets.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTicketClick = (id: string) => {
    if (onTicketClick) {
      onTicketClick(id);
    } else {
      router.push(`/tickets/${id}`);
    }
  };

  return (
    <Card>
      {showFilters && (
        <CardHeader className="border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por assunto, cliente ou número..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="2">Abertos</SelectItem>
                  <SelectItem value="3">Pendentes</SelectItem>
                  <SelectItem value="4">Resolvidos</SelectItem>
                  <SelectItem value="5">Fechados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={prioridadeFilter} onValueChange={setPrioridadeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="4">Urgente</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                  <SelectItem value="2">Média</SelectItem>
                  <SelectItem value="1">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      )}

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Nº</TableHead>
              <TableHead>Assunto</TableHead>
              <TableHead className="w-[150px]">Cliente</TableHead>
              <TableHead className="w-[100px]">Prioridade</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px]">SLA</TableHead>
              <TableHead className="w-[100px]">Data</TableHead>
              <TableHead className="w-[50px]">Tags</TableHead>
              <TableHead className="w-[80px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhum ticket encontrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentTickets.map((ticket) => (
                <TableRow 
                  key={ticket.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTicketClick(ticket.id)}
                >
                  <TableCell className="font-mono font-medium">
                    #{ticket.numero}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium line-clamp-1">{ticket.assunto}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {ticket.descricao || 'Sem descrição'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm line-clamp-1">{ticket.clienteNome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPrioridadeBadge(ticket.prioridade)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell>
                    {getSlaStatus(ticket.prazoSLA)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{formatDate(ticket.criadoEm)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.tags && ticket.tags.length > 0 ? (
                      <div className="flex gap-1">
                        {ticket.tags.slice(0, 2).map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {ticket.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{ticket.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleTicketClick(ticket.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        
                        {onResponder && ticket.status !== 4 && ticket.status !== 5 && (
                          <DropdownMenuItem onClick={() => onResponder(ticket.id)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Responder
                          </DropdownMenuItem>
                        )}
                        
                        {onResolver && ticket.status !== 4 && ticket.status !== 5 && (
                          <DropdownMenuItem onClick={() => onResolver(ticket.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Resolver
                          </DropdownMenuItem>
                        )}
                        
                        {onAtribuir && (
                          <DropdownMenuItem onClick={() => onAtribuir(ticket.id)}>
                            <User className="mr-2 h-4 w-4" />
                            Atribuir
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {showPagination && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} a {Math.min(endIndex, filteredTickets.length)} de {filteredTickets.length} resultados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
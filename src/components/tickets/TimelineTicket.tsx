// front/src/components/tickets/TimelineTicket.tsx
'use client'

import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  User,
  Clock,
  Calendar,
  Tag,
  Edit,
  RefreshCw,
  UserPlus,
  Paperclip,
  Star
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TicketEvent {
  id: string;
  tipo: 'criacao' | 'resposta' | 'resolucao' | 'reabertura' | 'atribuicao' | 'alteracao' | 'tag' | 'anexo' | 'avaliacao';
  descricao: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioAvatar?: string;
  data: Date;
  metadata?: {
    mensagem?: string;
    de?: string;
    para?: string;
    tags?: string[];
    anexos?: string[];
    avaliacao?: number;
    comentario?: string;
  };
}

interface TimelineTicketProps {
  events: TicketEvent[];
  ticketId?: string;
}

export function TimelineTicket({ events, ticketId }: TimelineTicketProps) {
  const getIcon = (tipo: string) => {
    switch(tipo) {
      case 'criacao': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'resposta': return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'resolucao': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'reabertura': return <RefreshCw className="h-4 w-4 text-orange-600" />;
      case 'atribuicao': return <UserPlus className="h-4 w-4 text-purple-600" />;
      case 'alteracao': return <Edit className="h-4 w-4 text-gray-600" />;
      case 'tag': return <Tag className="h-4 w-4 text-indigo-600" />;
      case 'anexo': return <Paperclip className="h-4 w-4 text-gray-600" />;
      case 'avaliacao': return <Star className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getBackgroundColor = (tipo: string) => {
    switch(tipo) {
      case 'criacao': return 'bg-blue-50 dark:bg-blue-950/20';
      case 'resposta': return 'bg-green-50 dark:bg-green-950/20';
      case 'resolucao': return 'bg-green-100 dark:bg-green-900/30';
      case 'reabertura': return 'bg-orange-50 dark:bg-orange-950/20';
      case 'atribuicao': return 'bg-purple-50 dark:bg-purple-950/20';
      case 'alteracao': return 'bg-gray-50 dark:bg-gray-800/20';
      case 'tag': return 'bg-indigo-50 dark:bg-indigo-950/20';
      case 'avaliacao': return 'bg-yellow-50 dark:bg-yellow-950/20';
      default: return 'bg-gray-50 dark:bg-gray-800/20';
    }
  };

  const getBorderColor = (tipo: string) => {
    switch(tipo) {
      case 'criacao': return 'border-blue-200 dark:border-blue-800';
      case 'resposta': return 'border-green-200 dark:border-green-800';
      case 'resolucao': return 'border-green-300 dark:border-green-700';
      case 'reabertura': return 'border-orange-200 dark:border-orange-800';
      case 'atribuicao': return 'border-purple-200 dark:border-purple-800';
      case 'alteracao': return 'border-gray-200 dark:border-gray-700';
      case 'tag': return 'border-indigo-200 dark:border-indigo-800';
      case 'avaliacao': return 'border-yellow-200 dark:border-yellow-800';
      default: return 'border-gray-200 dark:border-gray-700';
    }
  };

  const formatEventDescription = (event: TicketEvent) => {
    switch(event.tipo) {
      case 'criacao':
        return `Ticket criado por ${event.usuarioNome}`;
      case 'resposta':
        return `${event.usuarioNome} respondeu ao ticket`;
      case 'resolucao':
        return `Ticket resolvido por ${event.usuarioNome}`;
      case 'reabertura':
        return `Ticket reaberto por ${event.usuarioNome}`;
      case 'atribuicao':
        return `Ticket atribuído a ${event.metadata?.para || 'alguém'} por ${event.usuarioNome}`;
      case 'alteracao':
        return `${event.usuarioNome} alterou o ticket`;
      case 'tag':
        return `${event.usuarioNome} adicionou tags: ${event.metadata?.tags?.join(', ')}`;
      case 'anexo':
        return `${event.usuarioNome} adicionou anexos`;
      case 'avaliacao':
        return `Cliente avaliou o atendimento com ${event.metadata?.avaliacao} estrelas`;
      default:
        return event.descricao;
    }
  };

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline do Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nenhum evento registrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Timeline do Ticket {ticketId ? `#${ticketId}` : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Linha conectora vertical */}
              {index < events.length - 1 && (
                <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-border" />
              )}
              
              <div className={`flex gap-4 p-4 rounded-lg border ${getBackgroundColor(event.tipo)} ${getBorderColor(event.tipo)}`}>
                {/* Ícone */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                  {getIcon(event.tipo)}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {event.usuarioAvatar ? (
                          <img src={event.usuarioAvatar} alt={event.usuarioNome} />
                        ) : (
                          <AvatarFallback className="text-xs">
                            {getInitials(event.usuarioNome)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium text-sm">{event.usuarioNome}</span>
                      <Badge variant="outline" className="text-xs">
                        {event.tipo === 'criacao' && 'Criação'}
                        {event.tipo === 'resposta' && 'Resposta'}
                        {event.tipo === 'resolucao' && 'Resolução'}
                        {event.tipo === 'reabertura' && 'Reabertura'}
                        {event.tipo === 'atribuicao' && 'Atribuição'}
                        {event.tipo === 'alteracao' && 'Alteração'}
                        {event.tipo === 'tag' && 'Tags'}
                        {event.tipo === 'anexo' && 'Anexo'}
                        {event.tipo === 'avaliacao' && 'Avaliação'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(event.data, "dd/MM/yyyy 'às' HH:mm")}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({formatDistanceToNow(event.data, { locale: ptBR, addSuffix: true })})
                      </span>
                    </div>
                  </div>

                  <p className="text-sm">{formatEventDescription(event)}</p>

                  {/* Detalhes específicos por tipo */}
                  {event.tipo === 'resposta' && event.metadata?.mensagem && (
                    <div className="mt-2 p-3 bg-background rounded-md border text-sm">
                      {event.metadata.mensagem}
                    </div>
                  )}

                  {event.tipo === 'avaliacao' && event.metadata?.avaliacao && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= (event.metadata?.avaliacao || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      {event.metadata?.comentario && (
                        <span className="text-sm text-muted-foreground">
                          - {event.metadata.comentario}
                        </span>
                      )}
                    </div>
                  )}

                  {event.tipo === 'tag' && event.metadata?.tags && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.metadata.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {event.tipo === 'anexo' && event.metadata?.anexos && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {event.metadata.anexos.map((anexo, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <Paperclip className="h-3 w-3" />
                          {anexo}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Exemplo de uso com dados mockados
export function TimelineTicketExample() {
  const mockEvents: TicketEvent[] = [
    {
      id: '1',
      tipo: 'criacao',
      descricao: 'Ticket criado',
      usuarioId: '1',
      usuarioNome: 'João Silva',
      data: new Date('2026-02-11T12:13:05Z'),
      metadata: {
        mensagem: 'Cliente reporta problema na integração'
      }
    },
    {
      id: '2',
      tipo: 'resposta',
      descricao: 'Resposta do atendente',
      usuarioId: '2',
      usuarioNome: 'Maria Santos',
      data: new Date('2026-02-11T13:30:00Z'),
      metadata: {
        mensagem: 'Olá, poderia me fornecer mais detalhes sobre o erro?'
      }
    },
    {
      id: '3',
      tipo: 'resposta',
      descricao: 'Resposta do cliente',
      usuarioId: '3',
      usuarioNome: 'DIANE FURLANETTO',
      data: new Date('2026-02-11T14:15:00Z'),
      metadata: {
        mensagem: 'Aparece a mensagem "Erro de autenticação" ao tentar conectar'
      }
    },
    {
      id: '4',
      tipo: 'tag',
      descricao: 'Tags adicionadas',
      usuarioId: '2',
      usuarioNome: 'Maria Santos',
      data: new Date('2026-02-11T14:20:00Z'),
      metadata: {
        tags: ['integração', 'urgente']
      }
    },
    {
      id: '5',
      tipo: 'atribuicao',
      descricao: 'Ticket atribuído',
      usuarioId: '1',
      usuarioNome: 'João Silva',
      data: new Date('2026-02-11T14:25:00Z'),
      metadata: {
        de: 'Não atribuído',
        para: 'Pedro Costa'
      }
    },
    {
      id: '6',
      tipo: 'resposta',
      descricao: 'Resposta do atendente',
      usuarioId: '4',
      usuarioNome: 'Pedro Costa',
      data: new Date('2026-02-11T15:00:00Z'),
      metadata: {
        mensagem: 'Consegui identificar o problema. Vou te enviar as instruções para corrigir.'
      }
    },
    {
      id: '7',
      tipo: 'resolucao',
      descricao: 'Ticket resolvido',
      usuarioId: '4',
      usuarioNome: 'Pedro Costa',
      data: new Date('2026-02-11T16:30:00Z'),
      metadata: {
        mensagem: 'Problema resolvido. Era um erro de configuração na API key.'
      }
    },
    {
      id: '8',
      tipo: 'avaliacao',
      descricao: 'Cliente avaliou',
      usuarioId: '3',
      usuarioNome: 'DIANE FURLANETTO',
      data: new Date('2026-02-11T17:00:00Z'),
      metadata: {
        avaliacao: 5,
        comentario: 'Atendimento excelente, resolveu rapidamente!'
      }
    }
  ];

  return <TimelineTicket events={mockEvents} ticketId="350009" />;
}
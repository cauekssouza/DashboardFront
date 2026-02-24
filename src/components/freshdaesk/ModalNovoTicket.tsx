// front/src/components/freshdesk/ModalNovoTicket.tsx
'use client'

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { api } from '@/services/api';
import { Loader2, AlertCircle } from 'lucide-react';

interface ModalNovoTicketProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId?: string;
  onTicketCriado?: () => void;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

export function ModalNovoTicket({ open, onOpenChange, clienteId, onTicketCriado }: ModalNovoTicketProps) {
  const [loading, setLoading] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [formData, setFormData] = useState({
    assunto: '',
    descricao: '',
    tipo: 'SOLICITACAO',
    prioridade: '2',
    clienteId: clienteId || ''
  });

  // Carregar clientes quando o modal abrir
  useEffect(() => {
    if (open) {
      carregarClientes();
    }
  }, [open]);

  // Atualizar clienteId quando a prop mudar
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      clienteId: clienteId || prev.clienteId
    }));
  }, [clienteId]);

  const carregarClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await api.get('/clientes?limit=100');
      setClientes(response.data.clientes || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar lista de clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.assunto.trim()) {
      toast.error('Assunto é obrigatório');
      return;
    }
    if (!formData.clienteId) {
      toast.error('Selecione um cliente');
      return;
    }

    setLoading(true);
    
    try {
      const response = await api.post('/tickets', formData);
      
      toast.success('Ticket criado com sucesso!');
      onOpenChange(false);
      
      // Limpar formulário
      setFormData({
        assunto: '',
        descricao: '',
        tipo: 'SOLICITACAO',
        prioridade: '2',
        clienteId: clienteId || ''
      });
      
      if (onTicketCriado) {
        onTicketCriado();
      }
      
    } catch (error: any) {
      console.error('Erro ao criar ticket:', error);
      const mensagem = error.response?.data?.message || 'Erro ao criar ticket';
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Novo Ticket</DialogTitle>
            <DialogDescription>
              Abra um novo ticket de atendimento
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* Cliente */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="cliente" className="text-right pt-2 font-medium">
                Cliente <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.clienteId} 
                  onValueChange={(value) => setFormData({...formData, clienteId: value})}
                  disabled={loading || loadingClientes}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingClientes ? "Carregando clientes..." : "Selecione um cliente"} />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.length === 0 && !loadingClientes && (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Nenhum cliente encontrado
                      </div>
                    )}
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingClientes && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Carregando clientes...
                  </div>
                )}
              </div>
            </div>

            {/* Assunto */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="assunto" className="text-right pt-2 font-medium">
                Assunto <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="assunto"
                  value={formData.assunto}
                  onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                  placeholder="Resumo do problema"
                  disabled={loading}
                  className="w-full"
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.assunto.length}/200 caracteres
                </p>
              </div>
            </div>

            {/* Tipo */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tipo" className="text-right pt-2 font-medium">
                Tipo
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => setFormData({...formData, tipo: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOLICITACAO">Solicitação</SelectItem>
                    <SelectItem value="CANCELAMENTO">Cancelamento</SelectItem>
                    <SelectItem value="DUVIDA">Dúvida</SelectItem>
                    <SelectItem value="RECLAMACAO">Reclamação</SelectItem>
                    <SelectItem value="INTEGRACAO">Integração</SelectItem>
                    <SelectItem value="LEAD">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Prioridade */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="prioridade" className="text-right pt-2 font-medium">
                Prioridade
              </Label>
              <div className="col-span-3">
                <Select 
                  value={formData.prioridade} 
                  onValueChange={(value) => setFormData({...formData, prioridade: value})}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Urgente
                      </div>
                    </SelectItem>
                    <SelectItem value="3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        Alta
                      </div>
                    </SelectItem>
                    <SelectItem value="2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        Média
                      </div>
                    </SelectItem>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Baixa
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="descricao" className="text-right pt-2 font-medium">
                Descrição
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  placeholder="Descreva o problema em detalhes"
                  disabled={loading}
                  className="min-h-[120px]"
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.descricao.length}/1000 caracteres
                </p>
              </div>
            </div>

            {/* Aviso de campos obrigatórios */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-4">
              <AlertCircle className="h-3 w-3" />
              <span>Campos marcados com <span className="text-red-500">*</span> são obrigatórios</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.assunto || !formData.clienteId}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                'Criar Ticket'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// front/src/services/clientes.service.ts
import { api } from './api';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cpfCnpj?: string;
  tipo: 'PF' | 'PJ';
  status: 'ativo' | 'inativo';
  dataCadastro: Date;
  totalTickets: number;
  ultimoContato?: Date;
}

class ClientesService {
  async listar(filtros?: any) {
    const response = await api.get('/clientes', { params: filtros });
    return response.data;
  }

  async buscarPorId(id: string): Promise<Cliente> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  }

  async criar(dados: Partial<Cliente>): Promise<Cliente> {
    const response = await api.post('/clientes', dados);
    return response.data;
  }

  async atualizar(id: string, dados: Partial<Cliente>): Promise<Cliente> {
    const response = await api.put(`/clientes/${id}`, dados);
    return response.data;
  }

  async excluir(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
  }

  async buscarPorTermo(termo: string): Promise<Cliente[]> {
    const response = await api.get(`/clientes/busca/${termo}`);
    return response.data;
  }

  async alternarStatus(id: string): Promise<Cliente> {
    const response = await api.patch(`/clientes/${id}/toggle-status`);
    return response.data;
  }
}

export const clientesService = new ClientesService();
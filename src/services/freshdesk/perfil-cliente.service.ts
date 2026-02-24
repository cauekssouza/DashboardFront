// front/src/services/freshdesk/perfil-cliente.service.ts
import { api } from '../api';
import { PerfilClienteDto } from './types';

class PerfilClienteService {
  async getPerfilCompleto(id: string): Promise<PerfilClienteDto> {
    const response = await api.get(`/freshdesk/perfil-cliente/${id}`);
    return response.data;
  }

  async getResumoCliente(id: string): Promise<any> {
    const response = await api.get(`/freshdesk/perfil-cliente/${id}/resumo`);
    return response.data;
  }

  async buscarClientes(termo: string, limite: number = 10): Promise<PerfilClienteDto[]> {
    const response = await api.get(`/freshdesk/perfil-cliente/busca/${termo}?limite=${limite}`);
    return response.data;
  }

  async listarClientes(filtros?: any): Promise<any> {
    const response = await api.get('/freshdesk/perfil-cliente', { params: filtros });
    return response.data;
  }
}

export const perfilClienteService = new PerfilClienteService();
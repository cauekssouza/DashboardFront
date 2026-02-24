// front/src/services/freshdesk/alertas.service.ts
import { api } from '../api';
import { AlertasDto } from './types';

class AlertasService {
  async getAlertasCliente(clienteId: string): Promise<AlertasDto> {
    const response = await api.get(`/freshdesk/alertas/cliente/${clienteId}`);
    return response.data;
  }

  async getClientesRiscoAlto(limite: number = 10): Promise<any[]> {
    const response = await api.get(`/freshdesk/alertas/risco-alto?limite=${limite}`);
    return response.data;
  }
}

export const alertasService = new AlertasService();
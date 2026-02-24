// front/src/services/freshdesk/dashboard.service.ts
import { api } from '../api';
import { DashboardCompletoDto } from './types';

class DashboardService {
  async getDashboardCompleto(clienteId: string): Promise<DashboardCompletoDto> {
    const response = await api.get(`/freshdesk/dashboard/${clienteId}`);
    return response.data;
  }

  async getDashboardResumido(clienteId: string) {
    const response = await api.get(`/freshdesk/dashboard/${clienteId}/resumo`);
    return response.data;
  }

  async getMetricas(clienteId: string) {
    const response = await api.get(`/freshdesk/dashboard/${clienteId}/metricas`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
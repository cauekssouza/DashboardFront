// front/src/services/freshdesk/metricas-sla.service.ts
import { api } from '../api';
import { MetricasDto } from './types';

class MetricasSlaService {
  async getMetricasDashboard(): Promise<MetricasDto> {
    const response = await api.get('/freshdesk/metricas-sla/dashboard');
    return response.data;
  }

  async getTempoMedioResposta(periodo?: string): Promise<any> {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await api.get(`/freshdesk/metricas-sla/tempo-medio${params}`);
    return response.data;
  }

  async getSlaCumprido(periodo?: string): Promise<any> {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await api.get(`/freshdesk/metricas-sla/sla${params}`);
    return response.data;
  }

  async getCsatMedio(periodo?: string): Promise<any> {
    const params = periodo ? `?periodo=${periodo}` : '';
    const response = await api.get(`/freshdesk/metricas-sla/csat${params}`);
    return response.data;
  }
}

export const metricasSlaService = new MetricasSlaService();
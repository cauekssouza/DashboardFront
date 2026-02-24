// front/src/services/freshdesk/configuracoes.service.ts
import { api } from '../api';

class ConfiguracoesService {
  async getConfiguracao(): Promise<any> {
    const response = await api.get('/freshdesk/configuracoes');
    return response.data;
  }

  async salvarConfiguracao(data: { subdominio: string; apiKey: string }): Promise<any> {
    const response = await api.post('/freshdesk/configuracoes', data);
    return response.data;
  }

  async testarConexao(data: { subdominio: string; apiKey: string }): Promise<any> {
    const response = await api.post('/freshdesk/configuracoes/testar', data);
    return response.data;
  }

  async sincronizar(): Promise<any> {
    const response = await api.post('/freshdesk/configuracoes/sincronizar');
    return response.data;
  }
}

export const configuracoesService = new ConfiguracoesService();
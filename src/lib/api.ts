// front/src/lib/api.ts
import axios from 'axios';

// ✅ CONFIGURAÇÃO DA API
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ✅ INTERCEPTOR DE REQUISIÇÃO - ADICIONA TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@Atendimento:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ INTERCEPTOR DE RESPOSTA - TRATA ERROS
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 (Unauthorized) e não for tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('@Atendimento:refreshToken');
        
        if (!refreshToken) {
          auth.logout();
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('@Atendimento:token', accessToken);
        localStorage.setItem('@Atendimento:refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        auth.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ✅ MÉTODOS AUXILIARES PARA AUTENTICAÇÃO
export const auth = {
  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('@Atendimento:token', accessToken);
    localStorage.setItem('@Atendimento:refreshToken', refreshToken);
  },

  setUser(user: any) {
    localStorage.setItem('@Atendimento:user', JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem('@Atendimento:token');
  },

  getRefreshToken() {
    return localStorage.getItem('@Atendimento:refreshToken');
  },

  getUser() {
    const userStr = localStorage.getItem('@Atendimento:user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('@Atendimento:token');
    localStorage.removeItem('@Atendimento:refreshToken');
    localStorage.removeItem('@Atendimento:user');
    
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },
};

// ✅ MÉTODOS DE UTILIDADE PARA REQUISIÇÕES
export const apiHelpers = {
  async get<T>(url: string, params?: any): Promise<T> {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  async delete<T>(url: string): Promise<T> {
    const response = await api.delete<T>(url);
    return response.data;
  },
};

export default api;
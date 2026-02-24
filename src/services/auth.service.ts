import { api, auth } from '@/lib/api';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  department?: string;
  phone?: string;
  extension?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'VIEWER';
    department?: string;
    phone?: string;
    extension?: string;
    avatar?: string;
    isActive: boolean;
    lastLogin?: string;
    createdAt: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'VIEWER';
  department?: string;
  phone?: string;
  extension?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tickets: number;
    activities: number;
  };
}

class AuthService {
  updateProfile: any;
  deactivateUser: any;
  updateUserRole: any;
  /**
   * Login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      
      // Salvar tokens e usuário
      auth.setTokens(response.data.accessToken, response.data.refreshToken);
      auth.setUser(response.data.user);
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      if (error.response?.status === 401) {
        throw new Error('E-mail ou senha inválidos');
      }
      
      if (error.response?.status === 403) {
        throw new Error('Usuário inativo. Contate o administrador.');
      }
      
      if (!error.response) {
        throw new Error('Erro de conexão com o servidor');
      }
      
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  }

  /**
   * Registro de novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      
      // Salvar tokens e usuário
      auth.setTokens(response.data.accessToken, response.data.refreshToken);
      auth.setUser(response.data.user);
      
      return response.data;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      if (error.response?.status === 409) {
        throw new Error('E-mail já cadastrado');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Dados inválidos. Verifique as informações.');
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  /**
   * Buscar perfil do usuário atual
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>('/auth/me');
      
      // Atualizar usuário no localStorage
      auth.setUser(response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error);
      
      if (error.response?.status === 401) {
        auth.logout();
      }
      
      throw new Error('Erro ao carregar perfil do usuário');
    }
  }

  /**
   * Atualizar token de acesso usando refresh token
   */
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshToken = auth.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post<{ accessToken: string; refreshToken: string }>(
        '/auth/refresh',
        { refreshToken }
      );

      // Salvar novos tokens
      auth.setTokens(response.data.accessToken, response.data.refreshToken);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar token:', error);
      auth.logout();
      throw new Error('Sessão expirada. Faça login novamente.');
    }
  }

  /**
   * Logout do usuário
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      const token = refreshToken || auth.getRefreshToken();
      
      if (token) {
        await api.post('/auth/logout', { refreshToken: token });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      auth.logout();
    }
  }

  /**
   * Solicitar recuperação de senha
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      
      if (error.response?.status === 404) {
        throw new Error('E-mail não encontrado');
      }
      
      throw new Error('Erro ao enviar recuperação de senha');
    }
  }

  /**
   * Resetar senha
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', {
        token,
        password,
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao resetar senha:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Token inválido ou expirado');
      }
      
      throw new Error('Erro ao redefinir senha');
    }
  }

  /**
   * Alterar senha (usuário logado)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Senha atual incorreta');
      }
      
      throw new Error('Erro ao alterar senha');
    }
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return auth.isAuthenticated();
  }

  /**
   * Buscar dados do usuário do localStorage
   */
  getUser() {
    return auth.getUser();
  }

  /**
   * Verificar se usuário tem determinada role
   */
  hasRole(roles: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    const userRole = user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    return allowedRoles.includes(userRole);
  }

  /**
   * Verificar se usuário é ADMIN
   */
  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  /**
   * Verificar se usuário é MANAGER
   */
  isManager(): boolean {
    return this.hasRole(['ADMIN', 'MANAGER']);
  }
}

// Exportar instância única do serviço
export const authService = new AuthService();
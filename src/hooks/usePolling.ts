import { useState, useEffect, useCallback } from 'react';

interface UsePollingOptions {
  interval?: number; // Intervalo em ms (padrão: 30 segundos)
  enabled?: boolean;
}

interface UsePollingReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para buscar dados com polling automático
 */
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: UsePollingOptions = {}
): UsePollingReturn<T> {
  const {
    interval = 30000, // 30 segundos padrão
    enabled = true
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar dados');
      console.error('Erro no polling:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (!enabled) return;

    // Primeira chamada
    refresh();

    // Configurar polling
    const timer = setInterval(refresh, interval);

    // Cleanup
    return () => clearInterval(timer);
  }, [refresh, interval, enabled]);

  return { data, loading, error, refresh };
}

/**
 * Hook específico para dados da planilha
 */
export function usePlanilhaData(interval = 30000) {
  const fetchPlanilhaData = useCallback(async () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/sheets/latest`);
    
    if (!response.ok) {
      throw new Error(`Backend respondeu com status ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || result;
  }, []);

  return usePolling(fetchPlanilhaData, { interval });
}


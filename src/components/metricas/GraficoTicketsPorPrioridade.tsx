// front/src/components/metricas/GraficoTicketsPorPrioridade.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

interface PrioridadeData {
  name: string;
  value: number;
  color: string;
}

export function GraficoTicketsPorPrioridade() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PrioridadeData[]>([]);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setData([
        { name: 'Urgente', value: 12, color: '#ef4444' },
        { name: 'Alta', value: 23, color: '#f97316' },
        { name: 'Média', value: 45, color: '#3b82f6' },
        { name: 'Baixa', value: 34, color: '#22c55e' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tickets por Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Tickets por Prioridade</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total: {total} tickets
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                // ✅ CORRIGIDO: verifica se value é number
                formatter={(value: any) => {
                  if (typeof value === 'number') {
                    return [`${value} tickets`, 'Quantidade'];
                  }
                  return ['0 tickets', 'Quantidade'];
                }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">Urgentes</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">{data[0]?.value || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Alta</p>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{data[1]?.value || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Média</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{data[2]?.value || 0}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Baixa</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">{data[3]?.value || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
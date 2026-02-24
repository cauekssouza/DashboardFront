// front/src/components/metricas/GraficoEvolucaoTickets.tsx
'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Brush
} from 'recharts';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface EvolucaoData {
  data: string;
  abertos: number;
  resolvidos: number;
  pendentes: number;
}

export function GraficoEvolucaoTickets() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<EvolucaoData[]>([]);
  const [periodo, setPeriodo] = useState('30d');
  const [tipoGrafico, setTipoGrafico] = useState<'linha' | 'area'>('linha');

  useEffect(() => {
    setTimeout(() => {
      const mockData: EvolucaoData[] = [];
      const hoje = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const data = new Date(hoje);
        data.setDate(data.getDate() - i);
        
        mockData.push({
          data: data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          abertos: Math.floor(Math.random() * 20) + 5,
          resolvidos: Math.floor(Math.random() * 18) + 3,
          pendentes: Math.floor(Math.random() * 10) + 2
        });
      }
      
      setData(mockData);
      setLoading(false);
    }, 1500);
  }, [periodo]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução de Tickets</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const totalAbertos = data.reduce((acc, item) => acc + item.abertos, 0);
  const totalResolvidos = data.reduce((acc, item) => acc + item.resolvidos, 0);
  const mediaDiaria = (totalAbertos / data.length).toFixed(1);
  
  const tendencia = totalResolvidos > totalAbertos ? 'positiva' : 'negativa';

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Evolução de Tickets</CardTitle>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={tipoGrafico === 'linha' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setTipoGrafico('linha')}
              >
                Linha
              </Button>
              <Button
                variant={tipoGrafico === 'area' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8"
                onClick={() => setTipoGrafico('area')}
              >
                Área
              </Button>
            </div>

            <Select value={periodo} onValueChange={setPeriodo}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 dias</SelectItem>
                <SelectItem value="15d">15 dias</SelectItem>
                <SelectItem value="30d">30 dias</SelectItem>
                <SelectItem value="90d">90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total de Tickets</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {totalAbertos + totalResolvidos}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Média Diária</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {mediaDiaria}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            tendencia === 'positiva' 
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
          }`}>
            <p className={`text-sm font-medium ${
              tendencia === 'positiva' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              Tendência
            </p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${
                tendencia === 'positiva' 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {tendencia === 'positiva' ? 'Positiva' : 'Negativa'}
              </p>
              {tendencia === 'positiva' ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
            </div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {tipoGrafico === 'linha' ? (
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip
                  // ✅ CORRIGIDO
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      return [value, 'tickets'];
                    }
                    return [0, 'tickets'];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="abertos" 
                  stroke="#ef4444" 
                  name="Abertos"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="resolvidos" 
                  stroke="#22c55e" 
                  name="Resolvidos"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pendentes" 
                  stroke="#f59e0b" 
                  name="Pendentes"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Brush dataKey="data" height={30} stroke="#8884d8" />
              </LineChart>
            ) : (
              <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip
                  // ✅ CORRIGIDO
                  formatter={(value: any) => {
                    if (typeof value === 'number') {
                      return [value, 'tickets'];
                    }
                    return [0, 'tickets'];
                  }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="abertos" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  name="Abertos"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="resolvidos" 
                  stackId="1"
                  stroke="#22c55e" 
                  fill="#22c55e" 
                  name="Resolvidos"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="pendentes" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  name="Pendentes"
                  fillOpacity={0.6}
                />
                <Brush dataKey="data" height={30} stroke="#8884d8" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/10">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm font-medium flex-1">Abertos</span>
            <span className="text-sm font-bold">{totalAbertos}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/10">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-medium flex-1">Resolvidos</span>
            <span className="text-sm font-bold">{totalResolvidos}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50/50 dark:bg-yellow-950/10">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm font-medium flex-1">Pendentes</span>
            <span className="text-sm font-bold">
              {data[data.length - 1]?.pendentes || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
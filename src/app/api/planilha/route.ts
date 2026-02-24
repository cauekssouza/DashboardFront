import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Tenta buscar do backend
    const response = await fetch(`${backendUrl}/sheets/latest`);
    
    if (!response.ok) {
      throw new Error(`Backend respondeu com status ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || data,
      source: 'backend'
    });
    
  } catch (error: any) {
    console.error('Erro ao conectar com backend:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Verifique se o backend está rodando em ' + process.env.NEXT_PUBLIC_API_URL
    }, { status: 500 });
  }
}
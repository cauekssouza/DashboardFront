import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Em vez de chamar o Google Sheets diretamente,
    // chame seu backend NestJS
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${backendUrl}/sheets/latest`);
    const data = await response.json();
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Erro detalhado:', error);
    return NextResponse.json(
      { erro: 'Erro ao buscar dados do backend' },
      { status: 500 }
    );
  }
}
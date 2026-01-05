import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET - Listar fontes de renda do usuário
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const incomeSources = await prisma.incomeSource.findMany({
      where: { userId: session.userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(incomeSources);
  } catch (error) {
    console.error('Erro ao listar fontes de renda:', error);
    return NextResponse.json(
      { error: 'Erro ao listar fontes de renda' },
      { status: 500 }
    );
  }
}

// POST - Criar fontes de renda em lote
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { incomeSources } = await request.json();

    if (!Array.isArray(incomeSources)) {
      return NextResponse.json(
        { error: 'Formato inválido' },
        { status: 400 }
      );
    }

    const createdSources = await prisma.incomeSource.createMany({
      data: incomeSources.map(source => ({
        name: source.name,
        userId: session.userId,
      })),
    });

    return NextResponse.json(createdSources, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar fontes de renda:', error);
    return NextResponse.json(
      { error: 'Erro ao criar fontes de renda' },
      { status: 500 }
    );
  }
}

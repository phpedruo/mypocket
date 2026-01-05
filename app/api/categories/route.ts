import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

// GET - Listar categorias do usuário
export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { userId: session.userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao listar categorias' },
      { status: 500 }
    );
  }
}

// POST - Criar categorias em lote
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { categories } = await request.json();

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { error: 'Formato inválido' },
        { status: 400 }
      );
    }

    const createdCategories = await prisma.category.createMany({
      data: categories.map(cat => ({
        name: cat.name,
        type: cat.type,
        userId: session.userId,
      })),
    });

    return NextResponse.json(createdCategories, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categorias:', error);
    return NextResponse.json(
      { error: 'Erro ao criar categorias' },
      { status: 500 }
    );
  }
}

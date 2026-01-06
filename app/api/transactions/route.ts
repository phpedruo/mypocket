import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { transactionSchema } from '@/lib/validation';
import { sanitizeString } from '@/lib/sanitize';

// GET - Listar transações do usuário
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.userId },
      include: {
        category: true,
        incomeSource: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    return NextResponse.json(
      { error: 'Erro ao listar transações' },
      { status: 500 }
    );
  }
}

// POST - Criar transação
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validação com Zod
    const validation = transactionSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { type, amount, description, date, recurring, frequency, categoryId, incomeSourceId } = validation.data;

    // Sanitização
    const sanitizedDescription = sanitizeString(description);

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: typeof amount === 'string' ? parseFloat(amount) : amount,
        description: sanitizedDescription,
        date: new Date(date),
        recurring: recurring || false,
        frequency: frequency || null,
        userId: session.userId,
        categoryId: categoryId || null,
        incomeSourceId: incomeSourceId || null,
      },
      include: {
        category: true,
        incomeSource: true,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar transação
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, type, amount, description, date, recurring, frequency, categoryId, incomeSourceId } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da transação é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction || existingTransaction.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date),
        recurring: recurring || false,
        frequency: frequency || null,
        categoryId: categoryId || null,
        incomeSourceId: incomeSourceId || null,
      },
      include: {
        category: true,
        incomeSource: true,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar transação' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar transação
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID da transação é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se transação pertence ao usuário
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction || existingTransaction.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Transação não encontrada' },
        { status: 404 }
      );
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar transação' },
      { status: 500 }
    );
  }
}

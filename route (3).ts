import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// GET - Get nutrition logs for a date
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (startDate && endDate) {
      // Get weekly data
      const logs = await db.nutritionLog.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { createdAt: 'asc' }
      });
      return NextResponse.json({ logs }, { status: 200 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const logs = await db.nutritionLog.findMany({
      where: { userId, date },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ logs }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch nutrition logs' }, { status: 500 });
  }
}

// POST - Add nutrition log
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      date,
      meal,
      foodName,
      quantity,
      unit,
      calories,
      protein,
      carbs,
      fats,
      vitaminA = 0,
      vitaminC = 0,
      calcium = 0,
      iron = 0,
      potassium = 0,
      fiber = 0
    } = body;

    if (!date || !meal || !foodName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const log = await db.nutritionLog.create({
      data: {
        userId,
        date,
        meal,
        foodName,
        quantity: quantity || 100,
        unit: unit || 'g',
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fats: fats || 0,
        vitaminA,
        vitaminC,
        calcium,
        iron,
        potassium,
        fiber
      }
    });

    return NextResponse.json({ log, message: 'Food added successfully!' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to add nutrition log' }, { status: 500 });
  }
}

// DELETE - Delete nutrition log
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const logId = searchParams.get('id');

    if (!logId) {
      return NextResponse.json({ error: 'Log ID is required' }, { status: 400 });
    }

    // Verify the log belongs to the user
    const log = await db.nutritionLog.findFirst({
      where: { id: logId, userId }
    });

    if (!log) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    await db.nutritionLog.delete({ where: { id: logId } });

    return NextResponse.json({ message: 'Food item deleted!' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete nutrition log' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

// Helper to generate simple token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// GET - Get current user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatar: true, createdAt: true }
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}

// POST - Login or Signup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (action === 'signup') {
      // Check if user exists
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
      }

      // Create new user
      const user = await db.user.create({
        data: {
          email,
          password, // In production, hash the password
          name: name || email.split('@')[0],
        },
        select: { id: true, email: true, name: true, avatar: true, createdAt: true }
      });

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('userId', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return NextResponse.json({ user, message: 'Account created successfully!' }, { status: 201 });
    }

    if (action === 'login') {
      // Find user
      const user = await db.user.findUnique({ where: { email } });
      if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('userId', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 days
      });

      return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
        message: 'Login successful!'
      }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}

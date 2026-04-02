import { NextResponse } from 'next/server';
import { saveScript, setupDatabase } from '@/lib/db/scripts';
import { encrypt } from '@/lib/encryption';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { title, content, author_name, password } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Ensure database is setup (lazy setup)
    await setupDatabase();

    let finalContent = JSON.stringify(content);
    let hasPassword = false;
    let passwordHash = null;

    if (password && password.trim() !== '') {
      hasPassword = true;
      passwordHash = await bcrypt.hash(password, 10);
      finalContent = encrypt(finalContent, password);
    }

    const id = await saveScript({
      title,
      content: finalContent,
      author_name: author_name || 'Anonymous',
      has_password: hasPassword,
      password_hash: passwordHash ?? undefined,
    });

    return NextResponse.json({ id });
  } catch (err: any) {
    console.error('Failed to save script:', err);
    return NextResponse.json({ 
      error: 'Failed to save script to database',
      details: err.message || 'Unknown error'
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getScriptFull } from '@/lib/db/scripts';
import { decrypt } from '@/lib/encryption';
import bcrypt from 'bcryptjs';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const full = await getScriptFull(id);

    if (!full) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    if (!full.password_hash) {
      return NextResponse.json({ error: 'This script is not password protected' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, full.password_hash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }

    // Decrypt the content
    try {
      const decrypted = decrypt(full.content, password);
      return NextResponse.json({
        content: JSON.parse(decrypted)
      });
    } catch (decryptErr) {
      console.error('Decryption failed for script:', id, decryptErr);
      return NextResponse.json({ error: 'Failed to decrypt script' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('Unlock failed for script:', id, err);
    return NextResponse.json({ error: 'Failed to unlock script' }, { status: 500 });
  }
}

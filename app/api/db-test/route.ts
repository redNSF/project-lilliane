import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Check if the env variable is even there
    const hasUrl = !!process.env.POSTGRES_URL;
    
    if (!hasUrl) {
      return NextResponse.json({
        status: 'Failed ✗',
        error: 'POSTGRES_URL environment variable is missing.',
        hint: 'Go to Vercel Dashboard > Storage > Connect to Project.'
      }, { status: 500 });
    }

    // 2. Try a simple query
    const result = await sql`SELECT NOW();`;
    
    return NextResponse.json({
      status: 'Connected ✓',
      env_present: true,
      time_from_db: result.rows[0].now
    });
  } catch (err: any) {
    console.error('Diagnostic error:', err);
    return NextResponse.json({
      status: 'Failed ✗',
      error: err.message,
      hint: 'If you just connected the DB, you must trigger a new Deployment on Vercel.'
    }, { status: 500 });
  }
}

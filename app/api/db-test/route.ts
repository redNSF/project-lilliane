import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const hasUrl = !!url;
    
    if (!hasUrl) {
      return NextResponse.json({
        status: 'Failed ✗',
        error: 'Database connection string (DATABASE_URL) is missing.',
        hint: 'Go to Vercel Dashboard > Storage > Neon > Connect to Project.'
      }, { status: 500 });
    }

    const sql = neon(url);
    const result = await sql`SELECT NOW();`;
    
    return NextResponse.json({
      status: 'Connected ✓',
      env_present: true,
      time_from_db: result[0].now,
      provider: 'Neon Serverless'
    });
  } catch (err: any) {
    console.error('Diagnostic error:', err);
    return NextResponse.json({
      status: 'Failed ✗',
      error: err.message,
      hint: 'Ensure you have assigned the Neon database to your current environment on Vercel.'
    }, { status: 500 });
  }
}

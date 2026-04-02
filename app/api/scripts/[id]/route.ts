import { NextResponse } from 'next/server';
import { getScriptMetadata, getScriptFull } from '@/lib/db/scripts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: any) {
  const { id } = context.params;

  try {
    const metadata = await getScriptMetadata(id);

    if (!metadata) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    // If no password, return the full content directly for convenience
    if (!metadata.has_password) {
      const full = await getScriptFull(id);
      if (full) {
        return NextResponse.json({
          ...metadata,
          content: JSON.parse(full.content)
        });
      }
    }

    // Otherwise just return metadata
    return NextResponse.json(metadata);
  } catch (err: any) {
    console.error('Failed to fetch script metadata:', id, err);
    return NextResponse.json({ error: 'Failed to fetch script metadata' }, { status: 500 });
  }
}

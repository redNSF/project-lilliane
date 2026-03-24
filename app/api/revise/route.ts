import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { REVISION_SYSTEM_PROMPT, generateRevisionPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-groq-key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Groq API Key is required' },
      { status: 401 }
    );
  }

  try {
    const { originalBrief, revisionNotes } = await req.json();

    if (!originalBrief || !revisionNotes) {
      return NextResponse.json(
        { error: 'Original brief and revision notes are required' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: REVISION_SYSTEM_PROMPT },
        { role: 'user', content: generateRevisionPrompt(originalBrief, revisionNotes) },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from Groq');
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error: any) {
    console.error('Groq Revision Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revise brief' },
      { status: 500 }
    );
  }
}

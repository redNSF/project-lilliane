import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT, generateUserPrompt } from '@/lib/prompts';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-groq-key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Groq API Key is required' },
      { status: 401 }
    );
  }

  try {
    const { script, style } = await req.json();

    if (!script || !style) {
      return NextResponse.json(
        { error: 'Script and Style are required' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: generateUserPrompt(script, style) },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content returned from Groq');
    }

    try {
      return NextResponse.json(JSON.parse(content));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON response from LLM' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Groq Generation Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate brief';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

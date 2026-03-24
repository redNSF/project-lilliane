import { Groq } from 'groq-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-groq-key');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Groq API Key is required' },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey });

    const transcription = await groq.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3',
      response_format: 'verbose_json',
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error: any) {
    console.error('Groq Transcription Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

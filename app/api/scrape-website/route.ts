import { NextRequest, NextResponse } from 'next/server';
import { scrapeAndAnalyze } from '../../../scripts/scrapeWithPlaywrightAndOpenAI';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await scrapeAndAnalyze(url);
    return NextResponse.json(result);
  } catch (error: Error | unknown) {
    console.error('Error in scrape-website:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to scrape website';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 
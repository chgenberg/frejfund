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
  } catch (error: any) {
    console.error('Error in scrape-website:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to scrape website' },
      { status: 500 }
    );
  }
} 
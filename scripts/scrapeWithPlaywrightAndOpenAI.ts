import { chromium } from 'playwright';
import fetch from 'node-fetch';
import fs from 'fs';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function validateAndFormatUrl(url: string): string {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
    return url;
  } catch (e) {
    throw new Error('Invalid URL. Please check the URL format.');
  }
}

export async function scrapeAndAnalyze(url: string) {
  let browser;
  try {
    const formattedUrl = validateAndFormatUrl(url);
    console.log('Validated URL:', formattedUrl);

    console.log('Starting Playwright...');
    browser = await chromium.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Opening new page...');
    const page = await browser.newPage();
    
    console.log('Navigating to:', formattedUrl);
    try {
      const response = await page.goto(formattedUrl, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      });
      
      if (!response) {
        throw new Error('No server response');
      }
      
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }
      
      console.log('Page loaded, status:', response.status());
    } catch (navigationError: any) {
      console.error('Navigation error:', navigationError);
      throw new Error(`Could not load page: ${navigationError.message || 'Unknown error'}`);
    }

    console.log('Extracting data from page...');
    const data = await page.evaluate(() => {
      const getMeta = (name: string) => {
        const el = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement;
        return el ? el.content : '';
      };
      const getOG = (property: string) => {
        const el = document.querySelector(`meta[property='${property}']`) as HTMLMetaElement;
        return el ? el.content : '';
      };
      const schema = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);
      const visibleText = document.body.innerText;
      return {
        title: document.title,
        description: getMeta('description'),
        ogTitle: getOG('og:title'),
        ogDescription: getOG('og:description'),
        ogType: getOG('og:type'),
        ogImage: getOG('og:image'),
        schema,
        visibleText
      };
    });

    console.log('Closing browser...');
    await browser.close();
    browser = null;

    console.log('Sending data to OpenAI...');
    const prompt = `You are an expert at analyzing business websites. Here is data from a website:\nTitle: ${data.title}\nMeta description: ${data.description}\nOpenGraph: ${JSON.stringify({
      ogTitle: data.ogTitle,
      ogDescription: data.ogDescription,
      ogType: data.ogType,
      ogImage: data.ogImage
    }, null, 2)}\nSchema.org: ${data.schema.join('\\n')}\nText: ${data.visibleText.slice(0, 4000)}\n\nExtract and summarize:\n- Company name\n- Industry\n- Area\n- Number of SKUs today\n- Business idea\n- Target audience/customer segments\n- Team/founders\n- Offering/product/service\n- Contact info\n- News articles or press releases\n- Customer reviews or testimonials\n- Other relevant for a business plan\nReturn as a JSON object with keys: company_name, industry, area, sku_count, business_idea, customer_segments, team, revenue_model, market_size, competition, funding_details, contact_info, news_articles, testimonials, and other. Answer in English.`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are an expert at business plans.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.2
      })
    });
    
    console.log('Getting response from OpenAI...');
    const openaiData = await openaiRes.json();
    const content = openaiData.choices?.[0]?.message?.content || '';
    let result;
    try {
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(jsonContent);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      result = { 
        raw: content,
        error: 'Could not parse analysis as JSON'
      };
    }

    const fileContent = [
      `URL: ${formattedUrl}`,
      `Scraped data:`,
      JSON.stringify(data, null, 2),
      `\nOpenAI result:`,
      JSON.stringify(result, null, 2)
    ].join('\n\n');
    const filePath = `./scrape_result_${Date.now()}.txt`;
    fs.writeFileSync(filePath, fileContent);
    console.log(`Result saved in ${filePath}`);

    return result;
  } catch (e) {
    console.error('Error in scrapeAndAnalyze:', e);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    throw e;
  }
} 
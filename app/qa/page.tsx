"use client";
import Image from 'next/image';
import { useState } from 'react';

interface QAItem {
  q: string;
  a: string;
}

const qaData: QAItem[] = [
  { q: 'What does FrejFund do in a nutshell?', a: 'We analyze your business idea with AI, identify strengths/gaps, and guide you to an investment-ready pitch and capital.' },
  { q: 'Do I need a registered company?', a: 'No, idea stage is enough – but we show what\'s required to form a company before seeking investors.' },
  { q: 'How long does the Silver analysis take?', a: '10-15 minutes to answer, report delivered within 30 seconds.' },
  { q: 'What data points does the AI look at?', a: 'Team profile, market size, traction, competitive advantage, risks, finances, and capital needs.' },
  { q: 'Can you guarantee investment?', a: 'No – but we increase your odds by addressing typical deal-breakers and matching you with the right investors.' },
  { q: 'How does the scoring system work (0-10)?', a: 'AI weights 120 parameters according to Nordic VC and angel criteria; 7+ is considered investable.' },
  { q: 'Are my answers confidential?', a: 'Yes, data is encrypted, stored in EU data centers, and never shared without your consent.' },
  { q: 'Can I export the report?', a: 'Yes, PDF + shareable link; Gold and Platinum customers also get PowerPoint one-pager.' },
  { q: 'What does it cost if I change my answers?', a: 'Unlimited revisions included in Gold (quarterly) and Platinum (ongoing).' },
  { q: 'Which investors do you work with?', a: '70+ Nordic business angels, ALMI Invest offices, STOAF, Norrsken VC and more; list continuously updated.' },
  { q: 'Do you take equity?', a: 'Only in Platinum: 2% success fee when you actually raise capital, no equity up-front.' },
  { q: 'How do you measure "team competence"?', a: 'Combines CV metadata, track record, and role complementarity; gaps are automatically flagged.' },
  { q: 'Do you support non-profit or impact companies?', a: 'Yes – AI has special ESG parameters and we work with impact funds.' },
  { q: 'Can I invite co-founders to fill in?', a: 'Yes, share link with guest token; answers are combined in a joint report.' },
  { q: 'What do I do with a red flag in the report?', a: 'Click "Fix guide" – you get concrete actions, templates, and resources to address the gap.' },
  { q: 'How often is the AI model updated?', a: 'Quarterly; we train against fresh deal-flow data and adjust weights based on investor requirements.' },
  { q: 'Do you support languages other than Swedish/English?', a: 'Input accepted in both; report can be automatically translated to English for international VCs.' },
  { q: 'Do I get a human advisor?', a: 'Gold can book 30 min call; Platinum has dedicated coach with 4 hours per month.' },
  { q: 'What tech stack is the platform built on?', a: 'Next.js, Django, OpenAI API, Stripe, Postgres – hosted in EU.' },
  { q: 'Can I integrate data with my CRM?', a: 'Yes, Gold+/API key: Zapier flows to HubSpot, Pipedrive, Notion.' },
  { q: 'What\'s required to reach 9-10 in score?', a: 'Strong, complementary team + unique technology + validated market traction + clear scalable business model.' },
  { q: 'Do I get feedback on pitch deck?', a: 'Platinum: AI review + human design check; Gold can purchase as add-on.' },
  { q: 'Do you have student or non-profit discount?', a: 'Yes, 50% on Gold for students and non-profit projects with org number.' },
  { q: 'Can the AI write my executive summary?', a: 'Yes – after analysis you can click "Generate summary"; saved in Word/Google Docs format.' },
  { q: 'How is personal data handled according to GDPR?', a: 'We follow Schrems II recommendations, have DPA with OpenAI, and anonymize sensitive fields.' },
  { q: 'Does the platform work for pure e-commerce ideas?', a: 'Absolutely – AI switches question set depending on industry (SaaS, e-com, medtech, etc.).' },
  { q: 'Can I upload Excel budget?', a: 'Yes, Gold/Platinum: system parses .xlsx and validates assumptions against industry benchmarks.' },
  { q: 'What happens if I already have investors?', a: 'Report gives them external validation; we can also support in next round.' },
  { q: 'How do you differ from accelerators?', a: 'We are on-demand, remote-first and take no equity until you raise capital; you choose the pace.' },
  { q: 'Can I pause my subscription?', a: 'Yes, Gold monthly subscription can freeze for up to 3 months at no extra cost.' },
];

export default function QA() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-2 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">Q&amp;A</h1>
      {/* Bakgrundsbild */}
      <Image
        src="/bakgrund.png"
        alt="Q&A bakgrund"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-8 border border-gray-200 backdrop-blur-md">
        <div className="flex flex-col gap-4">
          {qaData.map((item, i) => (
            <div key={i} className="rounded-2xl bg-white/80 border border-gray-200 shadow-md overflow-hidden">
              <button
                className="w-full text-left px-6 py-4 font-bold text-lg text-[#16475b] flex justify-between items-center focus:outline-none"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`qa-answer-${i}`}
              >
                <span>{item.q}</span>
                <span className={`ml-4 transition-transform ${open === i ? 'rotate-90' : ''}`}>▶</span>
              </button>
              {open === i && (
                <div id={`qa-answer-${i}`} className="px-6 pb-4 text-gray-800 text-base animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
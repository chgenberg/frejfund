'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ResultProps {
  score: number;
  details: {
    team: number;
    problemSolution: number;
    market: number;
  };
  answers: any;
  subscriptionLevel?: 'silver' | 'gold' | 'platinum';
}

interface Answer {
  question: string;
  answer: string;
}

interface ScoreData {
  score: number;
  motivation: string;
  strengths: string;
  weaknesses: string;
}

interface MarketData {
  marketSize: number;
  marketShare: number;
  competitors: string[];
}

const getScoreLabel = (score: number) => {
  if (score >= 95) return { 
    emoji: '🏆', 
    label: 'Top 1%', 
    summary: 'Your business plan is exceptional and ready for investment.',
    strengths: [
      'Clear and compelling value proposition',
      'Strong market opportunity',
      'Solid business model',
      'Experienced team',
      'Competitive advantages'
    ],
    weaknesses: []
  };
  if (score >= 85) return { 
    emoji: '🚀', 
    label: 'Deal-ready', 
    summary: 'Your business plan is strong and ready for investor meetings.',
    strengths: [
      'Clear value proposition',
      'Good market opportunity',
      'Viable business model',
      'Team in place',
      'Some competitive advantages'
    ],
    weaknesses: [
      'Refine pitch deck',
      'Strengthen financial projections'
    ]
  };
  if (score >= 75) return { 
    emoji: '⭐', 
    label: 'Investable with guidance', 
    summary: 'Your business plan has potential but needs some work.',
    strengths: [
      'Basic value proposition',
      'Market opportunity exists',
      'Initial business model',
      'Core team members'
    ],
    weaknesses: [
      'Strengthen competitive advantages',
      'Refine market analysis',
      'Develop clearer financial projections'
    ]
  };
  if (score >= 50) return { 
    emoji: '⚙️', 
    label: 'Potential, but needs work', 
    summary: 'Your business plan needs significant development.',
    strengths: [
      'Initial business idea',
      'Some market research'
    ],
    weaknesses: [
      'Develop stronger value proposition',
      'Conduct deeper market analysis',
      'Refine business model',
      'Build out team',
      'Strengthen competitive advantages'
    ]
  };
  return { 
    emoji: '🚧', 
    label: 'Under construction', 
    summary: 'Your business plan needs extensive revision.',
    strengths: [
      'Basic business idea in place'
    ],
    weaknesses: [
      'Build out team',
      'Sharpen problem statement',
      'Improve market analysis',
      'Develop clearer business model',
      'Strengthen competitive advantages'
    ]
  };
};

const getScoreComparison = (score: number) => {
  // Simulerad data - i produktion skulle detta komma från en databas
  const percentiles = {
    95: 99,
    85: 92,
    75: 85,
    50: 70,
    0: 50
  };
  
  let percentile = 50;
  for (const [threshold, value] of Object.entries(percentiles)) {
    if (score >= Number(threshold)) {
      percentile = value;
      break;
    }
  }
  
  return percentile;
};

const getMarketSizeData = (marketValue: string) => {
  // Simulerad data - i produktion skulle detta komma från en databas
  const value = marketValue.toLowerCase().includes('miljard') ? 1000 : 100;
  return {
    tam: value,
    sam: value * 0.3,
    som: value * 0.05
  };
};

// Helper for dummy data
const getOr = (val: any, fallback: any) => {
  if (val && val.length > 0) return val;
  // If fallback is 'Not specified' or similar, wrap in span with dark blue color
  if (typeof fallback === 'string' && fallback.toLowerCase().includes('not specif')) {
    return <span style={{ color: '#16475b' }}>{fallback}</span>;
  }
  return fallback;
};

export default function BusinessPlanResult({ score: _score, details, answers, subscriptionLevel = 'silver' }: ResultProps) {
  const router = useRouter();
  const [aiScore, setAiScore] = useState<number | null>(null);
  const [motivation, setMotivation] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [loadingScore, setLoadingScore] = useState(true);
  const [marketShare, setMarketShare] = useState(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<any[]>([]);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [competitorError, setCompetitorError] = useState<string | null>(null);
  const [showScoreInfo, setShowScoreInfo] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const scoreComparison = getScoreComparison(_score);
  const marketDataFromProps = getMarketSizeData(answers.market_size?.market_value || '0');

  // --- AI feedback hooks ---
  const sectionKeys = [
    { key: 'team', label: 'Team' },
    { key: 'market_details', label: 'Market' },
    { key: 'revenue_model', label: 'Business Model' },
    { key: 'pricing', label: 'Pricing' },
    { key: 'traction', label: 'Traction & Milestones' },
    { key: 'founders_dna', label: 'Founders DNA' },
    { key: 'customer_cases', label: 'Customer Cases' },
    { key: 'competition_matrix', label: 'Competitors' },
    { key: 'budget_forecast', label: 'Budget' },
    { key: 'cap_table', label: 'Cap Table' },
    { key: 'tech_ip', label: 'Tech/IP' },
    { key: 'esg_impact', label: 'ESG/Impact' },
    { key: 'exit_strategy', label: 'Exit' }
  ];
  const [sectionFeedback, setSectionFeedback] = useState<{ [key: string]: string }>({});
  const [sectionLoading, setSectionLoading] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setLoadingScore(true);
    fetch('/api/ai-score-businessplan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    })
      .then(res => res.json())
      .then(data => {
        setAiScore(data.score);
        setMotivation(data.motivation);
        setStrengths(data.strengths);
        setWeaknesses(data.weaknesses);
      })
      .finally(() => setLoadingScore(false));
  }, [answers]);

  useEffect(() => {
    async function fetchCompetitors() {
      setLoadingCompetitors(true);
      setCompetitorError(null);
      try {
        const res = await fetch('/api/analyze-competitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers })
        });
        const data = await res.json();
        setCompetitorAnalysis(data.competitors || []);
      } catch (e) {
        setCompetitorError('Kunde inte hämta konkurrensanalys.');
      } finally {
        setLoadingCompetitors(false);
      }
    }
    fetchCompetitors();
  }, [JSON.stringify(answers)]);

  useEffect(() => {
    sectionKeys.forEach(({ key, label }) => {
      const text = JSON.stringify(answers[key] || '');
      if (!text || text === '""') return;
      setSectionLoading(f => ({ ...f, [key]: true }));
      fetch('/api/ai-section-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: label, text })
      })
        .then(res => res.json())
        .then(data => setSectionFeedback(f => ({ ...f, [key]: data.feedback || '' })))
        .finally(() => setSectionLoading(f => ({ ...f, [key]: false })));
    });
    // eslint-disable-next-line
  }, [JSON.stringify(answers)]);

  const renderUpgradeButton = (feature: string) => (
    <button
      onClick={() => {
        setSelectedFeature(feature);
        setShowUpgradeModal(true);
      }}
      className="bg-[#16475b] text-white text-sm px-3 py-1 rounded-full hover:bg-[#2a6b8a] transition-colors"
    >
      Lås upp i {subscriptionLevel === 'silver' ? 'Gold' : 'Platinum'}
    </button>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* SCORE HEADER ALLRA HÖGST UPP */}
      <div className="relative z-20 w-full flex justify-center pt-8 pb-2">
        <div className="bg-white/95 rounded-3xl shadow-xl border border-[#16475b] p-8 flex flex-col items-center w-full max-w-2xl">
          {loadingScore ? (
            <div className="text-[#16475b] text-xl font-bold flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16475b] mb-4"></div>
              AI sätter betyg på din affärsplan...
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center mb-2">
                <div className="text-7xl font-extrabold text-[#16475b] leading-none">{aiScore ?? '-'}</div>
              </div>
              <div className="text-lg text-[#16475b] font-semibold mt-2 mb-1">{motivation}</div>
              <div className="flex flex-col gap-2 w-full mt-2">
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>Strengths:</b> {strengths}</div>
                <div className="bg-[#fff0f0] rounded-xl p-3 text-[#16475b] text-sm"><b>Weaknesses:</b> {weaknesses}</div>
              </div>
            </>
          )}
          <button
            className="mt-2 text-[#2a6b8a] underline text-base hover:text-[#16475b] focus:outline-none"
            onClick={() => setShowScoreInfo(true)}
          >
            Vad betyder score?
          </button>
          <div className="mt-4 text-lg text-[#16475b] text-center font-medium max-w-2xl">{getScoreLabel(_score).summary}</div>
          <div className="mt-4 bg-[#eaf6fa] rounded-xl p-4 text-[#16475b] text-base text-center max-w-xl">
            <b>Next steps:</b> {weaknesses && weaknesses.length > 0 ? weaknesses[0] : 'Continue developing your business plan!'}
          </div>
        </div>
      </div>

      {/* Bakgrundsbild */}
      <Image
        src="/brain.png"
        alt="Brain"
        fill
        className="object-cover"
        priority
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* SCORE INFO MODAL */}
          {showScoreInfo && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
                <button
                  onClick={() => setShowScoreInfo(false)}
                  className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#2a6b8a] focus:outline-none"
                  aria-label="Stäng"
                >×</button>
                <h2 className="text-2xl font-bold text-[#16475b] mb-4 text-center">Vad betyder score?</h2>
                <ul className="space-y-4 text-[#16475b]">
                  <li><span className="text-3xl">🏆</span> <b>95–100:</b> Top 1% – Din affärsplan är exceptionell och redo för VC eller internationell expansion.</li>
                  <li><span className="text-3xl">🚀</span> <b>85–94:</b> Deal-ready – Mycket stark, redo för investerare och tillväxt.</li>
                  <li><span className="text-3xl">⭐</span> <b>75–84:</b> Investable with guidance – Bra grund, men behöver viss utveckling.</li>
                  <li><span className="text-3xl">⚙️</span> <b>50–74:</b> Potential, men kräver jobb – Intressant idé, men flera områden behöver stärkas.</li>
                  <li><span className="text-3xl">🚧</span> <b>0–49:</b> Under byggtid – Affärsplanen behöver omarbetas och utvecklas vidare.</li>
                </ul>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowScoreInfo(false)}
                    className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#2a6b8a] transition-colors"
                  >Stäng</button>
                </div>
              </div>
            </div>
          )}

          {/* Executive Summary & Demo */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#16475b] mb-8 text-[#04121d]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#16475b] mb-2 flex items-center gap-2">
                  <span>🚀</span> Executive Summary
                </h1>
                <div className="text-lg text-[#16475b] mb-2">
                  {getOr(answers.executive_summary?.summary, 'Ingen sammanfattning angiven.')}
                </div>
                {answers.executive_summary?.demo_link && (
                  <div className="mt-2">
                    <a href={answers.executive_summary.demo_link} target="_blank" rel="noopener noreferrer" className="underline text-[#2a6b8a] font-semibold">Se demo/video</a>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className="text-6xl mb-2">{getScoreLabel(_score).emoji}</div>
                <div className="text-5xl font-bold text-[#16475b]">{_score}</div>
                <div className="text-lg text-[#16475b] font-semibold">{getScoreLabel(_score).label}</div>
              </div>
            </div>
          </div>

          {/* Problem & Lösning */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] flex flex-col md:flex-row gap-6 text-[#04121d]">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>❓</span> Problem</h2>
              <div className="text-[#16475b] mb-2">{getOr(answers.business_idea?.what_you_do, 'Ej angivet.')}</div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💡</span> Lösning</h2>
              <div className="text-[#16475b] mb-2">{getOr(answers.business_idea?.why_unique, 'Ej angivet.')}</div>
            </div>
          </div>

          {/* Marknad (TAM/SAM/SOM) */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>📊</span> Market</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <div className="text-[#04121d]"><b>TAM:</b> {getOr(answers.market_details?.tam, 'Ej angivet')}</div>
                <div className="text-[#04121d]"><b>SAM:</b> {getOr(answers.market_details?.sam, 'Ej angivet')}</div>
                <div className="text-[#04121d]"><b>SOM:</b> {getOr(answers.market_details?.som, 'Ej angivet')}</div>
                <div className="text-xs text-[#2a6b8a]">Källa: {getOr(answers.market_details?.market_source, 'Ej angiven')}</div>
              </div>
              {/* Dummy funnel-graf */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <ellipse cx="60" cy="40" rx="50" ry="20" fill="#7edcff" fillOpacity="0.3" />
                  <ellipse cx="60" cy="70" rx="35" ry="14" fill="#7edcff" fillOpacity="0.5" />
                  <ellipse cx="60" cy="100" rx="20" ry="8" fill="#16475b" fillOpacity="0.7" />
                </svg>
              </div>
            </div>
            {/* AI-feedback för marknad */}
            <div className="mt-4">
              {sectionLoading['market_details'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing market...</div>
              ) : sectionFeedback['market_details'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['market_details']}</div>
              ) : null}
            </div>
          </div>

          {/* Affärsmodell & Prissättning */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] grid grid-cols-1 md:grid-cols-2 gap-6 text-[#04121d]">
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>💰</span> Business Model</h2>
              <div>{getOr(answers.revenue_model?.model, 'Not specified')}</div>
              <div className="text-xs text-[#2a6b8a]">Other revenue: {getOr(answers.revenue_model?.other_revenue, 'Not specified')}</div>
              {/* AI-feedback för affärsmodell */}
              <div className="mt-4">
                {sectionLoading['revenue_model'] ? (
                  <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing business model...</div>
                ) : sectionFeedback['revenue_model'] ? (
                  <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['revenue_model']}</div>
                ) : null}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🏷️</span> Prissättning</h2>
              <div>{getOr(answers.pricing?.price_model, 'Ej angivet')}</div>
              <div className="text-xs text-[#2a6b8a]">Prisintervall: {getOr(answers.pricing?.price_range, 'Ej angivet')}</div>
              {/* AI-feedback för prissättning */}
              <div className="mt-4">
                {sectionLoading['pricing'] ? (
                  <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing pricing...</div>
                ) : sectionFeedback['pricing'] ? (
                  <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['pricing']}</div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Traction & Milestones */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📈</span> Traction & Milestones</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Milstolpar:</b> {getOr(answers.milestones?.milestones_list, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>KPI/Traction:</b> {getOr(answers.milestones?.traction_kpi, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för traction */}
            <div className="mt-4">
              {sectionLoading['traction'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing traction...</div>
              ) : sectionFeedback['traction'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['traction']}</div>
              ) : null}
            </div>
          </div>

          {/* Team & Founders' DNA */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🧬</span> Team & Founders' DNA</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Roller:</b> {getOr(answers.founders_dna?.team_roles, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>Strengths:</b> {getOr(answers.founders_dna?.dna_strengths, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för founders_dna */}
            <div className="mt-4">
              {sectionLoading['founders_dna'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing team's DNA...</div>
              ) : sectionFeedback['founders_dna'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['founders_dna']}</div>
              ) : null}
            </div>
          </div>

          {/* Kundcase/LOI */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🤝</span> Kundcase & LOI</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>LOI/länk:</b> {getOr(answers.customer_cases?.loi_links, 'Ej angivet')}</div>
              </div>
              <div className="flex-1">
                <div><b>Kundcitat:</b> {getOr(answers.customer_cases?.customer_quotes, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för kundcase */}
            <div className="mt-4">
              {sectionLoading['customer_cases'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing customer case...</div>
              ) : sectionFeedback['customer_cases'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['customer_cases']}</div>
              ) : null}
            </div>
          </div>

          {/* Konkurrent-matris */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>⚔️</span> Konkurrenter & Matris</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Konkurrenter:</b> {getOr(answers.competition_matrix?.competitors, 'Ej angivet')}</div>
                <div><b>Funktioner vs pris:</b> {getOr(answers.competition_matrix?.features_vs_price, 'Ej angivet')}</div>
                <div><b>Egen position:</b> {getOr(answers.competition_matrix?.positioning, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för konkurrenter */}
            <div className="mt-4">
              {sectionLoading['competition_matrix'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing competition situation...</div>
              ) : sectionFeedback['competition_matrix'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['competition_matrix']}</div>
              ) : null}
            </div>
          </div>

          {/* AI-driven Konkurrentanalys */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-4 flex items-center gap-2"><span>🔎</span> AI-Konkurrentanalys</h2>
            {loadingCompetitors && <div className="text-[#16475b]">Hämtar konkurrensanalys...</div>}
            {competitorError && <div className="text-red-600">{competitorError}</div>}
            {!loadingCompetitors && !competitorError && competitorAnalysis.length > 0 && (
              <div className="space-y-6">
                {competitorAnalysis.map((c, i) => (
                  <div key={i} className="border-b border-[#eaf6fa] pb-4 mb-4 last:border-b-0 last:mb-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="font-bold text-lg">{c.name}</div>
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-[#2a6b8a] underline text-sm">{c.url}</a>}
                    </div>
                    {c.error ? (
                      <div className="text-red-600 text-sm">{c.error}</div>
                    ) : (
                      <div className="text-sm space-y-1">
                        <div><b>Strengths:</b> {c.strengths || '-'}</div>
                        <div><b>Weaknesses:</b> {c.weaknesses || '-'}</div>
                        <div><b>Möjligheter för dig:</b> {c.opportunities || '-'}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget/Prognos */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>📑</span> Budget & Prognos</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Budget/prognos:</b> {getOr(answers.budget_forecast?.forecast_table, 'Ej angivet')}</div>
                <div><b>ARPU:</b> {getOr(answers.budget_forecast?.arpu, 'Ej angivet')}</div>
                <div><b>CAC:</b> {getOr(answers.budget_forecast?.cac, 'Ej angivet')}</div>
                <div><b>Churn:</b> {getOr(answers.budget_forecast?.churn, 'Ej angivet')}</div>
                <div><b>Scenario:</b> {getOr(answers.budget_forecast?.scenario, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för budget */}
            <div className="mt-4">
              {sectionLoading['budget_forecast'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyzing budget...</div>
              ) : sectionFeedback['budget_forecast'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI feedback:</b> {sectionFeedback['budget_forecast']}</div>
              ) : null}
            </div>
          </div>

          {/* Cap Table & Dilution */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa] text-[#04121d]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🥧</span> Cap Table & Dilution</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Ägare och andel:</b> {getOr(answers.cap_table?.owners, 'Ej angivet')}</div>
                <div><b>Planerade rundor:</b> {getOr(answers.cap_table?.planned_rounds, 'Ej angivet')}</div>
                <div><b>Pro-forma:</b> {getOr(answers.cap_table?.pro_forma, 'Ej angivet')}</div>
              </div>
              {/* Dummy pie chart */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 32 32">
                  <circle r="16" cx="16" cy="16" fill="#eaf6fa" />
                  <path d="M16 16 L16 0 A16 16 0 0 1 32 16 Z" fill="#7edcff" />
                  <path d="M16 16 L32 16 A16 16 0 0 1 16 32 Z" fill="#16475b" />
                </svg>
              </div>
            </div>
            {/* AI-feedback för cap table */}
            <div className="mt-4">
              {sectionLoading['cap_table'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyserar ägarstrukturen...</div>
              ) : sectionFeedback['cap_table'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI-feedback:</b> {sectionFeedback['cap_table']}</div>
              ) : null}
            </div>
          </div>

          {/* Teknik/IP */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🛠️</span> Teknik & IP</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>Patentstatus:</b> {getOr(answers.tech_ip?.patent_status, 'Ej angivet')}</div>
                <div><b>Tech-stack:</b> {getOr(answers.tech_ip?.tech_stack, 'Ej angivet')}</div>
                <div><b>Unika algoritmer:</b> {getOr(answers.tech_ip?.unique_algorithms, 'Ej angivet')}</div>
              </div>
            </div>
            {/* AI-feedback för teknik/ip */}
            <div className="mt-4">
              {sectionLoading['tech_ip'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyserar teknik/IP...</div>
              ) : sectionFeedback['tech_ip'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI-feedback:</b> {sectionFeedback['tech_ip']}</div>
              ) : null}
            </div>
          </div>

          {/* ESG/Impact */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🌱</span> ESG & Impact</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div><b>KPI för impact:</b> {getOr(answers.esg_impact?.kpi, 'Ej angivet')}</div>
                <div><b>FN-SDG:</b> {getOr(answers.esg_impact?.sdg, 'Ej angivet')}</div>
                <div><b>Jämförelse med bransch:</b> {getOr(answers.esg_impact?.industry_comparison, 'Ej angivet')}</div>
              </div>
              {/* Dummy radar chart */}
              <div className="flex-1 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <polygon points="50,10 90,30 80,90 20,90 10,30" fill="#7edcff33" />
                  <polygon points="50,30 75,40 70,80 30,80 25,40" fill="#16475b88" />
                </svg>
              </div>
            </div>
            {/* AI-feedback för esg/impact */}
            <div className="mt-4">
              {sectionLoading['esg_impact'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyserar ESG/impact...</div>
              ) : sectionFeedback['esg_impact'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI-feedback:</b> {sectionFeedback['esg_impact']}</div>
              ) : null}
            </div>
          </div>

          {/* Exit/Övrigt */}
          <div className="bg-white/90 rounded-2xl p-6 shadow border border-[#eaf6fa]">
            <h2 className="text-xl font-bold text-[#16475b] mb-2 flex items-center gap-2"><span>🏁</span> Exit & Övrigt</h2>
            <div><b>Exit-plan:</b> {getOr(answers.exit_strategy?.exit_plan, 'Ej angivet')}</div>
            {/* AI-feedback för exit */}
            <div className="mt-4">
              {sectionLoading['exit_strategy'] ? (
                <div className="text-[#16475b] text-sm flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#16475b]"></span> AI analyserar exit-strategin...</div>
              ) : sectionFeedback['exit_strategy'] ? (
                <div className="bg-[#eaf6fa] rounded-xl p-3 text-[#16475b] text-sm"><b>AI-feedback:</b> {sectionFeedback['exit_strategy']}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-[#16475b] mb-4">
              Lås upp {selectedFeature}
            </h2>
            <p className="text-[#16475b] mb-6">
              Uppgradera till {subscriptionLevel === 'silver' ? 'Gold' : 'Platinum'} för att få tillgång till:
            </p>
            <ul className="space-y-2 mb-6">
              {selectedFeature === 'score' && (
                <>
                  <li className="flex items-center">
                    <span className="text-[#16475b] mr-2">✓</span>
                    <span>Jämförelse med andra team</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-[#16475b] mr-2">✓</span>
                    <span>Branschspecifika insikter</span>
                  </li>
                </>
              )}
              {/* Add more feature-specific benefits */}
            </ul>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-4 py-2 text-[#16475b] hover:text-[#2a6b8a]"
              >
                Stäng
              </button>
              <button
                className="bg-[#16475b] text-white px-6 py-2 rounded-full hover:bg-[#2a6b8a]"
              >
                Uppgradera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
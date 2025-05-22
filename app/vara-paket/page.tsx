"use client";

import Image from 'next/image';
import { useState } from 'react';
import { useLoginModal } from '../components/LoginModal';
import { useRouter } from 'next/navigation';

const AVERAGES = {
  silver: 0.7,
  gold: 2.0,
  black: 3.0,
};

function getChance(requested: number, average: number) {
  if (requested <= average) return 80;
  if (requested > average * 2.5) return 5;
  if (requested > average * 2) return 15;
  if (requested > average * 1.5) return 30;
  if (requested > average * 1.2) return 50;
  return 65;
}

// Feature explanations
const FEATURE_EXPLANATIONS: { [key: string]: string } = {
  "PDF light": "A basic PDF report with your analysis results and recommendations. Perfect for getting a first impression of your company's potential.",
  "PDF full": "A detailed PDF report with in-depth analysis, market insights, competitor analysis, and concrete action plans. Includes interactive graphs and visualizations.",
  "interaktiv dashboard": "A dynamic control panel where you can explore your data in real-time, filter results, and see trends over time. Automatically updates when new data comes in.",
  "deck-export": "Automatically generated presentation slides in PowerPoint format, perfect for investor pitches and team meetings. Includes all important KPIs and insights.",
  "dataroom-länk": "A secure, shareable link to a virtual data room where potential investors can review all documentation and data in a structured way.",
  "TTS-svar": "Text-to-Speech function that reads feedback and analyses in 5 different languages. Perfect for international teams and investors.",
  "auto-brand": "Automatic adaptation of all materials with your company's brand, colors, and graphic elements for a professional and consistent presentation.",
  "internationella multiplar": "Comparison with similar companies globally, with adjustments for local market conditions and industry trends.",
  "simuleringar": "Advanced scenario calculations showing how different decisions affect your company's value and growth potential.",
  "warm intros": "Personal introductions to relevant investors based on your industry, stage, and needs.",
  "CRM-sync": "Automatic synchronization with your CRM system to keep track of all investor contacts and meetings.",
  "dedikerad CSM": "A personal Customer Success Manager who helps you maximize the value of FrejFund and supports you in your growth journey.",
};

export default function Pricing() {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const openLoginModal = useLoginModal();
  const router = useRouter();
  const [input, setInput] = useState(1500000);
  const requestedMSEK = input / 1_000_000;
  const chanceSilver = getChance(requestedMSEK, AVERAGES.silver);
  const chanceGold = getChance(requestedMSEK, AVERAGES.gold);
  const chanceBlack = getChance(requestedMSEK, AVERAGES.black);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#16475b] tracking-widest text-center mb-10 mt-2 uppercase">OUR PACKAGES</h1>
      
      {/* Background image */}
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />

      <div className="w-full max-w-7xl">
        {/* Package Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* SILVER Package */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#16475b] mb-2">SILVER</h2>
              <div className="text-3xl font-bold text-[#16475b] mb-2">"Explorer"</div>
              <div className="text-4xl font-black text-[#16475b] mb-2">0 kr</div>
              <div className="text-sm text-gray-600">(account required)</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI Form" value="Basic form 15 min" />
              <Feature title="Report Format" value="PDF light" onInfoClick={() => setActivePopup("PDF light")} />
              <Feature title="Pitch Penguin" value="1 recording / month" />
              <Feature title="Benchmarks" value="General Nordics" />
              <Feature title="Support SLA" value="Community forum" />
              <Feature title="Perfect for" value="Idea testing, students" />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors text-lg tracking-widest uppercase w-full"
                onClick={openLoginModal}
              >
                Start free
              </button>
            </div>
          </div>

          {/* GOLD Package */}
          <div className="bg-white/95 rounded-[2.5rem] shadow-xl border-2 border-[#7edcff] p-8 backdrop-blur-sm relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#7edcff] text-[#16475b] font-bold px-6 py-1 rounded-full text-sm">
              POPULAR
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-[#16475b] mb-2">GOLD</h2>
              <div className="text-3xl font-bold text-[#16475b] mb-2">"Builder"</div>
              <div className="text-4xl font-black text-[#16475b] mb-2">990 kr</div>
              <div className="text-sm text-gray-600">/ analysis or 5 990 kr / year</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI Form" value="Full form 30 min" />
              <Feature title="Report Format" value="PDF full + interactive dashboard" onInfoClick={() => setActivePopup("PDF full")} />
              <Feature title="Pitch Penguin" value="10 recordings / month" />
              <Feature title="Auto-Deck Snapshot" value="✅ (6 slides)" />
              <Feature title="Benchmarks" value="Industry-specific" />
              <Feature title="Risk & Fail-Cost-Calc" value="✅" />
              <Feature title="Investor Radar" value="Angel list" />
              <Feature title="Partner discounts" value="10% on IP-lawyer" />
              <Feature title="Support SLA" value="24h email / 1 call" />
              <Feature title="Perfect for" value="Active pre-seed founders" />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-[#7edcff] text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-white transition-colors text-lg tracking-widest uppercase w-full"
                onClick={() => router.push('/paket/gold')}
              >
                Choose Gold
              </button>
            </div>
          </div>

          {/* BLACK Package */}
          <div className="bg-black rounded-[2.5rem] shadow-xl border border-gray-900 p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-extrabold text-white mb-2">BLACK</h2>
              <div className="text-3xl font-bold text-white mb-2">"Partner"</div>
              <div className="text-4xl font-black text-white mb-2">24 900 kr</div>
              <div className="text-sm text-white/80">/ year + 2% success fee</div>
            </div>
            
            <div className="space-y-6">
              <Feature title="AI Form" value="Full + due diligence module" textWhite />
              <Feature title="Report Format" value="PDF full, deck-export, shared dataroom link" onInfoClick={() => setActivePopup("deck-export")} textWhite />
              <Feature title="Pitch Penguin" value="Unlimited + TTS responses in 5 languages" onInfoClick={() => setActivePopup("TTS-svar")} textWhite />
              <Feature title="Auto-Deck Snapshot" value="✅ (12 slides + auto-brand)" onInfoClick={() => setActivePopup("auto-brand")} textWhite />
              <Feature title="Benchmarks" value="Industry + international multiples" onInfoClick={() => setActivePopup("internationella multiplar")} textWhite />
              <Feature title="Risk & Fail-Cost-Calc" value="✅ + simulations" onInfoClick={() => setActivePopup("simuleringar")} textWhite />
              <Feature title="Investor Radar" value="List + warm intros + CRM sync" onInfoClick={() => setActivePopup("warm intros")} textWhite />
              <Feature title="Partner discounts" value="Up to 30% on partner services" textWhite />
              <Feature title="Support SLA" value="4h response SLA, dedicated CSM" onInfoClick={() => setActivePopup("dedikerad CSM")} textWhite />
              <Feature title="Perfect for" value="Scale-ups raising >3 Mkr within 12 months" textWhite />
            </div>

            <div className="mt-8 text-center">
              <button
                className="bg-black text-white font-bold rounded-full px-8 py-3 shadow-lg border border-[#7edcff] hover:bg-[#7edcff] hover:text-black transition-colors text-lg tracking-widest uppercase w-full"
                onClick={() => router.push('/paket/platinum')}
              >
                Choose Black
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/95 rounded-[2.5rem] shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-extrabold text-[#16475b] mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Can I switch packages later?</h3>
              <p className="text-gray-700">Yes, you can upgrade at any time. For downgrades, the agreement length applies.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">What is the success fee?</h3>
              <p className="text-gray-700">A small percentage of the investment when we help you find capital.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">How does payment work?</h3>
              <p className="text-gray-700">Invoice or card payment. Annual packages can be split into quarterly payments.</p>
            </div>
            <div>
              <h3 className="font-bold text-[#16475b] mb-2">Is there a student discount?</h3>
              <p className="text-gray-700">Yes, contact us with your student email for special pricing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Popup */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full relative animate-fade-in">
            <button
              onClick={() => setActivePopup(null)}
              className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#133a4a] focus:outline-none"
            >
              ×
            </button>
            <h3 className="text-xl font-bold text-[#16475b] mb-4">{activePopup}</h3>
            <p className="text-gray-700 leading-relaxed">
              {FEATURE_EXPLANATIONS[activePopup]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Feature component for consistent styling
function Feature({ title, value, onInfoClick, textWhite }: { title: string; value: string; onInfoClick?: () => void; textWhite?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={textWhite ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[#16475b]"}>{title}</span>
      <div className="flex items-center gap-2">
        <span className={textWhite ? "text-white" : "text-gray-700"}>{value}</span>
        {onInfoClick && (
          <button
            onClick={onInfoClick}
            className={textWhite ? "text-white hover:text-[#7edcff] focus:outline-none" : "text-[#16475b] hover:text-[#133a4a] focus:outline-none"}
            aria-label="Läs mer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 
"use client";
import { useState } from "react";

const AVERAGES = {
  none: 0.7,
  incubator: 2.0,
  frejfund: 3.0,
};

function getChance(requested: number, average: number) {
  // Enkel modell: om requested <= average => 80%, annars fallande logik
  if (requested <= average) return 80;
  if (requested > average * 2.5) return 5;
  if (requested > average * 2) return 15;
  if (requested > average * 1.5) return 30;
  if (requested > average * 1.2) return 50;
  return 65;
}

export default function CapitalChanceCalculator() {
  const [showPopup, setShowPopup] = useState(false);
  const [input, setInput] = useState<number>(1000000);
  const [result, setResult] = useState<number | null>(null);

  const calculateChance = (amount: number) => {
    // Simple calculation based on amount
    if (amount <= 500000) return 85;
    if (amount <= 1000000) return 70;
    if (amount <= 2000000) return 50;
    if (amount <= 5000000) return 30;
    return 15;
  };

  const handleCalculate = () => {
    setResult(calculateChance(input));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow hover:bg-[#7edcff] hover:text-[#04121d] transition-colors"
      >
        Calculate chance
      </button>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#16475b] rounded-3xl shadow-xl border border-[#7edcff] p-8 max-w-xl w-full text-white relative animate-fade-in">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-[#7edcff] focus:outline-none"
              aria-label="Close calculator"
            >
              ×
            </button>
            <h4 className="text-xl font-bold mb-4 tracking-wide text-center">What are your chances of getting your desired capital?</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
              <label htmlFor="capital-input-popup" className="text-white/80 text-sm md:mb-0 mb-2">I want to raise</label>
              <input
                id="capital-input-popup"
                type="number"
                min={100000}
                step={10000}
                value={input}
                onChange={e => setInput(Number(e.target.value))}
                className="w-40 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-center font-bold text-lg focus:outline-none focus:border-[#7edcff]"
              />
              <span className="text-white/80 text-sm">SEK</span>
            </div>
            <button
              onClick={handleCalculate}
              className="w-full bg-[#7edcff] text-[#16475b] font-bold rounded-full px-8 py-3 shadow-lg hover:bg-white transition-colors text-lg tracking-widest uppercase"
            >
              Calculate
            </button>
            {result !== null && (
              <div className="mt-6 text-center">
                <div className="text-4xl font-bold mb-2">{result}%</div>
                <div className="text-white/80">chance of success</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
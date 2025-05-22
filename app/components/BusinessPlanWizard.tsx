"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BusinessPlanResult from './BusinessPlanResult';
import BusinessPlanScore from './BusinessPlanScore';

const BRANSCHER = [
  "SaaS",
  "Tech",
  "Consumer Goods",
  "Health",
  "Fintech",
  "Industry",
  "Services",
  "Education",
  "Energy",
  "Other"
];
const OMRADEN = [
  "Sweden",
  "Nordic",
  "Europe",
  "Global",
  "Other"
];

const questions = [
  // 1. Pitch & Demo
  {
    id: "executive_summary",
    question: "Summarize your business idea in max 1 minute",
    help: "Think elevator pitch! What do you do, for whom, and why is it unique?",
    subQuestions: [
      {
        id: "summary",
        label: "Executive summary (max 300 characters)",
        exampleAnswers: [
          "We automate accounting for small businesses with AI and save 80% of their time.",
          "We sell eco-friendly cleaning products to hotels and restaurants."
        ]
      },
      {
        id: "demo_link",
        label: "Do you have a demo or video? (link)",
        exampleAnswers: [
          "https://youtu.be/demo123",
          "https://vimeo.com/yourdemo"
        ]
      }
    ]
  },
  // 2. Problem & Solution
  {
    id: "business_idea",
    question: "What is your business idea?",
    help: "Clearly describe what you do, for whom, and why it's unique.",
    subQuestions: [
      {
        id: "what_you_do",
        label: "What do you do?",
        exampleAnswers: [
          "We develop an app to automate accounting for small businesses.",
          "We sell eco-friendly cleaning products to hotels."
        ]
      },
      {
        id: "for_whom",
        label: "For whom?",
        exampleAnswers: [
          "Small business owners in the service sector.",
          "Hotels and restaurants with sustainability focus."
        ]
      },
      {
        id: "why_unique",
        label: "Why is it unique?",
        exampleAnswers: [
          "Our solution uses AI to save time and reduce errors.",
          "We are the only ones with Swan-labeled products in the industry."
        ]
      }
    ]
  },
  {
    id: "customer_segments",
    question: "Who is your primary customer?",
    help: "Which groups buy your product/service and why?",
    subQuestions: [
      {
        id: "customer_group",
        label: "Which group?",
        exampleAnswers: [
          "Women 25-40 years in urban areas.",
          "Small business owners in the service sector."
        ]
      },
      {
        id: "customer_needs",
        label: "What needs/problems do they have?",
        exampleAnswers: [
          "Need to save time on administration.",
          "Want eco-friendly alternatives."
        ]
      },
      {
        id: "customer_location",
        label: "Where are they located?",
        exampleAnswers: [
          "Primarily in Stockholm and Gothenburg.",
          "Hotel chains throughout Sweden."
        ]
      }
    ]
  },
  {
    id: "problem_solution",
    question: "What problem do you solve and how?",
    help: "Describe the most important customer problem and how you address it.",
    subQuestions: [
      {
        id: "problem",
        label: "What problem?",
        exampleAnswers: [
          "Small businesses spend unnecessary time on accounting.",
          "Large amounts of chemicals are used in the cleaning industry."
        ]
      },
      {
        id: "solution",
        label: "How do you solve it?",
        exampleAnswers: [
          "We automate the process with AI.",
          "We offer an eco-friendly alternative."
        ]
      }
    ]
  },
  {
    id: "team",
    question: "Who are the founders and employees?",
    help: "Describe the team and their background.",
    subQuestions: [
      {
        id: "founders",
        label: "Founders (name, role, experience)",
        exampleAnswers: [
          "Anna (CEO, 10 years in the industry), Erik (CTO, AI expert)",
          "Two founders with background in logistics and app development."
        ]
      },
      {
        id: "key_team",
        label: "Key people/expertise",
        exampleAnswers: [
          "Sara (Marketing, ex-Google)",
          "A team of five people with experience from both hotels and chemical industry."
        ]
      },
      {
        id: "team_expertise",
        label: "Team expertise and experience",
        exampleAnswers: [
          "Combined experience of 25+ years in the industry",
          "Previous successful startups and exit experience"
        ]
      }
    ]
  },
  // 3. Market & Business Model
  {
    id: "market_details",
    question: "How large is the market?",
    help: "Break down into TAM (total), SAM (addressable), SOM (obtainable) and specify source/method.",
    subQuestions: [
      { id: "tam", label: "TAM (Total Addressable Market)", exampleAnswers: ["10 billion SEK", "1 million users"] },
      { id: "sam", label: "SAM (Serviceable Addressable Market)", exampleAnswers: ["2 billion SEK", "200,000 users"] },
      { id: "som", label: "SOM (Serviceable Obtainable Market)", exampleAnswers: ["200 million SEK", "20,000 users"] },
      { id: "market_source", label: "Source/method", exampleAnswers: ["Statista 2023", "Own calculations"] }
    ]
  },
  {
    id: "revenue_model",
    question: "How do you make money?",
    help: "Choose revenue model(s) and describe.",
    subQuestions: [
      {
        id: "model",
        label: "Revenue model(s)",
        exampleAnswers: [
          "Monthly subscription per company.",
          "Transaction fee per booking.",
          "Product sales to wholesalers and direct to customer."
        ]
      },
      {
        id: "other_revenue",
        label: "Other revenue sources",
        exampleAnswers: [
          "Consulting services in accounting.",
          "Technology licensing."
        ]
      }
    ]
  },
  {
    id: "pricing",
    question: "Pricing",
    help: "Describe how you determine the price of your product/service.",
    subQuestions: [
      {
        id: "price_model",
        label: "Price model",
        exampleAnswers: [
          "Long-term subscription price.",
          "Transaction price per booking.",
          "Fixed price for entire contract."
        ]
      },
      {
        id: "price_range",
        label: "Price range",
        exampleAnswers: [
          "1000-5000 SEK per month.",
          "500-3000 SEK per booking."
        ]
      }
    ]
  },
  // 4. Traction & Milestones
  {
    id: "traction",
    question: "Traction/milestones",
    help: "Describe your success and progress.",
    subQuestions: [
      {
        id: "milestones",
        label: "Important milestones",
        exampleAnswers: [
          "App launch.",
          "First customer contact."
        ]
      },
      {
        id: "user_growth",
        label: "User growth",
        exampleAnswers: [
          "1000 new users per month.",
          "500 new customers per year."
        ]
      }
    ]
  },
  {
    id: "customer_validation",
    question: "Customer validation",
    help: "Describe how you have validated your product/service.",
    subQuestions: [
      {
        id: "validation_method",
        label: "Method",
        exampleAnswers: [
          "Online surveys.",
          "Customer interviews."
        ]
      },
      {
        id: "validation_results",
        label: "Results",
        exampleAnswers: [
          "Validation from 80% of customers.",
          "Validation from 50% of customers."
        ]
      }
    ]
  },
  // 5. Partners & Risks
  {
    id: "partners",
    question: "Partners/suppliers",
    help: "Describe your partners and suppliers.",
    subQuestions: [
      {
        id: "main_partners",
        label: "Main partners",
        exampleAnswers: [
          "Google, Microsoft.",
          "Ecolab, Henkel."
        ]
      },
      {
        id: "partner_contributions",
        label: "Contributions",
        exampleAnswers: [
          "Marketing and distribution.",
          "Product development and quality assurance."
        ]
      }
    ]
  },
  {
    id: "risks",
    question: "Key risks",
    help: "Describe the most important risks for your business idea.",
    subQuestions: [
      {
        id: "financial_risk",
        label: "Financial risks",
        exampleAnswers: [
          "Market risk.",
          "Currency risk."
        ]
      },
      {
        id: "operational_risk",
        label: "Operational risk",
        exampleAnswers: [
          "Technical risk.",
          "Personnel risk."
        ]
      }
    ]
  },
  // 6. Sustainability & Budget
  {
    id: "sustainability",
    question: "Sustainability/impact",
    help: "Describe how you consider sustainability and impact.",
    subQuestions: [
      {
        id: "environmental_impact",
        label: "Environmental impact",
        exampleAnswers: [
          "Reduces chemicals in products.",
          "Increases use of eco-friendly energy sources."
        ]
      },
      {
        id: "social_impact",
        label: "Social impact",
        exampleAnswers: [
          "Supports local economies.",
          "Creates jobs and develops skills."
        ]
      }
    ]
  },
  {
    id: "budget",
    question: "Budget/forecast",
    help: "Describe the budget and forecast for your business idea.",
    subQuestions: [
      {
        id: "revenue_forecast",
        label: "Revenue forecast",
        exampleAnswers: [
          "2 million SEK in annual revenue.",
          "1.5 million SEK in annual revenue."
        ]
      },
      {
        id: "cost_forecast",
        label: "Cost forecast",
        exampleAnswers: [
          "1 million SEK in annual costs.",
          "500,000 SEK in annual costs."
        ]
      }
    ]
  },
  // 7. Board & Exit
  {
    id: "board",
    question: "Board/advisors",
    help: "Describe your board and advisors.",
    subQuestions: [
      {
        id: "board_members",
        label: "Board members",
        exampleAnswers: [
          "Anna (CEO), Erik (CTO), Sara (Marketing).",
          "Two board members with experience from both hotels and chemical industry."
        ]
      },
      {
        id: "advisors",
        label: "Advisors",
        exampleAnswers: [
          "External economist, lawyer.",
          "Internal economist, lawyer."
        ]
      }
    ]
  },
  {
    id: "exit_strategy",
    question: "Do you have an exit strategy?",
    help: "Describe any exit strategies.",
    subQuestions: [
      {
        id: "exit_plan",
        label: "Exit plan",
        exampleAnswers: [
          "IPO 2027",
          "Acquisition by larger player"
        ]
      }
    ]
  }
];

const EXAMPLES: { [key: string]: string[] } = {
  business_idea: [
    "We offer an AI-based platform that helps small businesses automate their accounting.",
    "An app that makes it easy for private individuals to rent out and book parking spots in real-time.",
    "We sell eco-friendly cleaning products to hotels and restaurants."
  ],
  customer_segments: [
    "Small business owners in the service sector who want to save time on administration.",
    "City residents with their own car and need for parking.",
    "Hotel chains and restaurants with sustainability focus."
  ],
  problem_solution: [
    "Many small businesses spend unnecessary time on accounting – we automate the process.",
    "It's hard to find parking in big cities – our app matches empty spots with drivers.",
    "Large amounts of chemicals are used in the cleaning industry – we offer an eco-friendly alternative."
  ],
  team: [
    "Anna (CEO, 10 years in the industry), Erik (CTO, AI expert), Sara (Marketing, ex-Google)",
    "Two founders with background in logistics and app development.",
    "A team of five people with experience from both hotels and chemical industry."
  ],
  revenue_model: [
    "Monthly subscription per company.",
    "Transaction fee per booking.",
    "Product sales to wholesalers and direct to customer."
  ],
  market_size: [
    "There are 500,000 small businesses in Sweden, the market is valued at 2 billion SEK.",
    "In Stockholm, there are 100,000 potential users, the market grows 10% per year.",
    "The global market for eco-friendly cleaning products is 50 billion SEK."
  ],
  competition: [
    "The biggest competitor is Bokio, but we have better AI and a simpler interface.",
    "There are several parking apps, but none with real-time matching.",
    "Our competitors use chemicals – we are completely green."
  ],
  funding_details: [
    "We are seeking 2 MSEK to hire salespeople and develop new features.",
    "Need for 500,000 SEK for marketing and launch in Gothenburg.",
    "We want to take in 1.5 MSEK to expand to the Nordic region."
  ]
};

// 1. Define extra questions for each bransch
const BRANSCH_SPECIFIC_QUESTIONS: { [key: string]: any[] } = {
  SaaS: [
    {
      id: 'saas_churn',
      label: 'Churn (customer loss, % per month)',
      exampleAnswers: ['2%', '5%', '10%']
    },
    {
      id: 'saas_arr',
      label: 'Annual recurring revenue (ARR)',
      exampleAnswers: ['1 MSEK', '5 MSEK']
    },
    {
      id: 'saas_onboarding',
      label: 'How does the onboarding process look like?',
      exampleAnswers: ['Automated onboarding', 'Personal onboarding of customer-responsible']
    }
  ],
  Consumer_Goods: [
    {
      id: 'consumer_logistics',
      label: 'How do you handle logistics and storage?',
      exampleAnswers: ['Own storage', 'Third-party logistics (3PL)']
    },
    {
      id: 'consumer_distribution',
      label: 'How are the products distributed?',
      exampleAnswers: ['Own e-commerce', 'Reseller', 'Amazon']
    }
  ],
  Tech: [
    {
      id: 'tech_ip',
      label: 'Do you have patents or other IP?',
      exampleAnswers: ['Patent application submitted', 'No patent']
    },
    {
      id: 'tech_scalability',
      label: 'How scalable is the technology?',
      exampleAnswers: ['Can handle 1M users', 'Needs to be optimized for growth']
    }
  ]
};

// 1. Apple-inspired utility classes
const inputBase = "w-full px-4 py-2 rounded-2xl bg-white/10 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-white placeholder-[#7edcff] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md";
const selectWrapper = "relative w-full";
const selectBase = `${inputBase} appearance-none pr-10 cursor-pointer`;
const selectArrow = (
  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7edcff] text-lg">
    <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="#7edcff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </span>
);
const radioOuter = "w-5 h-5 rounded-full border-2 border-[#7edcff] bg-white/10 shadow-inner flex items-center justify-center transition-all duration-200 group-focus:ring-2 group-focus:ring-[#7edcff] group-hover:border-[#7edcff]";
const radioInner = "w-3 h-3 rounded-full bg-[#7edcff] scale-0 group-checked:scale-100 transition-transform duration-200";

export default function BusinessPlanWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [bransch, setBransch] = useState("");
  const [customBransch, setCustomBransch] = useState("");
  const [omrade, setOmrade] = useState("");
  const [customOmrade, setCustomOmrade] = useState("");
  const [linkedinProfiles, setLinkedinProfiles] = useState<string[]>([]);
  const [profileAnalysis, setProfileAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const router = useRouter();
  const [showExamples, setShowExamples] = useState<string | null>(null);
  const [showMarketPopup, setShowMarketPopup] = useState(false);
  const [marketEstimate, setMarketEstimate] = useState<string>("");
  const [marketSource, setMarketSource] = useState<string>("");
  const [isMarketLoading, setIsMarketLoading] = useState(false);
  const [competitionSuggestions, setCompetitionSuggestions] = useState<string[]>([]);
  const [isCompetitionLoading, setIsCompetitionLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzingPlan, setIsAnalyzingPlan] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [budgetPosts, setBudgetPosts] = useState<{ amount: string; purpose: string }[]>([{ amount: '', purpose: '' }]);
  const [preStep, setPreStep] = useState(true);
  const [hasWebsite, setHasWebsite] = useState<null | boolean>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const scrapingMessages = [
    "Analyzing your website...",
    "Summarizing business idea and offering...",
    "Building questions based on your needs...",
    "Preparing autofill..."
  ];
  const [scrapeMsgIdx, setScrapeMsgIdx] = useState(0);
  const scrapeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // --- sub-question navigation ---
  const [subStep, setSubStep] = useState(0);

  const current = questions[step - 1];
  const progress = Math.round(((step) / questions.length) * 100);

  const isStartValid =
    company.trim().length > 1 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
    bransch && (bransch !== "Other" || customBransch.trim().length > 1) &&
    omrade && (omrade !== "Other" || customOmrade.trim().length > 1);

  const handleStart = () => {
    localStorage.setItem(
      "bpw_start",
      JSON.stringify({
        company,
        email,
        bransch: bransch === "Other" ? customBransch : bransch,
        omrade: omrade === "Other" ? customOmrade : omrade
      })
    );
    setStep(1);
  };

  // Fetch AI suggestions for certain questions (must be after 'current' is defined)
  useEffect(() => {
    if (!current) return;
    if (['customer_segments', 'problem_solution'].includes(current.id) && answers[current.id]?.length > 1) {
      setIsFetchingSuggestions(true);
      fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: current.id,
          questionText: current.question,
          currentAnswer: answers[current.id],
          context: answers
        })
      })
        .then(res => res.json())
        .then(data => setAiSuggestions(data.suggestions || []))
        .catch(() => setAiSuggestions([]))
        .finally(() => setIsFetchingSuggestions(false));
    } else {
      setAiSuggestions([]);
    }
  }, [current, answers[current?.id]]);

  useEffect(() => {
    if (isScraping) {
      setScrapeMsgIdx(0);
      scrapeIntervalRef.current = setInterval(() => {
        setScrapeMsgIdx(idx => (idx + 1) % scrapingMessages.length);
      }, 1500);
    } else if (scrapeIntervalRef.current) {
      clearInterval(scrapeIntervalRef.current);
      scrapeIntervalRef.current = null;
    }
    return () => {
      if (scrapeIntervalRef.current) {
        clearInterval(scrapeIntervalRef.current);
        scrapeIntervalRef.current = null;
      }
    };
  }, [isScraping]);

  // When we switch main question, reset subStep
  useEffect(() => { setSubStep(0); }, [step]);

  // How many sub-questions per page?
  const SUBS_PER_PAGE = 3;

  if (!open) return null;
  if (result) {
    // Show large results page instead of score popup
    return (
      <BusinessPlanResult
        score={result.score}
        details={result.details}
        answers={answers}
        subscriptionLevel={result.subscriptionLevel || 'silver'}
      />
    );
  }
  if (preStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
            aria-label="Close"
          >×</button>
          <h2 className="text-2xl font-bold mb-6 text-center text-[#16475b]">Do you have a website today?</h2>
          <div className="flex justify-center gap-6 mb-6">
            <button
              className={`px-8 py-3 rounded-full font-bold text-lg shadow ${hasWebsite === true ? 'bg-[#16475b] text-white' : 'bg-[#eaf6fa] text-[#16475b]'} hover:bg-[#2a6b8a] hover:text-white transition-colors`}
              onClick={() => setHasWebsite(true)}
            >YES</button>
            <button
              className={`px-8 py-3 rounded-full font-bold text-lg shadow ${hasWebsite === false ? 'bg-[#16475b] text-white' : 'bg-[#eaf6fa] text-[#16475b]'} hover:bg-[#2a6b8a] hover:text-white transition-colors`}
              onClick={() => { setHasWebsite(false); setPreStep(false); }}
            >NO</button>
          </div>
          {hasWebsite && (
            <div className="mt-4">
              <label className="block font-semibold mb-1 text-[#16475b]">Enter your web address</label>
              <input
                type="url"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={websiteUrl || ""}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="www"
              />
              <button
                className="w-full mt-4 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  setIsScraping(true);
                  setScrapeError(null);
                  try {
                    const res = await fetch('/api/scrape-website', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ url: websiteUrl })
                    });
                    const data = await res.json();
                    if (data && typeof data === 'object') {
                      // Map scraped data to correct fields
                      const mappedData = {
                        company_name: data.company_name,
                        industry: data.industry || '',
                        area: data.area || '',
                        business_idea: data.business_idea || '',
                        customer_segments: data.customer_segments || '',
                        team: data.team || '',
                        revenue_model: data.revenue_model || '',
                        market_size: data.market_size || '',
                        competition: data.competition || '',
                        funding_details: {
                          amount: data.other?.funding_amount || '',
                          usage: data.other?.funding_usage || '',
                          period: data.other?.funding_period || ''
                        }
                      };
                      
                      // Set company name and other basic fields
                      setCompany(data.company_name || '');
                      setBransch(data.industry || '');
                      setOmrade(data.area || '');
                      
                      // Set answers in the form
                      setAnswers(mappedData);
                      setPreStep(false);
                    } else {
                      setScrapeError('Could not interpret information from the website.');
                    }
                  } catch (e) {
                    setScrapeError('Could not fetch information from the website.');
                  } finally {
                    setIsScraping(false);
                  }
                }}
                disabled={!websiteUrl || isScraping}
              >
                {isScraping ? 'Analyzing website...' : 'Continue'}
              </button>
              {isScraping && (
                <div className="flex flex-col items-center mt-6 mb-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16475b]"></div>
                  <div className="mt-4 text-[#16475b] text-base font-semibold min-h-[32px] text-center">
                    {scrapingMessages[scrapeMsgIdx]}
                  </div>
                </div>
              )}
              {scrapeError && <div className="text-red-600 text-sm mt-2 text-center">{scrapeError}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }
  if (step === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-lg w-full p-8 relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold text-[#16475b] mb-6 text-center">Start your business plan analysis</h2>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">Company name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
              value={company || ""}
              onChange={e => setCompany(e.target.value)}
              placeholder="Ex: FrejFund AB"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
              value={email || ""}
              onChange={e => setEmail(e.target.value)}
              placeholder="din@email.se"
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#16475b] font-semibold mb-1">Industry</label>
            <div className={selectWrapper}>
              <select
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md appearance-none pr-10 cursor-pointer"
                value={bransch}
                onChange={e => setBransch(e.target.value)}
              >
                <option value="">Select industry...</option>
                {BRANSCHER.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">{selectArrow}</div>
            </div>
            {bransch === "Annat" && (
              <input
                type="text"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={customBransch || ""}
                onChange={e => setCustomBransch(e.target.value)}
                placeholder="Ange industry"
              />
            )}
          </div>
          <div className="mb-6">
            <label className="block text-[#16475b] font-semibold mb-1">Region</label>
            <div className={selectWrapper}>
              <select
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md appearance-none pr-10 cursor-pointer"
                value={omrade}
                onChange={e => setOmrade(e.target.value)}
              >
                <option value="">Select region...</option>
                {OMRADEN.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">{selectArrow}</div>
            </div>
            {omrade === "Annat" && (
              <input
                type="text"
                className="w-full px-4 py-2 rounded-2xl bg-white/60 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] border border-[#16475b] text-[#16475b] placeholder-[#16475b] focus:outline-none focus:ring-2 focus:ring-[#7edcff] focus:border-[#7edcff] transition-all duration-200 backdrop-blur-md"
                value={customOmrade || ""}
                onChange={e => setCustomOmrade(e.target.value)}
                placeholder="Ange region (stad, land, region)"
              />
            )}
          </div>
          <button
            className="w-full bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#16475b] hover:text-[#16475b] transition-colors text-lg tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStart}
            disabled={!isStartValid}
          >
            START ANALYSIS
          </button>
        </div>
      </div>
    );
  }
  if (step > 0 && !current) return null;

  const handleLinkedinProfilesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const profiles = e.target.value.split('\n').filter(profile => profile.trim() !== '');
    setLinkedinProfiles(profiles);
    setAnswers(a => ({ ...a, team: e.target.value || "" }));
  };

  const analyzeLinkedinProfiles = async () => {
    if (linkedinProfiles.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example analysis - in production, this would call your backend API
      const analysis = linkedinProfiles.map(profile => {
        const name = profile.split('/').pop()?.replace(/-/g, ' ') || '';
        return `${name}: ${getRandomProfileAnalysis()}`;
      }).join('\n\n');
      
      setProfileAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing profiles:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRandomProfileAnalysis = () => {
    const analyses = [
      "f.d. professionellt pokerproffs, numera AI-utvecklare med 7 års erfarenhet av SaaS-plattformar.",
      "serieentreprenör inom hudvård, 3 exiter, expert på D2C-marknadsföring.",
      "tidigare CTO på Spotify, 15 års erfarenhet av skalbar teknik.",
      "grundare av 3 framgångsrika startups, expert på B2B-försäljning.",
      "tidigare VD på Klarna, specialiserad på fintech och betalningslösningar."
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handleRevenueChange = (option: string) => {
    if (option === "Annat") {
      setAnswers(a => ({ ...a, revenue_model: { ...a.revenue_model, other: "" } }));
    } else {
      setAnswers(a => ({ ...a, revenue_model: { ...a.revenue_model, selected: option, other: a.revenue_model?.other || "" } }));
    }
  };

  const handleRevenueOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers(a => ({ ...a, revenue_model: { ...a.revenue_model, other: e.target.value } }));
  };

  const fetchMarketEstimate = async () => {
    setIsMarketLoading(true);
    setShowMarketPopup(false);
    try {
      const res = await fetch("/api/market-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bransch: bransch === "Annat" ? customBransch : bransch,
          omrade: omrade === "Annat" ? customOmrade : omrade
        })
      });
      const data = await res.json();
      setMarketEstimate(data.estimate || "");
      setMarketSource(data.source || "");
    } catch (e) {
      setMarketEstimate("Kunde inte hämta marknadsdata.");
      setMarketSource("");
    } finally {
      setIsMarketLoading(false);
    }
  };

  const fetchCompetitionSuggestions = async () => {
    setIsCompetitionLoading(true);
    try {
      const res = await fetch("/api/competition-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_idea: answers.business_idea,
          bransch: bransch === "Annat" ? customBransch : bransch,
          omrade: omrade === "Annat" ? customOmrade : omrade
        })
      });
      const data = await res.json();
      setCompetitionSuggestions(data.suggestions || []);
      setAnswers(a => ({ ...a, competition: data.suggestions || [] }));
    } catch (e) {
      setCompetitionSuggestions([]);
    } finally {
      setIsCompetitionLoading(false);
    }
  };

  const handleCompetitionChange = (idx: number, value: string) => {
    setAnswers(a => ({ ...a, competition: a.competition.map((c: string, i: number) => i === idx ? value : c) }));
  };

  const handleRemoveCompetition = (idx: number) => {
    setAnswers(a => ({ ...a, competition: a.competition.filter((_: string, i: number) => i !== idx) }));
  };

  const handleAddCompetition = () => {
    setAnswers(a => ({ ...a, competition: [...(a.competition || []), ""] }));
  };

  const handleFinish = async () => {
    setIsAnalyzingPlan(true);
    setAnalyzeError(null);
    try {
      const res = await fetch('/api/analyze-businessplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, applicationType: 'almi' })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setAnalyzeError('Kunde inte analysera affärsplanen. Försök igen.');
    } finally {
      setIsAnalyzingPlan(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setAnswers(a => ({ ...a, [current.id]: (a[current.id] || '') + (a[current.id] ? ' ' : '') + suggestion }));
  };

  // Funding details as budget posts
  const handleBudgetPostChange = (idx: number, field: 'amount' | 'purpose', value: string) => {
    setBudgetPosts(posts => posts.map((p, i) => i === idx ? { ...p, [field]: value } : p));
    setAnswers(a => ({ ...a, funding_details: budgetPosts || [] }));
  };
  const addBudgetPost = () => setBudgetPosts(posts => [...posts, { amount: '', purpose: '' }]);
  const removeBudgetPost = (idx: number) => setBudgetPosts(posts => posts.filter((_, i) => i !== idx));

  const handleNext = () => {
    if (step < questions.length) {
      setStep(step + 1);
    } else if (step === questions.length) {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#f5f7fa] text-[#16475b] rounded-3xl shadow-2xl border border-[#16475b] max-w-xl min-h-[700px] w-full p-8 relative animate-fade-in flex flex-col justify-between">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#16475b] focus:outline-none"
          aria-label="Stäng"
        >
          ×
        </button>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#16475b] font-bold text-sm">Question {step} of {questions.length}</span>
            <span className="text-[#16475b] font-bold text-sm">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#eaf6fa] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#16475b] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {current && current.id === "team" ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{current.question}</h2>
            <p className="mb-4 text-sm text-[#16475b]">{current.help}</p>
            <label className="block font-semibold mb-1">LinkedIn-profiles (one per line)</label>
            <textarea
              className="w-full min-h-[60px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
              value={linkedinProfiles.join('\n') || ""}
              onChange={handleLinkedinProfilesChange}
              placeholder="https://www.linkedin.com/in/name-lastname"
            />
            <button
              className="mt-2 mb-4 bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow transition-colors hover:bg-[#7edc7a] hover:text-[#16475b]"
              onClick={analyzeLinkedinProfiles}
              disabled={linkedinProfiles.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing profiles..." : "Fetch info"}
            </button>
            {profileAnalysis && (
              <div className="mt-2 mb-4 p-4 bg-[#eaf6fa] rounded-lg">
                <h3 className="text-[#16475b] font-semibold mb-2">Analysis:</h3>
                <p className="text-[#16475b] whitespace-pre-line">{profileAnalysis}</p>
              </div>
            )}
            {/* Render sub-questions for team (excluding LinkedIn) */}
            {current.subQuestions.slice(1).map((sub, idx) => (
              <div key={sub.id} className="mb-4">
                <label className="block font-semibold mb-1">{sub.label}</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
                  value={answers.team?.[sub.id] || ""}
                  onChange={e => setAnswers(a => ({
                    ...a,
                    team: { ...(a.team || {}), [sub.id]: e.target.value }
                  }))}
                  placeholder="Write your answer here..."
                />
                <button
                  className="mt-1 text-xs underline text-[#16475b]"
                  type="button"
                  onClick={() => setShowExamples(sub.id === showExamples ? null : sub.id)}
                >
                  Show suggestions
                </button>
                {showExamples === sub.id && (
                  <div style={{ background: '#04121d', borderRadius: '0.75rem', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #16475b' }}>
                    <div className="font-bold text-lg mb-2 text-white">{sub.label}</div>
                    <div className="text-sm text-white">
                      {sub.exampleAnswers?.map((ex: string, i: number) => (
                        <button
                          key={i}
                          className="bg-[#16475b] text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#7edcff] hover:text-[#04121d] transition-colors mr-2 mb-2"
                          type="button"
                          onClick={() =>
                            setAnswers(a => ({
                              ...a,
                              team: { ...(a.team || {}), [sub.id]: ex }
                            }))
                          }
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Navigationsknappar alltid längst ner */}
            <div className="flex justify-between mt-8">
              <button
                className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  if (subStep === 0) {
                    if (step > 1) {
                      setStep(step - 1);
                      setSubStep(0);
                    }
                  } else {
                    setSubStep(s => Math.max(0, s - 1));
                  }
                }}
                disabled={step === 1 && subStep === 0}
              >
                Back
              </button>
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) setSubStep(s => s + 1);
                  else if (!isLastStep) handleNext();
                  else handleFinish();
                }}
                disabled={isAnalyzingPlan}
              >
                {(() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) return 'Next';
                  if (isLastStep) return isAnalyzingPlan ? 'Analyzing...' : 'Finish';
                  return 'Next';
                })()}
              </button>
            </div>
          </div>
        ) : current && current.subQuestions ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{current.question}</h2>
            <p className="mb-4 text-sm text-[#16475b]">{current.help}</p>
            {/* Visa 3 sub-questions per sida */}
            {current.subQuestions.slice(subStep * SUBS_PER_PAGE, (subStep + 1) * SUBS_PER_PAGE).map((sub: any) => (
              <div key={sub.id} className="mb-4">
                <label className="block font-semibold mb-1">{sub.label}</label>
                <textarea
                  className="w-full min-h-[60px] rounded-lg border border-[#16475b] bg-white/80 px-4 py-2 text-[#16475b] focus:outline-none focus:border-[#16475b]"
                  value={answers[current.id]?.[sub.id] || ""}
                  onChange={e => setAnswers(a => ({
                    ...a,
                    [current.id]: { ...(a[current.id] || {}), [sub.id]: e.target.value }
                  }))}
                  placeholder="Write your answer here..."
                />
                <button
                  className="mt-1 text-xs underline text-[#16475b]"
                  type="button"
                  onClick={() => setShowExamples(sub.id === showExamples ? null : sub.id)}
                >
                  Show suggestions
                </button>
                {showExamples === sub.id && (
                  <div style={{ background: '#04121d', borderRadius: '0.75rem', padding: '0.75rem', marginTop: '0.5rem', border: '1px solid #16475b' }}>
                    <div className="font-bold text-lg mb-2 text-white">{sub.label}</div>
                    <div className="text-sm text-white">
                      {sub.exampleAnswers?.map((ex: string, i: number) => (
                        <button
                          key={i}
                          className="bg-[#16475b] text-white rounded-full px-3 py-1 text-xs font-semibold hover:bg-[#7edcff] hover:text-[#04121d] transition-colors mr-2 mb-2"
                          type="button"
                          onClick={() =>
                            setAnswers(a => ({
                              ...a,
                              [current.id]: { ...(a[current.id] || {}), [sub.id]: ex }
                            }))
                          }
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {/* Sub-question navigation - alltid längst ner */}
            <div className="flex justify-between items-center mt-4 relative">
              <button
                className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  if (subStep === 0) {
                    if (step > 1) {
                      setStep(step - 1);
                      setSubStep(0);
                    }
                  } else {
                    setSubStep(s => Math.max(0, s - 1));
                  }
                }}
                disabled={step === 1 && subStep === 0}
              >
                Back
              </button>
              {/* Centrera BERÄKNA MARKNADSVÄRDE mellan knapparna om market_potential */}
              {current.id === 'market_potential' && (
                <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                  <button
                    className="bg-[#16475b] text-white font-bold rounded-full px-4 py-2 shadow hover:bg-[#7edcff] hover:text-[#04121d] transition-colors text-sm mx-2"
                    type="button"
                    onClick={async () => {
                      setIsMarketLoading(true);
                      try {
                        const res = await fetch('/api/market-estimate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            bransch: bransch === 'Annat' ? customBransch : bransch,
                            omrade: omrade === 'Annat' ? customOmrade : omrade
                          })
                        });
                        const data = await res.json();
                        setAnswers(a => ({
                          ...a,
                          market_potential: {
                            ...(a.market_potential || {}),
                            market_value: data.estimate || '',
                            market_source: data.source || ''
                          }
                        }));
                      } finally {
                        setIsMarketLoading(false);
                      }
                    }}
                    disabled={isMarketLoading}
                  >
                    {isMarketLoading ? 'Hämtar marknadsvärde...' : 'BERÄKNA MARKNADSVÄRDE'}
                  </button>
                </div>
              )}
              {current.id === 'competition' && (
                <button
                  className="bg-[#16475b] text-white font-bold rounded-full px-4 py-2 shadow hover:bg-[#7edcff] hover:text-[#04121d] transition-colors text-sm mx-2"
                  type="button"
                  onClick={async () => {
                    setIsCompetitionLoading(true);
                    try {
                      const res = await fetch('/api/competition-suggestions', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          business_idea: answers.business_idea?.what_you_do || '',
                          bransch: bransch === 'Annat' ? customBransch : bransch,
                          omrade: omrade === 'Annat' ? customOmrade : omrade
                        })
                      });
                      const data = await res.json();
                      setAnswers(a => ({
                        ...a,
                        competition: {
                          ...(a.competition || {}),
                          main_competitors: data.suggestions || []
                        }
                      }));
                    } finally {
                      setIsCompetitionLoading(false);
                    }
                  }}
                  disabled={isCompetitionLoading}
                >
                  {isCompetitionLoading ? 'Hämtar konkurrenter...' : 'HITTA KONKURRENTER'}
                </button>
              )}
              <button
                className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
                onClick={() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) setSubStep(s => s + 1);
                  else if (!isLastStep) handleNext();
                  else handleFinish();
                }}
                disabled={isAnalyzingPlan}
              >
                {(() => {
                  const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                  const isLastChunk = subStep >= maxSubStep;
                  const isLastStep = step === questions.length;
                  if (!isLastChunk) return 'Next';
                  if (isLastStep) return isAnalyzingPlan ? 'Analyzing...' : 'Finish';
                  return 'Next';
                })()}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-4">
            <button
              className="bg-[#eaf6fa] text-[#16475b] font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </button>
            <button
              className="bg-[#16475b] text-white font-bold rounded-full px-6 py-2 shadow border border-[#16475b] hover:bg-[#16475b] hover:text-white transition-colors text-base"
              onClick={() => {
                const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                const isLastChunk = subStep >= maxSubStep;
                const isLastStep = step === questions.length;
                if (!isLastChunk) setSubStep(s => s + 1);
                else if (!isLastStep) handleNext();
                else handleFinish();
              }}
              disabled={isAnalyzingPlan}
            >
              {(() => {
                const maxSubStep = Math.ceil(current.subQuestions.length / SUBS_PER_PAGE) - 1;
                const isLastChunk = subStep >= maxSubStep;
                const isLastStep = step === questions.length;
                if (!isLastChunk) return 'Next';
                if (isLastStep) return isAnalyzingPlan ? 'Analyzing...' : 'Finish';
                return 'Next';
              })()}
            </button>
          </div>
        )}
        {analyzeError && <div className="text-red-600 text-sm mt-2 text-center">{analyzeError}</div>}
        {isAnalyzingPlan && (
          <div className="flex justify-center items-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16475b]"></div>
            <span className="ml-3 text-[#16475b]">AI analyzing your business plan...</span>
          </div>
        )}
        {current.id === 'market_potential' && (
          <div className="mb-4">
            {answers.market_potential?.market_source && (
              <div className="text-xs mt-2 text-[#16475b]">{answers.market_potential.market_source}</div>
            )}
          </div>
        )}
        {current.id === 'competition' && (
          <div className="mb-4">
            {Array.isArray(answers.competition?.main_competitors) && answers.competition.main_competitors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {answers.competition.main_competitors.map((c: string, i: number) => (
                  <span key={i} className="bg-[#eaf6fa] text-[#16475b] rounded-full px-3 py-1 text-xs font-semibold">{c}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 
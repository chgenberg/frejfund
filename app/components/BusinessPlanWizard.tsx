"use client";
import React, { useState, useEffect, useRef } from "react";
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

interface Answer {
  question: string;
  answer: string;
}

interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'radio';
  options?: string[];
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

export default function BusinessPlanWizard({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections: Section[] = [
    {
      id: 'team',
      title: 'Team',
      questions: [
        {
          id: 'founders',
          text: 'Who are the founders?',
          type: 'text'
        },
        {
          id: 'experience',
          text: 'What relevant experience do you have?',
          type: 'text'
        }
      ]
    },
    {
      id: 'problem',
      title: 'Problem & Solution',
      questions: [
        {
          id: 'problem',
          text: 'What problem are you solving?',
          type: 'text'
        },
        {
          id: 'solution',
          text: 'How are you solving it?',
          type: 'text'
        }
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-score-businessplan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit business plan');
      }

      const data = await response.json();
      localStorage.setItem('businessPlanScore', JSON.stringify(data));
      router.push('/result');
    } catch (err) {
      setError('Failed to submit business plan. Please try again.');
      console.error('Error submitting business plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }
  if (currentSection < sections.length) {
    return (
      <div className="min-h-screen bg-[#eaf6fa] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#16475b] mb-8">Business Plan Wizard</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">{sections[currentSection].title}</h2>
            
            <div className="space-y-6">
              {sections[currentSection].questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <label className="block font-medium text-gray-700">
                    {question.text}
                  </label>
                  {question.type === 'text' && (
                    <textarea
                      className="w-full p-2 border rounded-md"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      rows={4}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-md"
                onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
              >
                Previous
              </button>
              
              {currentSection < sections.length - 1 ? (
                <button
                  className="bg-[#16475b] text-white px-6 py-2 rounded-md"
                  onClick={() => setCurrentSection(prev => Math.min(sections.length - 1, prev + 1))}
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-[#16475b] text-white px-6 py-2 rounded-md"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
} 
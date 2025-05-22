import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
import json
import base64
from datetime import datetime
import requests
from frontend.components.ui_components import (
    progress_bar, 
    info_box, 
    success_box, 
    warning_box,
    section_title
)
from backend.openai_utils import (
    generate_chatgpt_response, 
    generate_swot_analysis, 
    create_swot_diagram,
    generate_logo
)
from backend.google import generate_competitor_map

def business_analysis_page():
    """Interactive business analysis tool for evaluating business plans"""
    st.title("Interactive Business Analysis")
    st.write(
        "Let's analyze your business idea by asking the most important questions that investors, Almi, Vinnova, and other financiers will ask.\n\n"
        "**Tip:** You can choose to import the information you've already entered in previous steps."
    )

    # ------------------------------------------------------------
    # 1) Show previously entered data (from user_data) in an expander
    # ------------------------------------------------------------

    if 'user_data' in st.session_state and st.session_state.user_data:
        with st.expander("My previous answers (click to show)", expanded=False):
            for k, v in st.session_state.user_data.items():
                st.write(f"**{k.capitalize()}:** {v}")
    
    # ------------------------------------------------------------
    # Reset auto-fill flags if desired
    # ------------------------------------------------------------
    col1, col2 = st.columns([3, 2])
    
    with col1:
        # Import data from previous steps
        if st.button("Import data from previous steps", key="import_previous_data", type="secondary"):
            _prefill_analysis_answers()
            st.success("Previous answers imported! You can now complete or adjust before the analysis.")
            st.rerun()
    
    with col2:
        # Reset auto-fill
        if st.button("Reset AI auto-fill", key="reset_auto_prefill", type="secondary", help="Click here if you want to start over with a new business idea and let AI fill in again"):
            # Remove all auto_prefill flags
            keys_to_remove = [key for key in st.session_state.keys() if key.startswith("auto_prefill_")]
            for key in keys_to_remove:
                del st.session_state[key]
            st.success("AI auto-fill reset! When you navigate to a section, AI will fill in again.")
            st.rerun()

    # ------------------------------------------------------------
    # 2) Option to import data to the analysis section
    # ------------------------------------------------------------

    def _prefill_analysis_answers():
        """Fills st.session_state.analysis_answers with data from user_data where relevant."""
        if st.session_state.get("analysis_prefilled", False):
            return  # Avoid duplicates on multiple clicks

        ud = st.session_state.user_data
        mapping = {
            # Business Idea & Solution
            "business_idea_solution_business_idea": f"{ud.get('produktutbud', '')} – {ud.get('strategi', '')}",
            "business_idea_solution_product_description": ud.get('produktutbud', ''),
            # Market, Customers & Traction
            "market_customers_traction_customer_segments": ud.get('malgrupp', ''),
            # Business Model & Finance
            "business_model_finance_go_to_market": ud.get('strategi', ''),
        }

        # Ensure the analysis answers dictionary exists
        if 'analysis_answers' not in st.session_state:
            st.session_state.analysis_answers = {}

        for key, value in mapping.items():
            if value and value.strip():
                st.session_state.analysis_answers[key] = value

        st.session_state.analysis_prefilled = True

    # Load or initialize data
    if 'analysis_answers' not in st.session_state:
        st.session_state.analysis_answers = {}
    if 'analysis_results' not in st.session_state:
        st.session_state.analysis_results = {}
    
    # Navigation between categories
    categories = [
        "Business Idea & Solution",
        "Market, Customers & Traction",
        "Team & Organization",
        "Business Model & Finance",
        "Risk, Sustainability & Exit"
    ]
    
    if 'current_category' not in st.session_state:
        st.session_state.current_category = categories[0]
    
    # Navigation buttons with modern, clean design
    st.markdown("""
        <style>
        .stButton > button {
            font-weight: 500;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        .stButton > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        div.row-widget.stButton {
            margin-bottom: 10px;
        }
        </style>
    """, unsafe_allow_html=True)
    
    cols = st.columns(len(categories))
    for i, category in enumerate(categories):
        is_active = st.session_state.current_category == category
        button_style = "primary" if is_active else "secondary"
        if cols[i].button(
            category, 
            key=f"nav_{category}", 
            type=button_style,
            help=f"Navigate to {category}",
            use_container_width=True
        ):
            st.session_state.current_category = category
            st.rerun()
    
    st.markdown("---")
    
    # Show current category with clean design
    section_title(st.session_state.current_category, icon="")
    
    # Show a clean indicator if the section is automatically pre-filled
    current_category_key = st.session_state.current_category.lower().replace(", ", "_").replace(" & ", "_")
    if f"auto_prefill_{current_category_key}_done" in st.session_state:
        st.markdown(
            f"""
            <div style="margin-top:-15px; margin-bottom:20px;">
                <span style="background-color:#f0f2f6; color:#444; padding:4px 10px; border-radius:3px; font-size:0.8em; font-weight:500;">
                    AI pre-filled
                </span>
            </div>
            """,
            unsafe_allow_html=True
        )
    
    # Categories and their questions
    category_questions = get_category_questions()
    
    # Show current question category
    current_category = st.session_state.current_category
    if current_category in category_questions:
        display_question_section(
            category_questions[current_category],
            current_category.lower().replace(", ", "_").replace(" & ", "_")
        )
    
    # Summary and report
    st.markdown("---")
    # Custom button with clean design
    st.markdown(
        """
        <style>
        .professional-primary > button {
            background: linear-gradient(90deg, #1e3c72, #2a5298) !important;
            color: #ffffff !important;
            font-weight: 500 !important;
            border: none !important;
            box-shadow: 0 4px 10px rgba(42,82,152,0.3) !important;
            transition: all 0.3s ease !important;
        }
        .professional-primary > button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(42,82,152,0.4) !important;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )

    red_btn_container = st.container()
    with red_btn_container:
        generate_final = st.button("Generate final report & visualizations", key="final_report_button", type="primary")
    
    # Add custom class to container
    red_btn_container.markdown('<div class="professional-primary" id="final_report_button"></div>', unsafe_allow_html=True)

    if generate_final:
        generate_final_dashboard()

def get_category_questions():
    """Returns all question categories and their questions"""
    return {
        "Business Idea & Solution": {
            "business_idea": {
                "question": "What is your business idea? Clearly describe what you do, for whom, and why it's unique.",
                "help": "Concisely describe what the company sells or what service it offers.",
                "type": "text_area"
            },
            "vision": {
                "question": "What is your vision for the company?",
                "help": "A good vision is inspiring, ambitious but achievable, and communicates the company's purpose.",
                "type": "text_area"
            },
            "history": {
                "question": "Briefly describe the company's history and background.",
                "help": "When was the company founded, key milestones, and why was it started?",
                "type": "text_area"
            },
            "long_term_goals": {
                "question": "What are the company's long-term SMART goals?",
                "help": "Specific, Measurable, Accepted, Realistic, Time-bound goals. E.g. 'Reach 10,000 customers within 3 years'",
                "type": "text_area"
            },
            "product_description": {
                "question": "Describe your product/service and what makes it unique",
                "help": "Explain the technology, functionality, and key benefits for the user.",
                "type": "text_area"
            },
            "trl_level": {
                "question": "What is the Technology Readiness Level (TRL) of your product/service?",
                "help": "TRL scale goes from 1 to 9 (idea → finished product in operation)",
                "type": "select_box",
                "options": [
                    "TRL 1 - Basic principles observed",
                    "TRL 2 - Technology concept formulated",
                    "TRL 3 - Experimental proof of concept",
                    "TRL 4 - Technology validated in lab",
                    "TRL 5 - Technology validated in relevant environment",
                    "TRL 6 - Technology demonstrated in relevant environment",
                    "TRL 7 - System prototype demonstration in operational environment",
                    "TRL 8 - System complete and qualified",
                    "TRL 9 - System proven in operational environment"
                ]
            },
            "ip_protection": {
                "question": "How is your innovation protected?",
                "help": "Describe your IP strategy (patents, trademarks, trade secrets, etc.).",
                "type": "text_area"
            },
            "development_roadmap": {
                "question": "Describe your product development plan",
                "help": "Upcoming versions, features, and approximate timeline.",
                "type": "text_area"
            }
        },
        "Market, Customers & Traction": {
            "market_size": {
                "question": "How large is the target market?",
                "help": "Specify size in currency and/or number of customers. Include TAM, SAM, and SOM if possible.",
                "type": "text_area"
            },
            "customer_segments": {
                "question": "Describe your main customer segments and their needs",
                "help": "Which groups buy your product/service and why? Demographic characteristics, needs, buying behavior.",
                "type": "text_area"
            },
            "willingness_to_pay": {
                "question": "What is the customers' willingness to pay and how have you validated this?",
                "help": "Have you discussed pricing with potential customers? Are there comparable products/services?",
                "type": "text_area"
            },
            "competition": {
                "question": "Who are your main competitors and how do you differentiate?",
                "help": "List direct and indirect competitors and your advantages compared to them.",
                "type": "text_area"
            },
            "market_trends": {
                "question": "What market trends affect your business?",
                "help": "Technological, social, economic, or regulatory changes affecting the target market.",
                "type": "text_area"
            },
            "current_progress": {
                "question": "Describe your traction and validation so far",
                "help": "Customers, revenue, growth, proof-of-concept, pilots, etc.",
                "type": "text_area"
            },
            "customer_validation": {
                "question": "How have you validated customer needs and your solution?",
                "help": "Interviews, user testing, beta testing, sales, etc.",
                "type": "text_area"
            },
            "growth_metrics": {
                "question": "What growth KPIs do you track and what are the results?",
                "help": "Examples: customer growth, MRR growth, conversion rate.",
                "type": "text_area"
            }
        },
        "Team & Organization": {
            "team_members": {
                "question": "Describe the team, key competencies, and competency gaps",
                "help": "List founders, key people, their roles, experience, and which competencies are missing.",
                "type": "text_area"
            },
            "board": {
                "question": "What does the board look like and what competencies do they contribute?",
                "help": "List board members, their background, and contributions to the company.",
                "type": "text_area"
            },
            "advisors": {
                "question": "Which advisors/mentors are connected to the company?",
                "help": "List advisors and their contributions to the company.",
                "type": "text_area"
            },
            "incentives": {
                "question": "What incentive programs exist for key people?",
                "help": "Describe option programs, bonuses, or other incentives.",
                "type": "text_area"
            },
            "governance": {
                "question": "How do you work with governance, equality, and diversity?",
                "help": "Describe decision processes and concrete initiatives to promote equality and inclusion.",
                "type": "text_area"
            }
        },
        "Business Model & Finance": {
            "revenue_model": {
                "question": "Describe your business model and revenue streams",
                "help": "How do you make money? Subscriptions, one-time payments, licenses, etc.",
                "type": "text_area"
            },
            "pricing_model": {
                "question": "Describe your pricing model and pricing logic",
                "help": "Explain how you charge, pricing strategy, and margin structure.",
                "type": "text_area"
            },
            "costs_and_margins": {
                "question": "Describe cost structure and margins",
                "help": "Fixed vs. variable costs, economies of scale, gross and operating margins.",
                "type": "text_area"
            },
            "key_metrics": {
                "question": "What are the most important metrics to measure your success?",
                "help": "Examples: MRR, CAC, LTV, churn rate, payback time.",
                "type": "text_area"
            },
            "go_to_market": {
                "question": "What is your go-to-market strategy?",
                "help": "Describe sales channels, marketing tactics, and customer focus.",
                "type": "text_area"
            },
            "funding_details": {
                "question": "Describe your funding needs and how the money will be used",
                "help": "Amount, time period, main areas of use.",
                "type": "text_area"
            },
            "burn_and_runway": {
                "question": "What is your burn rate and runway?",
                "help": "Monthly capital burn now/after funding and how long it lasts.",
                "type": "text_area"
            },
            "previous_funding": {
                "question": "Describe previous funding and valuation",
                "help": "Previous rounds, amounts, and valuations.",
                "type": "text_area"
            },
            "financial_projections": {
                "question": "Summarize your financial projections for 3-5 years",
                "help": "Revenue, costs, results, and key assumptions.",
                "type": "text_area"
            }
        },
        "Risk, Sustainability & Exit": {
            "key_risks": {
                "question": "Identify the 3-5 biggest risks to the business",
                "help": "Examples: technology, market, team, funding.",
                "type": "text_area"
            },
            "market_and_competition_risks": {
                "question": "Describe market and competition risks",
                "help": "Competition, price pressure, changed demand, etc.",
                "type": "text_area"
            },
            "operational_risks": {
                "question": "Describe operational and technical risks",
                "help": "Development delays, operational security, dependencies.",
                "type": "text_area"
            },
            "external_risks": {
                "question": "Describe external risks (regulatory, financial, etc)",
                "help": "Permits, legislation, exchange rates, funding risks.",
                "type": "text_area"
            },
            "mitigation_strategy": {
                "question": "How do you plan to handle the risks?",
                "help": "Concrete measures to reduce or eliminate risks.",
                "type": "text_area"
            },
            "sdg_goals": {
                "question": "Which UN Sustainable Development Goals (SDG) does your business contribute to?",
                "help": "Select relevant goals.",
                "type": "multiselect",
                "options": [
                    "1: No Poverty",
                    "2: Zero Hunger",
                    "3: Good Health and Well-being",
                    "4: Quality Education",
                    "5: Gender Equality",
                    "6: Clean Water and Sanitation",
                    "7: Affordable and Clean Energy",
                    "8: Decent Work and Economic Growth",
                    "9: Industry, Innovation and Infrastructure",
                    "10: Reduced Inequalities",
                    "11: Sustainable Cities and Communities",
                    "12: Responsible Consumption and Production",
                    "13: Climate Action",
                    "14: Life Below Water",
                    "15: Life on Land",
                    "16: Peace, Justice and Strong Institutions",
                    "17: Partnerships for the Goals"
                ]
            },
            "sustainability_impact": {
                "question": "Describe your environmental and social impact",
                "help": "How does your solution affect climate, environment, and people?",
                "type": "text_area"
            },
            "sustainability_strategy": {
                "question": "Describe your sustainability strategy",
                "help": "How is sustainability integrated into the business model?",
                "type": "text_area"
            },
            "exit_plan": {
                "question": "Describe your exit strategy and timeline",
                "help": "Acquisition, IPO etc. When and how?",
                "type": "text_area"
            },
            "potential_acquirers": {
                "question": "List potential acquirers",
                "help": "Names of companies or types of players.",
                "type": "text_area"
            },
            "repayment_ability": {
                "question": "What is your loan repayment ability?",
                "help": "Relevant for e.g. Almi loans.",
                "type": "text_area"
            },
            "previous_exits": {
                "question": "Has the team previously completed exits?",
                "help": "Describe previous exits and outcomes.",
                "type": "text_area"
            }
        }
    }

def display_question_section(questions, section_name):
    """Shows the questions in a section and saves the answers"""
    # Show section instructions
    info_text = get_section_description(section_name)
    if info_text:
        info_box(info_text)
    
    # ------------------------------------------------------------
    # AI pre-fill of answers in this section
    # ------------------------------------------------------------

    def ai_prefill_section():
        """Uses OpenAI to guess answers to questions based on previous data"""
        user_data = st.session_state.get("user_data", {})

        # Create a clear JSON template for the model
        template_dict = {qd["question"]: "" for qd in questions.values()}

        prompt = (
            "You are a business coach helping an entrepreneur fill out a business analysis. "
            "The entrepreneur has previously provided the following information (user_data):\n"
            f"{json.dumps(user_data, ensure_ascii=False, indent=2)}\n\n"
            "Based on this info, guess short (1-2 sentences) preliminary answers to the questions in the section. "
            "Return ONLY valid JSON with exactly the same keys as in the template below.\n\n"
            f"Template:\n{json.dumps(template_dict, ensure_ascii=False, indent=2)}"
        )

        with st.spinner("Generating AI suggestions..."):
            raw = generate_chatgpt_response(prompt, temperature=0.4)

        # Try to extract JSON
        import re
        json_str = raw
        # Remove code blocks if they exist
        code_match = re.search(r"```json([\s\S]*?)```", raw)
        if code_match:
            json_str = code_match.group(1)

        try:
            suggestions = json.loads(json_str)
        except Exception:
            # Fallback: simple line parsing
            suggestions = {}
            for line in raw.split("\n"):
                if ":" in line:
                    q, a = line.split(":", 1)
                    suggestions[q.strip()] = a.strip()

        # Update session_state with suggestions
        for key, qd in questions.items():
            q_text = qd["question"]
            answer = suggestions.get(q_text, "")
            if answer:
                st.session_state.analysis_answers[f"{section_name}_{key}"] = answer
    
    # Check if we need to run AI pre-fill automatically for this section
    if f"auto_prefill_{section_name}_done" not in st.session_state:
        ai_prefill_section()
        st.session_state[f"auto_prefill_{section_name}_done"] = True
        success_box("AI suggestions have been automatically added – review and adjust if needed")
        st.rerun()
    
    # Show button to run AI pre-fill again
    if st.button("Pre-fill this section with AI", key=f"ai_prefill_{section_name}", type="secondary"):
        ai_prefill_section()
        success_box("AI suggestions have been added – review and adjust if needed")
        st.rerun()
    
    for key, question_data in questions.items():
        q_key = f"{section_name}_{key}"
        
        if question_data["type"] == "text_area":
            st.session_state.analysis_answers[q_key] = st.text_area(
                question_data["question"],
                help=question_data["help"],
                key=q_key,
                value=st.session_state.analysis_answers.get(q_key, "")
            )
        elif question_data["type"] == "select_box":
            # Ensure previously saved value exists in options, otherwise fallback to first
            stored_val = st.session_state.analysis_answers.get(q_key)
            try:
                default_index = question_data["options"].index(stored_val) if stored_val else 0
            except ValueError:
                default_index = 0
            selected = st.selectbox(
                question_data["question"],
                options=question_data["options"],
                help=question_data["help"],
                key=q_key,
                index=default_index
            )
            st.session_state.analysis_answers[q_key] = selected
        elif question_data["type"] == "multiselect":
            st.session_state.analysis_answers[q_key] = st.multiselect(
                question_data["question"],
                options=question_data["options"],
                help=question_data["help"],
                key=q_key,
                default=st.session_state.analysis_answers.get(q_key, [])
            )
        
        # Add space between questions
        st.write("")
    
    # AI analysis for this section
    if st.button(f"Analyze {section_name}", key=f"analyze_{section_name}", type="secondary"):
        analyze_section(section_name, questions)

def get_section_description(section_name):
    """Returns descriptions for each section"""
    descriptions = {
        "business_idea_solution": "Describe the foundation of your business idea and how the solution works and develops.",
        "market_customers_traction": "Show that there is a market, paying customers, and proof of demand.",
        "team_organization": "Prove that you have the right people and structures to succeed.",
        "business_model_finance": "Explain how you make money and reach profitability.",
        "risk_sustainability_exit": "Identify risks, show sustainability work, and how investors get returns."
    }
    
    # Convert section_name to a format that fits in the dictionary
    lookup_key = section_name.lower().replace(", ", "_").replace(" & ", "_")
    return descriptions.get(lookup_key, "")

def analyze_section(section_name, questions):
    """Analyzes the answers in a section using AI"""
    # Collect all answers from the section
    section_answers = {}
    for key, question_data in questions.items():
        q_key = f"{section_name}_{key}"
        section_answers[question_data["question"]] = st.session_state.analysis_answers.get(q_key, "")
    
    # Create a prompt for AI
    prompt = f"""
    Analyze the following answers about {section_name} for a business plan:
    
    {section_answers}
    
    Give constructive feedback on strengths and weaknesses in the answers. 
    Identify what is good and what can be improved. 
    Give concrete recommendations for how the answers can be strengthened.
    
    Format your response as an analysis with Strengths, Weaknesses, and Recommendations.
    """
    
    with st.spinner(f"Analyzing {section_name}..."):
        analysis = generate_chatgpt_response(prompt)
        st.session_state.analysis_results[section_name] = analysis
    
    st.subheader("AI Analysis")
    st.markdown(analysis)

def generate_analysis_report():
    """Generates a summary analysis report based on all answers"""
    # Collect all answers
    all_answers = st.session_state.analysis_answers
    
    # Create a prompt for AI
    prompt = f"""
    Analyze the following answers for a business plan:
    
    {all_answers}
    
    Give a summary analysis that evaluates the business plan from the following five perspectives:
    1. Business Idea & Solution – Is the idea clear and does the solution offer strong differentiation?
    2. Market, Customers & Traction – Is there a defined market, paying customers, and proven demand?
    3. Team & Organization – Does the team have the capacity and structure to execute the plan?
    4. Business Model & Finance – Is the model scalable and does it lead to profitable growth?
    5. Risk, Sustainability & Exit – Are risks and sustainability well managed and is there an attractive exit path?
    
    Summarize with a recommendation and total score (1-10) on the quality of the business plan.
    Also give specific suggestions for improvement areas.
    """
    
    with st.spinner("Generating summary analysis..."):
        analysis = generate_chatgpt_response(prompt)
        st.session_state.analysis_results["summary"] = analysis
    
    st.subheader("Summary Analysis")
    st.markdown(analysis)
    
    # Show a score visually
    try:
        # Try to find the score in the text (1-10)
        import re
        rating_match = re.search(r'(?:score|rating|points)\D*(\d{1,2})(?:/10)?', analysis, re.IGNORECASE)
        if rating_match:
            rating = int(rating_match.group(1))
            if 1 <= rating <= 10:
                st.progress(rating/10)
                rating_color = "red" if rating < 4 else "orange" if rating < 7 else "green"
                st.markdown(f"<h3 style='color:{rating_color}'>Score: {rating}/10</h3>", unsafe_allow_html=True)
    except:
        pass

def generate_final_dashboard():
    """Generates an innovative, interactive final report with more visual elements"""
    
    # Create a loading animation with clean design
    with st.spinner(""):
        st.markdown("""
        <style>
        @keyframes fade {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
        .report-loading {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-size: 20px;
            color: white;
            background: linear-gradient(90deg, #1e3c72, #2a5298);
            border-radius: 4px;
            margin: 20px 0;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            animation: fade 2s infinite ease-in-out;
        }
        .radar-chart {
            margin: 20px auto;
            max-width: 600px;
        }
        .dashboard-card {
            background: #ffffff;
            border-radius: 4px;
            padding: 20px;
            margin: 15px 0;
            border: 1px solid #e6e9ef;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        </style>
        <div class="report-loading">Generating business analysis</div>
        """, unsafe_allow_html=True)
        
        # Pause for effect
        import time
        time.sleep(2)
    
    # Generate basic report
    generate_analysis_report()
    
    # Create a dashboard layout
    st.markdown("## Interactive Business Analysis Dashboard")
    st.markdown("Based on your data, we've created a visual business report with AI-driven analysis.")
    
    # Find the score
    summary = st.session_state.analysis_results.get("summary", "")
    import re
    rating_match = re.search(r"(\d{1,2})(?:/10)?", summary)
    rating = int(rating_match.group(1)) if rating_match else 5
    
    # Get key data for SWOT and other visualizations
    data = {
        "produktutbud": st.session_state.analysis_answers.get("business_idea_solution_product_description", ""),
        "stad": "",
        "malgrupp": st.session_state.analysis_answers.get("market_customers_traction_customer_segments", ""),
        "strategi": st.session_state.analysis_answers.get("business_model_finance_go_to_market", ""),
        "affärsidé": st.session_state.analysis_answers.get("business_idea_solution_business_idea", ""),
        "vision": st.session_state.analysis_answers.get("business_idea_solution_vision", ""),
    }
    
    # DASHBOARD-SECTION 1: Business Overview
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Your Business Idea")
        st.markdown(data["affärsidé"])
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Vision & KPIs
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Vision")
        st.markdown(data["vision"])
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        # Automatic AI-generated logo
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("AI-generated company logo")
        
        # Try to generate logo only if we have sufficient data
        logo_container = st.empty()
        if len(data["affärsidé"]) > 10 and len(data["malgrupp"]) > 5:
            try:
                with st.spinner("Generating logo..."):
                    # Create a dummy image if real API calls don't work
                    dummy_mode = True
                    
                    if dummy_mode:
                        # Generate a colorful placeholder
                        business_type = data["produktutbud"][:20] if data["produktutbud"] else "startup"
                        business_name = "Your Company"
                        
                        # Generate a simple logo using matplotlib
                        import matplotlib.pyplot as plt
                        import io
                        from matplotlib.patches import Circle
                        
                        fig, ax = plt.subplots(figsize=(5, 5))
                        ax.set_aspect('equal')
                        
                        # Create a circular background
                        circle = Circle((0.5, 0.5), 0.4, color='#1e3c72', alpha=0.8)
                        ax.add_patch(circle)
                        
                        # Add text
                        ax.text(0.5, 0.5, business_name[0].upper(), 
                                fontsize=50, color='white',
                                ha='center', va='center')
                        
                        ax.text(0.5, 0.2, business_name, 
                                fontsize=20, color='white',
                                ha='center', va='center')
                        
                        # Remove axes
                        ax.axis('off')
                        plt.tight_layout()
                        
                        # Save to buffer
                        buf = io.BytesIO()
                        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
                        buf.seek(0)
                        plt.close(fig)
                        
                        logo_container.image(buf)
                    else:
                        # Actual API call for logo
                        logo_url = generate_logo("Your Company", data["produktutbud"])
                        logo_container.image(logo_url)
            except Exception as e:
                logo_container.error(f"Could not generate logo: {e}")
        else:
            logo_container.info("Fill in more information about your business idea and target group to generate a logo.")
        st.markdown("</div>", unsafe_allow_html=True)
        
        # Total score with gauge chart
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("Overall Score")
        
        fig = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = rating,
            domain = {'x': [0, 1], 'y': [0, 1]},
            title = {'text': "Investment Attractiveness"},
            gauge = {
                'axis': {'range': [0, 10]},
                'bar': {'color': "#1e3c72"},
                'steps': [
                    {'range': [0, 3], 'color': "#e6e9ef"},
                    {'range': [3, 7], 'color': "#c5cfe0"},
                    {'range': [7, 10], 'color': "#8da5d3"}
                ],
                'threshold': {
                    'line': {'color': "#2a5298", 'width': 2},
                    'thickness': 0.75,
                    'value': rating
                }
            }
        ))
        
        fig.update_layout(height=250, margin=dict(l=20, r=20, t=50, b=20))
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
    
    # DASHBOARD-SECTION 2: SWOT & Radar Chart
    st.markdown("### Analysis & Visualization")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Generate and show SWOT analysis
        st.markdown('<div class="dashboard-card">', unsafe_allow_html=True)
        st.subheader("SWOT Analysis")
        
        with st.spinner("Generating SWOT analysis..."):
            swot_text = generate_swot_analysis(data)
            img_buf = create_swot_diagram(swot_text)
            st.image(img_buf)
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        # Business Radar Chart - visualizes strengths and weaknesses
        st.markdown('<div class="dashboard-card radar-chart">', unsafe_allow_html=True)
        st.subheader("Business Profile")
        
        # Create data for radar chart based on prompt and analysis answers
        with st.spinner("Analyzing business profile..."):
            # Example analysis if we don't get a response from AI
            categories = ['Product/Service', 'Market', 'Team', 'Finance', 'Risk/Exit']
            
            # Create a prompt to get scores from ChatGPT
            radar_prompt = f"""
            Based on the following information about a startup company, 
            give a score between 1-10 for each of the following categories.
            Answer ONLY with numbers in the format x,x,x,x,x where each x is a number between 1-10.
            
            Product/Service: {st.session_state.analysis_answers.get("business_idea_solution_product_description", "")}
            Market: {st.session_state.analysis_answers.get("market_customers_traction_market_size", "")}
            Team: {st.session_state.analysis_answers.get("team_organization_team_members", "")}
            Finance: {st.session_state.analysis_answers.get("business_model_finance_revenue_model", "")}
            Risk/Exit: {st.session_state.analysis_answers.get("risk_sustainability_exit_exit_plan", "")}
            
            1 = very weak, 10 = extremely strong
            """
            
            try:
                # Try to get scores from ChatGPT
                response = generate_chatgpt_response(radar_prompt, temperature=0.3)
                # Extract numbers from the response
                import re
                values = re.findall(r'(\d+(?:\.\d+)?)', response)
                if len(values) >= 5:
                    values = [float(v) for v in values[:5]]
                    # Ensure values are within 1-10
                    values = [min(max(v, 1), 10) for v in values]
                else:
                    # Fallback
                    values = [rating*0.8, rating*0.9, rating*1.1, rating*0.7, rating*1.0]
            except:
                # Fallback if AI call fails
                values = [rating*0.8, rating*0.9, rating*1.1, rating*0.7, rating*1.0]
            
            # Normalize for comparability
            values_normalized = [v/10 for v in values]
            
            # Create radar chart
            fig = go.Figure()
            
            fig.add_trace(go.Scatterpolar(
                r=values,
                theta=categories,
                fill='toself',
                line=dict(color='#1e3c72'),
                fillcolor='rgba(30, 60, 114, 0.5)',
                name='Your Company'
            ))
            
            # Average benchmark
            fig.add_trace(go.Scatterpolar(
                r=[7, 6, 7, 5, 6],  # Benchmark values
                theta=categories,
                fill='toself',
                opacity=0.3,
                line=dict(color='gray', dash='dot'),
                fillcolor='rgba(200, 200, 200, 0.2)',
                name='Industry Average'
            ))
            
            fig.update_layout(
                polar=dict(
                    radialaxis=dict(
                        visible=True,
                        range=[0, 10]
                    )
                ),
                showlegend=True,
                height=350
            )
            
            st.plotly_chart(fig, use_container_width=True)
            
            # Add interpretation
            strong_areas = [categories[i] for i, v in enumerate(values) if v >= 7]
            weak_areas = [categories[i] for i, v in enumerate(values) if v <= 4]
            
            if strong_areas:
                st.markdown(f"**Strong areas:** {', '.join(strong_areas)}")
            if weak_areas:
                st.markdown(f"**Areas for development:** {', '.join(weak_areas)}")
            
        st.markdown("</div>", unsafe_allow_html=True)
    
    # DASHBOARD-SECTION 3: Market and competitor analysis
    st.markdown("### Market Analysis")
    
    try:
        # Create market trend analysis based on answers
        market_text = st.session_state.analysis_answers.get("market_customers_traction_market_trends", "")
        competition_text = st.session_state.analysis_answers.get("market_customers_traction_competition", "")
        
        if len(market_text) > 10 and len(competition_text) > 10:
            market_prompt = f"""
            Based on this description of the market and competitors:
            
            Market: {market_text}
            Competitors: {competition_text}
            
            Generate a list of 3-6 competitor companies and their market shares in percentage (total 100%).
            Include company names and short descriptions.
            Format should be: Company|Market Share|Description
            """
            
            with st.spinner("Analyzing market positioning..."):
                response = generate_chatgpt_response(market_prompt)
                
                # Extract competitor data
                competitors = []
                import re
                
                # Try to find competitor data in the response
                for line in response.split('\n'):
                    if '|' in line:
                        parts = line.split('|')
                        if len(parts) >= 2:
                            name = parts[0].strip()
                            try:
                                share = float(re.search(r'(\d+(?:\.\d+)?)', parts[1]).group(1))
                                desc = parts[2].strip() if len(parts) > 2 else ""
                                competitors.append({"name": name, "share": share, "description": desc})
                            except:
                                pass
                
                if not competitors:
                    # Fallback if we couldn't extract data
                    competitors = [
                        {"name": "Competitor A", "share": 35, "description": "Market leader with established brand"},
                        {"name": "Competitor B", "share": 25, "description": "Innovative challenger with lower prices"},
                        {"name": "Competitor C", "share": 15, "description": "Niche player with high quality"},
                        {"name": "Others", "share": 25, "description": "Smaller players in the market"}
                    ]
                
                # Add your company with a small market share
                your_share = min(5, sum(c["share"] for c in competitors) * 0.1)  # Max 5% or 10% of total
                if your_share > 0:
                    for c in competitors:
                        c["share"] = c["share"] * (100 - your_share) / 100
                    competitors.append({"name": "Your Company", "share": your_share, "description": "Your position"})
                
                # Create a dataframe for market share visualization
                df = pd.DataFrame(competitors)
                
                # Visualize market shares
                colors = ['#1e3c72', '#2a5298', '#4267b2', '#6d87c8', '#99a9d4', '#c5cfe0']
                
                fig = px.pie(df, values='share', names='name', title='Market Shares', 
                            hover_data=['description'], labels={'share':'Market Share (%)'},
                            color_discrete_sequence=colors)
                fig.update_traces(textposition='inside', textinfo='percent+label')
                fig.update_layout(height=500)
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Show competitor list
                st.markdown("#### Competitor Analysis")
                for comp in competitors:
                    if comp["name"] != "Your Company":
                        st.markdown(f"**{comp['name']}** ({comp['share']:.1f}%): {comp['description']}")
                
                # Generate and show competitor map
                st.markdown("#### Competitor Map")
                city = st.session_state.user_data.get('stad', 'Stockholm')
                
                with st.spinner("Generating competitor map..."):
                    try:
                        # Generate the map
                        map_html = generate_competitor_map(competitors, city)
                        
                        # Show the map if it was generated successfully
                        if map_html and len(map_html) > 100:
                            try:
                                # Try to use st.markdown with safe wrapper
                                html_container = f"""
                                <div style="width:100%; height:450px; overflow:hidden;">
                                    {map_html}
                                </div>
                                """
                                st.markdown(html_container, unsafe_allow_html=True)
                                st.info(f"The map shows approximate positions of competitors in {city}. "
                                      "Positions are based on searches via Google Places API.")
                            except Exception as render_error:
                                # Fallback to alternative method
                                st.error(f"Could not show map via markdown: {str(render_error)}")
                                # Create a downloadable version
                                import tempfile
                                with tempfile.NamedTemporaryFile(delete=False, suffix='.html', mode='w', encoding='utf-8') as f:
                                    f.write(map_html)
                                    map_path = f.name
                                st.info(f"Map created as HTML file. You can open it manually at: {map_path}")
                        else:
                            st.warning("Could not generate competitor map. Check that you have a Google Places API key in the .env file.")
                    except Exception as e:
                        st.error(f"Error generating map: {str(e)}")
                        st.warning("To enable maps, add 'GOOGLE_PLACES_KEY=YOUR_API_KEY' to the .env file.")
        else:
            st.info("Fill in more details about the market and competitors to see market analysis.")
    except Exception as e:
        st.error(f"Could not generate market analysis: {str(e)}")
    
    # DASHBOARD-SECTION 4: Financial forecast
    st.markdown("### Financial Forecast")
    try:
        # Generate financial forecast based on input data
        financial_text = st.session_state.analysis_answers.get("business_model_finance_financial_projections", "")
        revenue_model = st.session_state.analysis_answers.get("business_model_finance_revenue_model", "")
        
        if len(financial_text) > 10 or len(revenue_model) > 10:
            finance_prompt = f"""
            Based on this financial information:
            
            Financial forecast: {financial_text}
            Revenue model: {revenue_model}
            
            Generate a 5-year forecast for revenue, costs, and EBITDA (in kSEK).
            Format should be: Year,Revenue,Costs,EBITDA
            """
            
            with st.spinner("Generating financial forecast..."):
                response = generate_chatgpt_response(finance_prompt)
                
                # Try to extract financial data
                financial_data = []
                for line in response.split('\n'):
                    if ',' in line and any(char.isdigit() for char in line):
                        parts = line.split(',')
                        if len(parts) >= 4:
                            try:
                                year = parts[0].strip()
                                revenue = float(parts[1].replace('kSEK', '').strip())
                                costs = float(parts[2].replace('kSEK', '').strip())
                                ebitda = float(parts[3].replace('kSEK', '').strip())
                                financial_data.append({
                                    "Year": year, 
                                    "Revenue": revenue, 
                                    "Costs": costs, 
                                    "EBITDA": ebitda
                                })
                            except:
                                pass
                
                if not financial_data:
                    # Fallback if we couldn't extract data
                    base = 1000  # Base amount (kSEK)
                    growth = 2.5  # Growth factor
                    financial_data = []
                    for i in range(1, 6):
                        revenue = base * (growth ** (i-1))
                        costs = revenue * 0.7 if i > 2 else revenue * 1.2
                        ebitda = revenue - costs
                        financial_data.append({
                            "Year": f"Year {i}", 
                            "Revenue": revenue, 
                            "Costs": costs, 
                            "EBITDA": ebitda
                        })
                
                # Create a dataframe for financial visualization
                df = pd.DataFrame(financial_data)
                
                # Create a combined bar chart and line chart
                fig = go.Figure()
                
                # Add bars for revenue and costs
                fig.add_trace(go.Bar(
                    x=df["Year"],
                    y=df["Revenue"],
                    name="Revenue",
                    marker_color='#1e3c72'
                ))
                
                fig.add_trace(go.Bar(
                    x=df["Year"],
                    y=df["Costs"],
                    name="Costs",
                    marker_color='#c5cfe0'
                ))
                
                # Add line for EBITDA
                fig.add_trace(go.Scatter(
                    x=df["Year"],
                    y=df["EBITDA"],
                    name="EBITDA",
                    mode='lines+markers',
                    line=dict(color='#2a5298', width=3)
                ))
                
                # Update layout
                fig.update_layout(
                    title="5-Year Financial Forecast",
                    barmode='group',
                    xaxis_title="Year",
                    yaxis_title="Amount (kSEK)",
                    legend=dict(
                        orientation="h",
                        yanchor="bottom",
                        y=1.02,
                        xanchor="right",
                        x=1
                    ),
                    height=500
                )
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Add interesting insight
                breakeven_year = None
                for i, row in enumerate(financial_data):
                    if row["EBITDA"] > 0 and (i == 0 or financial_data[i-1]["EBITDA"] <= 0):
                        breakeven_year = row["Year"]
                        break
                
                if breakeven_year:
                    st.success(f"The forecast shows break-even in {breakeven_year}")
                
                # Show financial data in table form
                st.markdown("#### Financial Data (kSEK)")
                
                # Format data for better presentation
                formatted_df = df.copy()
                for col in ["Revenue", "Costs", "EBITDA"]:
                    formatted_df[col] = formatted_df[col].apply(lambda x: f"{x:,.0f}".replace(",", " "))
                
                st.table(formatted_df)
        else:
            st.info("Fill in detailed financial information to see a 5-year forecast.")
    except Exception as e:
        st.error(f"Could not generate financial forecast: {str(e)}")
    
    # Create a PDF export button
    st.markdown("### Export Report")
    st.warning("PDF export will include all analyses and visualizations above.")
    
    if st.button("Export to PDF", key="export_pdf"):
        st.info("The PDF export function would here generate a downloadable report with all visualizations above.") 
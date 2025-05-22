# frontend/pages/basic_info_page.py

import streamlit as st
from frontend.components.ui_components import progress_bar, info_box
from backend.openai_utils import generate_chatgpt_response

def basic_info_page():
    """Page for user's basic information about the business plan"""
    st.title(f"Basic Information - {st.session_state.user_data.get('name', 'Your')} Business Plan")
    progress_bar(st.session_state.current_stage)
    st.write("First, I need to know some basic information about your business idea.")
    st.markdown('<br>', unsafe_allow_html=True)
    
    # 1) Enter city
    city = st.text_input("Which city do you want to open the store in?", key="city")
    if city and city != st.session_state.user_data.get("city", ""):
        st.session_state.user_data["city"] = city
        # Search for information about the city
        with st.expander("Facts about " + city):
            info_box("Searching for information about " + city + "...")
            city_info = generate_chatgpt_response(f"Give me relevant business information about {city} that could be useful for someone wanting to start a business there. Include population, demographic information, business environment and any unique opportunities.")
            st.write(city_info)
    
    # 2) Enter target audience
    target_audience = st.text_input("What is your primary target audience?", key="target_audience")
    if target_audience:
        st.session_state.user_data["target_audience"] = target_audience
    
    # 3) Enter product offering
    product_offering = st.text_input("What do you want to sell? (Describe as specifically as possible)", key="product_offering")
    if product_offering:
        st.session_state.user_data["product_offering"] = product_offering
    
    # 4) Choose strategy with explanations
    strategi_info = {
        "Premium": "Focuses on high-quality products with higher prices, exclusive feel and excellent customer service.",
        "Budget": "Focuses on low prices, volumes and cost efficiency.",
        "Niche": "Specialization within a specific part of the market, often with unique products.",
        "Hybrid": "Mixes different strategies, for example by offering both premium and budget products."
    }
    
    strategi = st.selectbox(
        "Which business strategy do you want to focus on?", 
        list(strategi_info.keys()),
        index=0,
        key="strategi"
    )
    
    info_box(strategi_info[strategi])
    if strategi:
        st.session_state.user_data["strategi"] = strategi
    
    # 5) Timeline & Budget
    tidsplan = st.text_input("When do you want to start? (e.g. 3 months, 6 months, 1 year)", key="tidsplan")
    if tidsplan:
        st.session_state.user_data["tidsplan"] = tidsplan
    
    budget = st.text_input("What is your starting budget?", key="budget")
    if budget:
        st.session_state.user_data["budget"] = budget
    
    # 6) Previous experience
    erfarenhet = st.text_area("Briefly describe your previous experience in entrepreneurship or the industry:", key="erfarenhet")
    if erfarenhet:
        st.session_state.user_data["erfarenhet"] = erfarenhet
    
    if (city and target_audience and product_offering and strategi and tidsplan and budget):
        if st.button("Fortsätt till fördjupad analys"):
            st.session_state.current_stage = "deep_dive"
            st.rerun()
    st.markdown('<br>', unsafe_allow_html=True) 
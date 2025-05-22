# frontend/utils/session_helpers.py

import streamlit as st
from backend.session_utils import save_progress, load_progress

def reset_session():
    """Resets the session to its original state"""
    st.session_state.user_data = {}
    st.session_state.conversation_history = []
    st.session_state.current_stage = 'intro'
    st.session_state.pdf_path = None
    st.session_state.swot_analysis = None
    st.session_state.swot_image = None
    st.session_state.manifest = None
    st.session_state.logo_url = None

def get_current_stage_name():
    """Converts the technical stage name to a user-friendly name"""
    stage_map = {
        "intro": "Introduction",
        "basic_info": "Basic Information",
        "deep_dive": "In-depth Analysis",
        "financial": "Financial Planning",
        "business_plan": "Business Plan"
    }
    return stage_map.get(st.session_state.current_stage, "Unknown Stage")

def determine_stage_from_data(user_data):
    """Bestämmer lämpligt steg baserat på data som laddats"""
    if 'affarsplan' in user_data:
        return 'business_plan'
    elif user_data.get('konkurrenter') or user_data.get('foretagsnamn'):
        return 'deep_dive'
    elif user_data.get('stad') and user_data.get('produktutbud'):
        return 'basic_info'
    else:
        return 'intro' 
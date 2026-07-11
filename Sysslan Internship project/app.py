import streamlit as st

st.set_page_config(page_title="Train Journey Time Predictor", page_icon="🚆")

st.title("🚆 Train Journey Duration Predictor")
st.markdown("Linear Regression model trained on 10,625+ Indian Railways trains (R² = 0.71)")

st.divider()

col1, col2 = st.columns(2)
with col1:
    distance = st.number_input("Total Distance (km)", min_value=1, max_value=4000, value=500, step=10)
with col2:
    stops = st.number_input("Number of Stops", min_value=1, max_value=120, value=15, step=1)

if st.button("Predict Journey Duration", type="primary"):
    # Model: Duration(min) = 53.18 + 0.4733*Distance + 5.8191*Stops
    intercept = 53.1840
    coef_distance = 0.4733
    coef_stops = 5.8191

    duration_min = intercept + coef_distance * distance + coef_stops * stops
    duration_hrs = duration_min / 60

    hrs = int(duration_hrs)
    mins = int((duration_hrs - hrs) * 60)

    st.success(f"⏱️ Estimated Journey Duration: **{hrs}h {mins}m** ({duration_min:.0f} minutes)")

    st.caption(f"Avg speed for this journey: ~{(distance/duration_hrs):.1f} km/h")

st.divider()
st.caption("Model: Linear Regression | Features: Distance, Stops | MAE: ~117 min | Built by Satya")

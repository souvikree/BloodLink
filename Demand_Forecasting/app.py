import streamlit as st
import numpy as np
from tensorflow.keras.models import load_model

# Load the model
model = load_model('blood_demand')  # Make sure it's in the same directory

st.title("🩸 Donor-Recipient Matching System")

st.markdown("Enter donor and recipient details to check compatibility.")

# Input fields
recipient_bg = st.selectbox("Recipient Blood Group", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
recipient_location = st.selectbox("Recipient Location", ["North", "South", "East", "West"])
urgency = st.slider("Urgency Level (0 - 10)", 0, 10, 5)

donor_bg = st.selectbox("Donor Blood Group", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
donor_location = st.selectbox("Donor Location", ["North", "South", "East", "West"])

# Encoding maps
bg_map = {"A+": 0, "A-": 1, "B+": 2, "B-": 3, "AB+": 4, "AB-": 5, "O+": 6, "O-": 7}
loc_map = {"North": 0, "South": 1, "East": 2, "West": 3}

# Construct input vector
input_vector = np.array([
    bg_map[recipient_bg],
    loc_map[recipient_location],
    urgency,
    bg_map[donor_bg],
    loc_map[donor_location]
]).reshape(1, -1)

# Predict
if st.button("Check Match"):
    try:
        prediction = model.predict(input_vector)[0][0]  # Keras returns [[0.85]]
        if prediction >= 0.5:
            st.success(f"✅ Match found! Confidence: {prediction:.2%}")
        else:
            st.error(f"❌ Not a suitable match. Confidence: {prediction:.2%}")
    except Exception as e:
        st.error(f"Prediction failed: {e}")

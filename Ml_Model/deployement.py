import streamlit as st
import pandas as pd
import joblib
import numpy as np

# Load the trained model
from keras.models import load_model
model = load_model('donor_match.h5')

# Define blood compatibility
def blood_compatible(donor_bt, recipient_bt):
    compatible = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    }
    return int(recipient_bt in compatible.get(donor_bt, []))

# App title
st.title('🩸 Donor Matching System')

st.header('Enter Donor Information')
age_donor = st.number_input('Age (Donor)', min_value=0, max_value=120)
gender_donor = st.selectbox('Gender (Donor)', ['Male', 'Female', 'Other'])
location_donor = st.text_input('Location (Donor)')
blood_type_donor = st.selectbox('Blood Type (Donor)', ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'])
medical_conditions_donor = st.text_input('Medical Conditions (Donor)', value='None')

st.header('Enter Recipient Information')
age_recipient = st.number_input('Age (Recipient)', min_value=0, max_value=120)
gender_recipient = st.selectbox('Gender (Recipient)', ['Male', 'Female', 'Other'])
location_recipient = st.text_input('Location (Recipient)')
blood_type_recipient = st.selectbox('Blood Type (Recipient)', ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'])
medical_conditions_recipient = st.text_input('Medical Conditions (Recipient)', value='None')

if st.button('Check Compatibility'):
    # Create feature row
    age_diff = abs(age_donor - age_recipient)
    gender_match = int(gender_donor == gender_recipient)
    location_match = int(location_donor.strip().lower() == location_recipient.strip().lower())
    blood_match = blood_compatible(blood_type_donor, blood_type_recipient)
    has_conflict = int(medical_conditions_donor.strip().lower() == medical_conditions_recipient.strip().lower())

    input_features = pd.DataFrame([{
        'age_diff': age_diff,
        'gender_match': gender_match,
        'location_match': location_match,
        'blood_match': blood_match,
        'has_conflict': has_conflict
    }])

    # Make prediction
    probability = model.predict(input_features)[0][0]
    prediction = int(probability > 0.5)

    # Display result
if prediction == 1:
    st.success(f'✅ Donor and recipient are COMPATIBLE! (Confidence: {probability:.2f})')
else:
    st.error(f'❌ Donor and recipient are NOT compatible. (Confidence: {1 - probability:.2f})')

# Show feature summary
st.subheader('Feature Summary (scaled values)')
st.write(input_features)
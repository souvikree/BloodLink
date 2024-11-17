import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Parameters for synthetic data generation
start_date = '2021-01-01'
end_date = '2023-12-31'
regions = ['North', 'South', 'East', 'West']
blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
events = ['Holiday', 'Emergency', 'Normal']
np.random.seed(42)  # For reproducibility

# Date range
date_range = pd.date_range(start=start_date, end=end_date, freq='M')

# Generate synthetic data
data = []
for date in date_range:
    for blood_type in blood_types:
        for region in regions:
            # Monthly demand (with seasonality effect)
            base_demand = np.random.randint(100, 500)  # Base monthly demand
            seasonality = 1.2 if date.month in [12, 1, 6, 7] else 1  # Higher demand in summer & winter
            yearly_trend = 1 + (date.year - 2021) * 0.05  # Annual 5% growth
            
            demand = int(base_demand * seasonality * yearly_trend)
            
            # Event influence on demand (e.g., Holidays or emergencies)
            event = random.choices(events, weights=[0.1, 0.05, 0.85])[0]
            if event == 'Holiday':
                demand += np.random.randint(50, 150)
            elif event == 'Emergency':
                demand += np.random.randint(100, 300)

            # Append to dataset
            data.append({
                'Date': date,
                'Blood_Type': blood_type,
                'Region': region,
                'Demand': demand,
                'Event': event
            })

# Create DataFrame
df = pd.DataFrame(data)

# Preview data
print(df.head())

# Save to CSV for further use
df.to_csv('synthetic_blood_demand_data.csv', index=False)
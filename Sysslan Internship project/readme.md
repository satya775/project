
# 🚆 Train Journey Duration Predictor

A machine learning web app that predicts Indian Railways train journey duration based on distance and number of stops. Built as part of a Data Science internship project at Sysslan IT Solutions.

**🔗 Live App:** [satyap.streamlit.app](https://satyap.streamlit.app)

---

## 📌 Overview

This project analyzes 10,000+ Indian Railways trains to understand journey patterns and predicts travel time using a Linear Regression model. The full pipeline covers data cleaning, exploratory analysis, visualization, model building, and deployment as an interactive web app.

## 🎯 Features

- Predicts journey duration (in hours & minutes) from:
  - Total distance (km)
  - Number of stops
- Simple, interactive Streamlit interface
- Real-time predictions with no page reload

## 🧠 Model Details

| Metric | Value |
|---|---|
| Algorithm | Linear Regression |
| Features | Total_Distance_km, Num_Stops |
| Target | Journey_Duration_Min |
| Dataset Size | 10,625 trains |
| R² Score | 0.7058 (70.6% variance explained) |
| MAE | 116.93 min (~1.95 hrs) |
| RMSE | 180.21 min (~3.0 hrs) |

**Model Equation:**
```
Journey_Duration (min) = 53.18 + 0.4733 × Distance_km + 5.8191 × Num_Stops
```

## 📊 Project Pipeline

1. **Data Overview** — Initial exploration of raw Indian Railways dataset
2. **Data Cleaning & Feature Engineering** — Handling missing values, feature creation
3. **Data Exploration** — Statistical analysis of distance, stops, and duration
4. **Visualization & Pattern Analysis** — Correlation heatmaps, distribution charts, station traffic analysis
5. **Model Building** — Linear Regression training, evaluation, and cross-validation
6. **Final Dashboard** — Consolidated insights and prediction results

## 🛠️ Tech Stack

- **Language:** Python
- **Data Processing:** Pandas, NumPy
- **Modeling:** Scikit-learn (Linear Regression)
- **Visualization:** Matplotlib, Seaborn
- **Web App:** Streamlit
- **Deployment:** Streamlit Community Cloud

## 🚀 Run Locally

```bash
# Clone the repository
git clone https://github.com/satya775/project.git
cd "project/Sysslan Internship project"

# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run app.py
```

## 📁 Project Structure

```
Sysslan Internship project/
├── app.py                                          # Streamlit web app
├── requirements.txt                                # Python dependencies
├── Level1_Data_Overview.ipynb                      # Initial data exploration
├── Level2_Data_Cleaning_Feature_Engineering.ipynb  # Data cleaning
├── Level3_Data_Exploration.ipynb                   # Statistical analysis
├── Level4_Visualization_Pattern_Analysis.ipynb     # Visualizations
├── Level5_Prediction_Model.ipynb                   # Model training & evaluation
├── Level6_Final_Project.ipynb                      # Final integrated dashboard
└── train_master_cleaned.csv                        # Cleaned dataset
```

## 📈 Key Insights

- Average journey duration across all trains: **4.6 hours**
- Average distance per train: **280 km**
- Distance and duration show strong positive correlation (**r = 0.80**)
- Number of stops moderately correlates with duration (**r = 0.54**)
- CST-Mumbai is the busiest station with **1,027** unique trains

## 👤 Author

**Satya**
B.Tech, AI & Data Science — Arya College of Engineering & IT (RTU)
Data Science Intern, Sysslan IT Solutions

---

⭐ If you found this project useful, consider giving it a star!

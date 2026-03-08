from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from xgboost import XGBClassifier
import pandas as pd
import requests
import io
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE            = os.path.dirname(os.path.abspath(__file__))
model           = XGBClassifier()
model.load_model(os.path.join(BASE, "cough_risk_model.json"))
FEATURE_COLS    = pd.read_csv(os.path.join(BASE, "feature_columns.csv")).iloc[:, 0].tolist()
THRESHOLD       = 0.35
OPENWEATHER_KEY = os.environ.get("OPENWEATHER_KEY", "")

def get_aqi(lat, lon):
    if not OPENWEATHER_KEY:
        return None
    try:
        resp = requests.get(
            "http://api.openweathermap.org/data/2.5/air_pollution",
            params={"lat": lat, "lon": lon, "appid": OPENWEATHER_KEY},
            timeout=5,
        ).json()
        return resp["list"][0]["main"]["aqi"]
    except Exception:
        return None

def build_recommendation(risk_score, aqi):
    at_risk = risk_score > THRESHOLD
    if risk_score > 0.65:
        message = "Your breathing sounds concerning. We recommend seeking medical care."
    elif risk_score > 0.35:
        message = "Some irregularities detected. Monitor your symptoms closely."
    else:
        message = "No significant abnormality detected in your breathing."
    aqi_labels = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
    aqi_label  = aqi_labels.get(aqi, "Unknown") if aqi else "Unavailable"
    env_note   = ""
    if aqi and aqi >= 4:
        env_note = f"Air quality is {aqi_label}. This may be worsening your symptoms."
        if risk_score > 0.25:
            at_risk = True
            message = "Irregularities detected and air quality is poor. We recommend seeking care."
    elif aqi and aqi == 3:
        env_note = f"Air quality is {aqi_label}. This may be affecting your breathing."
    elif aqi:
        env_note = f"Air quality is {aqi_label}."
    return {
        "at_risk":      at_risk,
        "risk_score":   round(risk_score, 4),
        "disease_risk": "YES" if at_risk else "NO",
        "message":      message,
        "env_note":     env_note,
        "aqi":          aqi,
        "aqi_label":    aqi_label,
    }

@app.post("/predict")
async def predict(
    features_csv: UploadFile = File(...),
    lat: float = Form(default=0.0),
    lon: float = Form(default=0.0),
):
    contents = await features_csv.read()
    features = pd.read_csv(io.StringIO(contents.decode()))
    X_new      = features.reindex(columns=FEATURE_COLS, fill_value=0)
    risk_score = float(model.predict_proba(X_new)[:, 1][0])
    aqi        = get_aqi(lat, lon) if (lat and lon) else None
    return build_recommendation(risk_score, aqi)

@app.get("/health")
def health():
    return {"status": "ok"}
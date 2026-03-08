"""
inference_pipeline.py
---------------------
Called by modelService.js when ML_READY=true.

Usage:
    python3 ml/inference_pipeline.py <input_audio_path>

Stdout (only output): JSON like {"disease_risk": "YES"} or {"disease_risk": "NO"}
On error: {"error": "message"} to stdout, then exit non-zero.
All other output goes to stderr.
"""

import json
import os
import sys

import pandas as pd
import xgboost as xgb

from prepare_new_audio import extract_xgboost_features

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "models", "cough_risk_model.json")
FEATURE_COLUMNS_PATH = os.path.join(SCRIPT_DIR, "models", "feature_columns.csv")

# Load once at module level
FEATURE_COLS = pd.read_csv(FEATURE_COLUMNS_PATH).iloc[:, 0].tolist()
_model = None


def get_model():
    global _model
    if _model is None:
        _model = xgb.XGBClassifier()
        _model.load_model(MODEL_PATH)
    return _model


def predict(features_df):
    """Threshold 0.35: score > 0.35 -> YES, else NO."""
    model = get_model()
    aligned = features_df.reindex(columns=FEATURE_COLS, fill_value=0)
    proba = model.predict_proba(aligned)[0][1]
    return "YES" if proba > 0.35 else "NO"


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)

    input_path = sys.argv[1]

    try:
        print(f"[pipeline] Extracting features from: {input_path}", file=sys.stderr)
        # Redirect stdout so prepare_new_audio's print() don't pollute it; only our JSON goes to stdout
        old_stdout = sys.stdout
        sys.stdout = sys.stderr
        try:
            features = extract_xgboost_features(input_path)
        finally:
            sys.stdout = old_stdout

        print("[pipeline] Running prediction...", file=sys.stderr)
        risk = predict(features)

        # CRITICAL: Only the final JSON goes to stdout
        print(json.dumps({"disease_risk": risk}))
        sys.exit(0)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

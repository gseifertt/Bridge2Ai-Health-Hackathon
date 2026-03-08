"""
inference_pipeline.py
---------------------
Called by audioConversionService.js when ML_READY=true.

Usage:
    python3 ml/inference_pipeline.py <input_audio_path>

Stdout (last line): JSON like {"disease_risk": "YES"} or {"disease_risk": "NO"}
Exit code 0 = success, non-zero = failure.

TODO (ML team): replace the mock predict() below with the real XGBoost model load + inference.
"""

import sys
import json
from prepare_new_audio import extract_xgboost_features


def predict(features_df):
    """
    TODO: Replace this mock with the real model once training is complete.

    Expected swap-in:
        import xgboost as xgb
        model = xgb.XGBClassifier()
        model.load_model("ml/models/respiratory_model.json")
        prob = model.predict_proba(features_df)[0][1]
        return "YES" if prob > 0.5 else "NO"
    """
    import random
    return "YES" if random.random() > 0.5 else "NO"


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)

    input_path = sys.argv[1]

    try:
        print(f"[pipeline] Extracting features from: {input_path}", file=sys.stderr)
        features = extract_xgboost_features(input_path)

        print(f"[pipeline] Running prediction...", file=sys.stderr)
        risk = predict(features)

        # Only print JSON to stdout — Node reads this
        print(json.dumps({"disease_risk": risk}))
        sys.exit(0)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

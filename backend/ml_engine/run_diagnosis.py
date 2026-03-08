"""
Entry point for Node.js: accepts an audio file path, runs MFCC feature extraction,
and outputs a JSON diagnosis to stdout (no other stdout output).
"""
import sys
import json
import random
from io import StringIO

def main():
    if len(sys.argv) < 2:
        out = {"diagnosis": None, "risk_score": None, "error": "Missing file path argument"}
        sys.stdout.write(json.dumps(out) + "\n")
        return

    filepath = sys.argv[1]

    # Suppress stdout during feature extraction (prepare_new_audio uses print())
    old_stdout = sys.stdout
    sys.stdout = StringIO()
    try:
        from prepare_new_audio import extract_xgboost_features
        features_df = extract_xgboost_features(filepath)
    except Exception as e:
        sys.stdout = old_stdout
        out = {"diagnosis": None, "risk_score": None, "error": str(e)}
        sys.stdout.write(json.dumps(out) + "\n")
        return
    finally:
        sys.stdout = old_stdout

    # Dummy prediction until we have a trained XGBoost model
    risk_score = random.randint(0, 100)
    diagnosis = "healthy" if risk_score < 50 else "at_risk"

    out = {"diagnosis": diagnosis, "risk_score": risk_score}
    sys.stdout.write(json.dumps(out) + "\n")

if __name__ == "__main__":
    main()

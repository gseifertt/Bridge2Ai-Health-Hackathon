# extract_features.py
# Called by modelService.js — extracts 240 MFCC features from audio and saves as CSV
# Usage: python3 ml/extract_features.py <input.wav> <output.csv>
# Place in: backend-final/ml/extract_features.py

import sys
from prepare_new_audio import extract_xgboost_features

if len(sys.argv) < 3:
    print("Usage: extract_features.py <input_audio> <output_csv>")
    sys.exit(1)

input_path  = sys.argv[1]
output_path = sys.argv[2]

try:
    df = extract_xgboost_features(input_path)
    df.to_csv(output_path, index=False)
    print(f"[extract_features] Saved {len(df.columns)} features to {output_path}", file=sys.stderr)
    sys.exit(0)
except Exception as e:
    print(f"[extract_features] ERROR: {e}", file=sys.stderr)
    sys.exit(1)

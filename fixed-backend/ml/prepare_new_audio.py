import numpy as np
import pandas as pd
import librosa


def extract_xgboost_features(filepath):
    print(f"1. Loading audio: {filepath}")
    waveform, sample_rate = librosa.load(filepath, sr=16000, mono=True)

    # n_frames = actual number of audio frames — what the model was trained on
    n_frames = len(waveform)

    print("2. Extracting 60 MFCC bands...")
    mfccs = librosa.feature.mfcc(y=waveform, sr=sample_rate, n_mfcc=60)

    print("3. Aggregating (mean, std, min, max)...")
    mfcc_mean = np.mean(mfccs, axis=1)
    mfcc_std  = np.std(mfccs,  axis=1)
    mfcc_min  = np.min(mfccs,  axis=1)
    mfcc_max  = np.max(mfccs,  axis=1)

    # 60 x 4 = 240 MFCC features
    flattened = np.concatenate([mfcc_mean, mfcc_std, mfcc_min, mfcc_max])

    print("4. Building DataFrame...")
    mfcc_cols = [f"mfcc_feat_{i}" for i in range(240)]
    final_df  = pd.DataFrame([flattened], columns=mfcc_cols)

    # Prepend n_frames — model expects this as first column
    final_df.insert(0, "n_frames", n_frames)

    print(f"   → {len(final_df.columns)} total features (n_frames={n_frames})")
    return final_df


if __name__ == "__main__":
    import sys
    test_file = sys.argv[1] if len(sys.argv) > 1 else "test.wav"
    try:
        df = extract_xgboost_features(test_file)
        print(f"\nSUCCESS — {len(df.columns)} features:")
        print(df.head())
    except FileNotFoundError:
        print(f"File not found: {test_file}")

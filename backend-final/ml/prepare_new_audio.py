import numpy as np
import pandas as pd
import librosa

def extract_xgboost_features(filepath):
    print(f"1. Loading and cleaning user audio: {filepath}")
    
    # MAGIC TRICK: librosa.load automatically downmixes to mono (mono=True) 
    # AND forces the sample rate to 16kHz (sr=16000) all in one step!
    waveform, sample_rate = librosa.load(filepath, sr=16000, mono=True)
    
    print("2. Extracting the 60 MFCC frequency bands...")
    mfccs = librosa.feature.mfcc(y=waveform, sr=sample_rate, n_mfcc=60)
    
    print("3. Squashing the time frames (Mean, Std, Min, Max)...")
    mfcc_mean = np.mean(mfccs, axis=1)
    mfcc_std = np.std(mfccs, axis=1)
    mfcc_min = np.min(mfccs, axis=1)
    mfcc_max = np.max(mfccs, axis=1)
    
    # Glue them together sequentially. 60 + 60 + 60 + 60 = 240 features
    flattened_features = np.concatenate([mfcc_mean, mfcc_std, mfcc_min, mfcc_max])
    
    print("4. Formatting for XGBoost...")
    column_names = [f"mfcc_feat_{i}" for i in range(240)]
    final_df = pd.DataFrame([flattened_features], columns=column_names)
    
    return final_df

# ==========================================
# TEST IT OUT
# ==========================================
if __name__ == "__main__":
    test_file = "my_live_cough.wav" 
    try:
        ready_for_ai_df = extract_xgboost_features(test_file)
        print("\nSUCCESS! Here is the data ready to be fed to XGBoost:")
        print(ready_for_ai_df.head())
    except FileNotFoundError:
        print(f"WARNING: Could not find '{test_file}'.")
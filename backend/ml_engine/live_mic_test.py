import sounddevice as sd
from scipy.io.wavfile import write
import time
from prepare_new_audio import extract_xgboost_features

def record_and_extract(task_name, duration=5, sample_rate=16000):
    """
    Records a specific audio task and instantly extracts the XGBoost math.
    """
    print(f"\n=========================================")
    print(f"🎤 GET READY FOR TASK: {task_name.upper()}")
    print(f"=========================================")
    
    print("Recording will start in 3 seconds...")
    time.sleep(1)
    print("3...")
    time.sleep(1)
    print("2...")
    time.sleep(1)
    print("1...")

    print(f"\n🔴 RECORDING NOW! (Please perform your {task_name} for {duration} seconds...)")
    # Record the audio in mono
    my_recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1)
    sd.wait() 
    print("✅ Recording finished!")

    # Save the file dynamically based on the task name
    filename = f"my_live_{task_name}.wav"
    write(filename, sample_rate, my_recording)
    print(f"💾 Audio saved as '{filename}'")

    print(f"🚀 Extracting AI Math for the {task_name}...")
    try:
        # Call the math function you built earlier
        ai_data = extract_xgboost_features(filename)
        print(f"🎉 SUCCESS! Extracted {len(ai_data.columns)} mathematical features.")
        return ai_data
    except Exception as e:
        print(f"❌ Error during math extraction: {e}")
        return None

# ==========================================
# RUNNING THE CLINICAL LOOP
# ==========================================
if __name__ == "__main__":
    # The three tasks we need from the patient
    tasks = ["cough", "vowel", "breath"]
    
    # A dictionary to hold all the math once it is collected
    patient_math = {}
    
    # Loop through the tasks exactly ONCE
    for task in tasks:
        math_df = record_and_extract(task, duration=5)
        
        # If the math worked, store it in the dictionary AND save a CSV
        if math_df is not None:
            patient_math[task] = math_df
            
            # Save the CSV
            csv_name = f"my_live_math_{task}.csv"
            math_df.to_csv(csv_name, index=False)
            print(f"📊 SAVED: {csv_name} is ready for XGBoost!")
            
    print("\n=========================================")
    print("🏥 CLINICAL INTAKE COMPLETE")
    print("=========================================")
    print(f"Successfully collected math for: {list(patient_math.keys())}")
    print("The system is now ready to send this data to the 3 AI Specialists.")
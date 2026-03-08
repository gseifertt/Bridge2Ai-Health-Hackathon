import sys
import librosa
import soundfile as sf

input_path = sys.argv[1]
output_path = sys.argv[2]

print("Loading audio:", input_path)

waveform, sr = librosa.load(input_path, sr=16000, mono=True)

print("Converted to mono 16kHz")

sf.write(output_path, waveform, 16000)

print("Saved processed file:", output_path)
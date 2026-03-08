import sys
import librosa
import soundfile as sf

input_file = sys.argv[1]
output_file = sys.argv[2]

# load audio
waveform, sr = librosa.load(input_file, sr=16000, mono=True)

# save converted audio
sf.write(output_file, waveform, 16000)

print(output_file)
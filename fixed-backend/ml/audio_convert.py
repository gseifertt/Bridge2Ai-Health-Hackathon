import sys
import subprocess

input_file = sys.argv[1]
output_file = sys.argv[2]

cmd = [
    "ffmpeg",
    "-y",
    "-i", input_file,
    "-ac", "1",
    "-ar", "16000",
    output_file
]

subprocess.run(cmd, check=True)

print(output_file)
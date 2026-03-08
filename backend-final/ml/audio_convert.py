"""
Convert input audio to 16 kHz mono WAV for the XGBoost pipeline.
Handles .webm (and other formats) via ffmpeg when librosa cannot open the file.
"""
import os
import subprocess
import sys
import tempfile

# Optional: pydub can decode many formats if available
try:
    from pydub import AudioSegment
    PYDUB_AVAILABLE = True
except ImportError:
    PYDUB_AVAILABLE = False

import librosa
import soundfile as sf


def is_webm(path):
    """Check if the input is .webm or looks like webm/opus."""
    path_lower = path.lower()
    return path_lower.endswith(".webm") or "webm" in path_lower or "opus" in path_lower


def convert_with_ffmpeg(input_path: str, output_path: str) -> bool:
    """
    Use ffmpeg to convert input to 16 kHz mono WAV.
    Returns True on success, False otherwise.
    """
    try:
        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i", input_path,
                "-ar", "16000",
                "-ac", "1",
                "-hide_banner", "-loglevel", "error",
                output_path,
            ],
            check=True,
            capture_output=True,
            timeout=60,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError, subprocess.TimeoutExpired) as e:
        print(f"ffmpeg conversion failed: {e}", file=sys.stderr)
        return False


def main():
    if len(sys.argv) < 3:
        print("Usage: python audio_convert.py <input_file> <output_file>", file=sys.stderr)
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isfile(input_file):
        print(f"Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)

    waveform = None
    sr = 16000

    # If input is .webm (or similar), decode via pydub (if available) or ffmpeg
    if is_webm(input_file):
        webm_ok = False
        if PYDUB_AVAILABLE:
            try:
                seg = AudioSegment.from_file(input_file)
                seg = seg.set_frame_rate(16000).set_channels(1)
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                    temp_wav = f.name
                seg.export(temp_wav, format="wav")
                try:
                    waveform, sr = librosa.load(temp_wav, sr=16000, mono=True)
                    webm_ok = True
                finally:
                    try:
                        os.unlink(temp_wav)
                    except OSError:
                        pass
            except Exception as e:
                print(f"pydub decode failed: {e}, trying ffmpeg...", file=sys.stderr)
        if not webm_ok:
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                temp_wav = f.name
            try:
                if convert_with_ffmpeg(input_file, temp_wav):
                    waveform, sr = librosa.load(temp_wav, sr=16000, mono=True)
                else:
                    print("ffmpeg conversion failed.", file=sys.stderr)
                    sys.exit(1)
            finally:
                try:
                    os.unlink(temp_wav)
                except OSError:
                    pass
    else:
        # Try librosa first (works for wav, mp3, etc. when backends are available)
        try:
            waveform, sr = librosa.load(input_file, sr=16000, mono=True)
        except Exception as e:
            print(f"librosa.load failed: {e}", file=sys.stderr)
            print("Trying ffmpeg fallback...", file=sys.stderr)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                temp_wav = f.name
            try:
                if convert_with_ffmpeg(input_file, temp_wav):
                    waveform, sr = librosa.load(temp_wav, sr=16000, mono=True)
                else:
                    print("ffmpeg fallback failed.", file=sys.stderr)
                    sys.exit(1)
            finally:
                try:
                    os.unlink(temp_wav)
                except OSError:
                    pass

    # Ensure strictly 16 kHz mono and save
    if sr != 16000:
        waveform = librosa.resample(waveform, orig_sr=sr, target_sr=16000)
    if len(waveform.shape) > 1:
        waveform = waveform.mean(axis=1)
    sf.write(output_file, waveform, 16000)
    print(output_file)


if __name__ == "__main__":
    main()

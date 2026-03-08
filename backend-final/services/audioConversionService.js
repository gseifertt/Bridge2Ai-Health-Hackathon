const { spawn } = require("child_process");

/**
 * convertAudio(inputPath) → processedPath
 *
 * ML_READY=true  → runs ml/audio_convert.py (librosa 16kHz mono WAV conversion)
 * ML_READY unset → passthrough, returns raw path (works with mock model today)
 */
function convertAudio(inputPath) {
  if (process.env.ML_READY !== "true") {
    console.log("[audioConversion] ML_READY not set — passthrough, skipping Python conversion.");
    return Promise.resolve(inputPath);
  }

  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.[^/.]+$/, "") + "_processed.wav";
    const py = spawn("python3", ["ml/audio_convert.py", inputPath, outputPath]);
    py.stdout.on("data", (d) => console.log(`[audio_convert] ${d}`));
    py.stderr.on("data", (d) => console.error(`[audio_convert] ${d}`));
    py.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error("audio_convert.py failed — check Python deps (librosa, soundfile)"));
    });
  });
}

module.exports = { convertAudio };

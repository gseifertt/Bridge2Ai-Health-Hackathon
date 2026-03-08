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
    let stderr = "";
    console.log("[audioConversionService] Spawning REAL audio conversion script...");
    const py = spawn("python", ["ml/audio_convert.py", inputPath, outputPath]);
    py.stdout.on("data", (d) => console.log(`[audio_convert] ${d}`));
    py.stderr.on("data", (d) => {
      const msg = d.toString();
      stderr += msg;
      console.error(`[audio_convert] ${msg}`);
    });
    py.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else {
        console.error("[audioConversionService] Conversion failed. Exit code:", code, "stderr:", stderr || "(none)");
        reject(new Error(stderr || `audio_convert.py failed with exit code ${code} — check Python deps (librosa, soundfile)`));
      }
    });
  });
}

module.exports = { convertAudio };

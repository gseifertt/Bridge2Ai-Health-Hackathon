const { spawn } = require("child_process");
const path      = require("path");

const PYTHON = process.env.PYTHON_BIN || "python3";

function convertAudio(inputPath) {
  if (process.env.ML_READY !== "true") {
    console.log("[audioConversion] ML_READY not set — passthrough");
    return Promise.resolve(inputPath);
  }

  return new Promise((resolve, reject) => {
    const outputPath = inputPath.replace(/\.[^/.]+$/, "") + "_processed.wav";
    const scriptPath = path.join(__dirname, "..", "ml", "audio_convert.py");

    const py = spawn(PYTHON, [scriptPath, inputPath, outputPath]);
    py.stdout.on("data", (d) => console.log(`[audio_convert] ${d.toString().trim()}`));
    py.stderr.on("data", (d) => console.error(`[audio_convert] ${d.toString().trim()}`));
    py.on("close", (code) => {
      if (code === 0) resolve(outputPath);
      else reject(new Error("audio_convert.py failed — check librosa/soundfile"));
    });
  });
}

module.exports = { convertAudio };

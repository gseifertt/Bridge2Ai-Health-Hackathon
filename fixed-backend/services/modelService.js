// modelService.js
// Extracts MFCC features via Python, then POSTs CSV to FastAPI for prediction

const { spawn } = require("child_process");
const fs        = require("fs");
const path      = require("path");
const axios     = require("axios");
const FormData  = require("form-data");

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";
const PYTHON      = process.env.PYTHON_BIN  || "python3";

// Step 1: run extract_features.py → saves CSV of 241 features
function extractFeatures(audioPath) {
  return new Promise((resolve, reject) => {
    const csvPath    = audioPath.replace(/\.[^/.]+$/, "") + "_features.csv";
    const scriptPath = path.join(__dirname, "..", "ml", "extract_features.py");

    const py = spawn(PYTHON, [scriptPath, audioPath, csvPath]);
    py.stderr.on("data", (d) => console.error(`[extract_features] ${d.toString().trim()}`));
    py.on("close", (code) => {
      if (code === 0) resolve(csvPath);
      else reject(new Error("Feature extraction failed — check Python/librosa install"));
    });
  });
}

// Step 2: POST CSV to FastAPI → get risk result
async function callFastAPI(csvPath, lat = 0, lon = 0) {
  const form = new FormData();
  form.append("features_csv", fs.createReadStream(csvPath), "features.csv");
  form.append("lat", String(lat));
  form.append("lon", String(lon));

  const response = await axios.post(`${FASTAPI_URL}/predict`, form, {
    headers: form.getHeaders(),
    timeout: 30000,
  });
  return response.data;
}

async function predictDisease(processedAudioPath, lat = 0, lon = 0) {
  if (process.env.ML_READY !== "true") {
    console.log("[modelService] ML_READY not set — returning mock result");
    return {
      disease_risk: "NO",
      message:      "Mock result — set ML_READY=true to use real model",
      risk_score:   0,
      at_risk:      false,
      env_note:     "",
      aqi:          null,
      aqi_label:    "Unavailable",
    };
  }

  console.log(`[modelService] Extracting features from: ${processedAudioPath}`);
  const csvPath = await extractFeatures(processedAudioPath);

  console.log(`[modelService] Calling FastAPI at ${FASTAPI_URL}/predict`);
  const result = await callFastAPI(csvPath, lat, lon);

  // Clean up temp CSV
  fs.unlink(csvPath, () => {});

  return result;
}

module.exports = { predictDisease };

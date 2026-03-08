const { convertAudio }   = require("../services/audioConversionService");
const { predictDisease } = require("../services/modelService");

async function uploadAudio(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const rawPath = req.file.path;
    const lat = parseFloat(req.body.lat) || 0;
    const lon = parseFloat(req.body.lon) || 0;

    // Step 1: convert .webm → 16kHz mono .wav
    const processedPath = await convertAudio(rawPath);

    // Step 2: extract features + run model
    const prediction = await predictDisease(processedPath, lat, lon);

    res.json({
      message:      "Audio processed successfully",
      disease_risk: prediction.disease_risk,
      risk_score:   prediction.risk_score,
      at_risk:      prediction.at_risk,
      result:       prediction.message,
      env_note:     prediction.env_note,
      aqi:          prediction.aqi,
      aqi_label:    prediction.aqi_label,
    });

  } catch (err) {
    console.error("[uploadAudio] Error:", err.message);
    res.status(500).json({ error: "Audio pipeline failed", detail: err.message });
  }
}

module.exports = { uploadAudio };

const { convertAudio } = require("../services/audioConversionService");
const { predictDisease } = require("../services/modelService");

async function uploadAudio(req, res) {

  try {

    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const rawPath = req.file.path;

    const processedPath = await convertAudio(rawPath);

    const prediction = await predictDisease(processedPath);

    res.json({
      message: "Audio uploaded and processed",
      processed_audio: processedPath,
      disease_risk: prediction.disease_risk
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Audio pipeline failed"
    });

  }

}

module.exports = { uploadAudio };
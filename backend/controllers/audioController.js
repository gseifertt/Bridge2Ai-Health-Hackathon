const { runDiagnosis } = require("../services/modelService");

async function uploadAudio(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const filePath = req.file.path;

    let diagnosisResult;
    try {
      diagnosisResult = await runDiagnosis(filePath);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: "Failed to analyze audio",
        details: err.message || err,
      });
    }

    res.json({
      message: "Audio uploaded successfully",
      path: filePath,
      diagnosis: diagnosisResult.diagnosis,
      risk_score: diagnosisResult.risk_score,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Audio upload failed" });
  }
}

module.exports = { uploadAudio };
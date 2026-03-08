const { spawn } = require("child_process");

/**
 * predictDisease(processedAudioPath) → { disease_risk: "YES" | "NO" }
 *
 * ML_READY=true  → runs ml/inference_pipeline.py (real XGBoost model)
 * ML_READY unset → returns random mock result (default / right now)
 *
 * When the ML team is ready:
 *   1. Set ML_READY=true in .env
 *   2. Add the trained model to ml/models/respiratory_model.json
 *   3. Replace the mock predict() inside ml/inference_pipeline.py
 */
async function predictDisease(processedAudioPath) {
  if (process.env.ML_READY !== "true") {
    console.log("[modelService] ML_READY not set — returning mock prediction.");
    const risk = Math.random() > 0.5 ? "YES" : "NO";
    return { disease_risk: risk };
  }

  return new Promise((resolve, reject) => {
    const py = spawn("python3", ["ml/inference_pipeline.py", processedAudioPath]);
    let stdout = "";

    py.stdout.on("data", (d) => (stdout += d.toString()));
    py.stderr.on("data", (d) => console.error(`[inference_pipeline] ${d}`));

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error("inference_pipeline.py failed"));
      }
      try {
        // Last line of stdout is the JSON result
        const lastLine = stdout.trim().split("\n").pop();
        const result = JSON.parse(lastLine);
        if (result.error) return reject(new Error(result.error));
        resolve({ disease_risk: result.disease_risk });
      } catch {
        reject(new Error("Could not parse inference_pipeline.py output"));
      }
    });
  });
}

module.exports = { predictDisease };

const { spawn } = require("child_process");
const path = require("path");

const PYTHON_EXECUTABLE = "/opt/anaconda3/envs/respirate/bin/python";
const SCRIPT_PATH = path.resolve(__dirname, "..", "ml_engine", "run_diagnosis.py");

/**
 * Runs the Python diagnosis script on an audio file and returns the parsed result.
 * @param {string} filePath - Path to the uploaded audio file (relative or absolute)
 * @returns {Promise<{ diagnosis: string, risk_score: number }>}
 */
function runDiagnosis(filePath) {
  return new Promise((resolve, reject) => {
    const absoluteFilePath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);

    const proc = spawn(PYTHON_EXECUTABLE, [SCRIPT_PATH, absoluteFilePath], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `Python script exited with code ${code}`));
        return;
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (err) {
        reject(new Error(stderr || `Failed to parse JSON: ${stdout}`));
      }
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

async function predictAudio(filePath) {
  const risk = Math.random();
  return {
    prediction: risk > 0.5 ? "respiratory_issue" : "normal",
    risk_score: risk,
  };
}

module.exports = { runDiagnosis, predictAudio };

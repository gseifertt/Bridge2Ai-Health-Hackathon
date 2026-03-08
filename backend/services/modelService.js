//fake model service until its developed

async function predictAudio(filePath) {

    // Fake prediction for now
    const risk = Math.random();
  
    return {
      prediction: risk > 0.5 ? "respiratory_issue" : "normal",
      risk_score: risk
    };
  
  }
  
  module.exports = { predictAudio };
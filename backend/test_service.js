const { runDiagnosis } = require('./services/modelService');

// Define the path to the dummy audio file you made earlier
const dummyAudioPath = './ml_engine/test_audio.wav';

console.log(`Testing runDiagnosis with file: ${dummyAudioPath}...`);

runDiagnosis(dummyAudioPath)
    .then(result => {
        console.log("\n✅ SUCCESS! Node successfully talked to Python.");
        console.log("Parsed JSON Result:", result);
    })
    .catch(error => {
        console.error("\n❌ FAILED! Something broke in the bridge.");
        console.error("Error details:", error);
    });
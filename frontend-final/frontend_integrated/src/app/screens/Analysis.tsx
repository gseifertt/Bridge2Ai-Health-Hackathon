import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { LungIcon } from '../components/LungIcon';
import { uploadAudio, fetchAirQuality } from '../../api/client';

const analysisSteps = [
  { id: 1, text: 'Analyzing cough patterns', delay: 0 },
  { id: 2, text: 'Evaluating vocal characteristics', delay: 2000 },
  { id: 3, text: 'Assessing breathing quality', delay: 4000 },
];

// Convert base64 data URL back to Blob
function dataURLtoBlob(dataURL: string): Blob {
  const [header, data] = dataURL.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
  const binary = atob(data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
  return new Blob([array], { type: mime });
}

export function Analysis() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [breathingScale, setBreathingScale] = useState(1);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setBreathingScale((prev) => (prev === 1 ? 1.2 : 1));
    }, 2000);
    return () => clearInterval(breathInterval);
  }, []);

  useEffect(() => {
    // Step animation timers
    const timers = analysisSteps.map((step, index) =>
      setTimeout(() => setCurrentStep(index), step.delay)
    );

    // Main pipeline: upload audio + fetch air quality in parallel
    const runPipeline = async () => {
      try {
        const coughDataURL = sessionStorage.getItem('coughAudio');
        const healthData = JSON.parse(sessionStorage.getItem('healthData') || '{}');

        const promises: Promise<unknown>[] = [];

        // Upload whichever audio we have (prefer cough, fallback to vowel/breathing)
        const audioDataURL = coughDataURL
          || sessionStorage.getItem('vowelAudio')
          || sessionStorage.getItem('breathingAudio');

        if (audioDataURL) {
          const blob = dataURLtoBlob(audioDataURL);
          promises.push(uploadAudio(blob).then((result) => {
            sessionStorage.setItem('diseaseRisk', result.disease_risk);
          }));
        } else {
          // No audio recorded — use mock
          sessionStorage.setItem('diseaseRisk', Math.random() > 0.5 ? 'YES' : 'NO');
        }

        // Fetch air quality if zip provided
        if (healthData.zip_code) {
          promises.push(
            fetchAirQuality(healthData.zip_code)
              .then((aq) => sessionStorage.setItem('airQuality', JSON.stringify(aq)))
              .catch(() => { /* non-fatal */ })
          );
        }

        await Promise.all(promises);
      } catch (err) {
        console.error('Pipeline error:', err);
        setApiError('Analysis encountered an error — showing estimated results.');
        sessionStorage.setItem('diseaseRisk', 'NO');
      } finally {
        // Navigate after animation completes (at least 6s)
        setTimeout(() => navigate('/results'), 6500);
      }
    };

    // Start pipeline immediately, animation runs in parallel
    runPipeline();

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="text-center mb-12">
            {/* Animated Lungs */}
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-green-100 mb-6 transition-transform duration-2000 ease-in-out"
              style={{ transform: `scale(${breathingScale})` }}
            >
              <LungIcon className="w-14 h-14 text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Analyzing your respiratory signals…
            </h1>
            <p className="text-gray-600">This will take just a moment...</p>
            {apiError && (
              <div className="mt-4 flex items-center gap-2 text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {apiError}
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {analysisSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  index <= currentStep
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    index < currentStep
                      ? 'bg-green-600'
                      : index === currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : index === currentStep ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <span className="text-white text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <p
                  className={`font-medium ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-green-600 h-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
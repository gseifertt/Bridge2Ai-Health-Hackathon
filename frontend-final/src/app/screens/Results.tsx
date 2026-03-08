import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { LungIcon } from '../components/LungIcon';

interface AirQuality { aqi: number; pm2_5: number; pm10: number; co: number; }

const AQI_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Good',      color: 'text-green-600' },
  2: { label: 'Fair',      color: 'text-yellow-500' },
  3: { label: 'Moderate',  color: 'text-orange-500' },
  4: { label: 'Poor',      color: 'text-red-500' },
  5: { label: 'Very Poor', color: 'text-red-800' },
};

export function Results() {
  const navigate = useNavigate();

  // Read real result from sessionStorage (set by Analysis screen)
  const diseaseRisk = sessionStorage.getItem('diseaseRisk') || 'NO';
  const airQualityRaw = sessionStorage.getItem('airQuality');
  const airQuality: AirQuality | null = airQualityRaw ? JSON.parse(airQualityRaw) : null;

  const isLowRisk = diseaseRisk === 'NO';
  const aqInfo = airQuality ? (AQI_LABELS[airQuality.aqi] ?? { label: 'Unknown', color: 'text-gray-600' }) : null;

  return (
    <div className={`min-h-screen pb-8 p-6 ${isLowRisk ? 'bg-gradient-to-b from-green-50 to-white' : 'bg-gradient-to-b from-yellow-50 to-white'}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your Results</h1>
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Result Card */}
        <Card className={`p-8 mb-6 border-2 ${isLowRisk ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center">
              {isLowRisk ? (
                <>
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <LungIcon className="w-14 h-14 text-green-600" />
                  </div>
                  <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
                </>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                    <LungIcon className="w-14 h-14 text-yellow-600" />
                  </div>
                  <AlertTriangle className="w-16 h-16 text-yellow-600 mb-4" />
                </>
              )}
            </div>
            <div>
              {isLowRisk ? (
                <>
                  <h2 className="text-2xl font-semibold text-green-800 mb-3">Everything looks fine.</h2>
                  <p className="text-lg text-gray-700">No immediate signs suggesting you need to go to the ER.</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-yellow-800 mb-3">Something doesn't feel quite right.</h2>
                  <p className="text-lg text-gray-700">You may want to consult with a doctor.</p>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* What this means */}
        <Card className="p-6 mb-6 border border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">What this means:</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isLowRisk
              ? 'Your respiratory patterns appear normal based on the voice samples and health information provided. Continue to monitor your symptoms and seek medical attention if they worsen or persist.'
              : 'Our analysis detected some irregularities in your respiratory patterns that may warrant further evaluation. While this is not a diagnosis, we recommend consulting with a healthcare professional for a comprehensive assessment.'}
          </p>
        </Card>

        {/* Air Quality Card — only shown if ZIP was provided and API returned data */}
        {airQuality && aqInfo && (
          <Card className="p-6 mb-6 border border-blue-100 bg-blue-50">
            <h3 className="font-semibold text-gray-900 mb-4">🌬️ Local Air Quality</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">AQI Index</span>
              <span className={`font-semibold ${aqInfo.color}`}>{airQuality.aqi} — {aqInfo.label}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[['PM2.5', airQuality.pm2_5], ['PM10', airQuality.pm10], ['CO', airQuality.co]].map(([label, val]) => (
                <div key={label} className="bg-white rounded-xl p-3 text-center border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className="font-semibold text-gray-900">{Number(val).toFixed(1)}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isLowRisk ? (
            <>
              <Button onClick={() => navigate('/instructions')} className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg">
                Run Another Check
              </Button>
              <Button onClick={() => navigate('/history')} variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg">
                View History
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => alert('This would provide information about next steps and local healthcare resources.')}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg">
                Learn Next Steps
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg">
                Return Home
              </Button>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold">Important:</span> This tool is not a diagnostic device and should not replace professional medical advice. If you have concerns about your respiratory health, please consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}

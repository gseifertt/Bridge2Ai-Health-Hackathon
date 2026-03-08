import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CheckCircle, AlertTriangle, Wind } from 'lucide-react';
import { LungIcon } from '../components/LungIcon';

export function Results() {
  const navigate = useNavigate();

  const diseaseRisk = sessionStorage.getItem('diseaseRisk') || 'NO';
  const isLowRisk = diseaseRisk === 'NO';

  const airQualityRaw = sessionStorage.getItem('airQuality');
  const airQuality = airQualityRaw ? JSON.parse(airQualityRaw) : null;

  const aqiLabels: Record<number, { label: string; color: string }> = {
    1: { label: 'Good', color: 'text-green-700' },
    2: { label: 'Fair', color: 'text-yellow-700' },
    3: { label: 'Moderate', color: 'text-orange-700' },
    4: { label: 'Poor', color: 'text-red-700' },
    5: { label: 'Very Poor', color: 'text-red-900' },
  };

  return (
    <div className={`min-h-screen pb-8 p-6 ${
      isLowRisk 
        ? 'bg-gradient-to-b from-green-50 to-white' 
        : 'bg-gradient-to-b from-yellow-50 to-white'
    }`}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your Results</h1>
          <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Result Card */}
        <Card className={`p-8 mb-6 border-2 ${
          isLowRisk 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="text-center space-y-6">
            {/* Icon and Lung Mascot */}
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

            {/* Message */}
            <div>
              {isLowRisk ? (
                <>
                  <h2 className="text-2xl font-semibold text-green-800 mb-3">
                    Everything looks fine.
                  </h2>
                  <p className="text-lg text-gray-700">
                    No immediate signs suggesting you need to go to the ER.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-yellow-800 mb-3">
                    Something doesn't feel quite right.
                  </h2>
                  <p className="text-lg text-gray-700">
                    You may want to consult with a doctor.
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-6 mb-6 border border-gray-200 bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">What this means:</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {isLowRisk ? (
              <>
                Your respiratory patterns appear normal based on the voice samples and health information provided. 
                Continue to monitor your symptoms and seek medical attention if they worsen or persist.
              </>
            ) : (
              <>
                Our analysis detected some irregularities in your respiratory patterns that may warrant further 
                evaluation. While this is not a diagnosis, we recommend consulting with a healthcare professional 
                for a comprehensive assessment.
              </>
            )}
          </p>
        </Card>

        {/* Air Quality Card - only shown if zip was provided */}
        {airQuality && (
          <Card className="p-6 mb-6 border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Local Air Quality</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">AQI</span>
              <span className={`font-semibold ${aqiLabels[airQuality.aqi]?.color || 'text-gray-700'}`}>
                {airQuality.aqi} — {aqiLabels[airQuality.aqi]?.label || 'Unknown'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">PM2.5</p>
                <p className="text-sm font-semibold text-gray-800">{airQuality.pm2_5}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">PM10</p>
                <p className="text-sm font-semibold text-gray-800">{airQuality.pm10}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">CO</p>
                <p className="text-sm font-semibold text-gray-800">{airQuality.co}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {isLowRisk ? (
            <>
              <Button
                onClick={() => navigate('/instructions')}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
              >
                Run Another Check
              </Button>
              <Button
                onClick={() => navigate('/history')}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg"
              >
                View History
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => alert('This would provide information about next steps and local healthcare resources.')}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
              >
                Learn Next Steps
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg"
              >
                Return Home
              </Button>
            </>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold">Important:</span> This tool is not a diagnostic device and
            should not replace professional medical advice. If you have concerns about your respiratory
            health, please consult a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
}
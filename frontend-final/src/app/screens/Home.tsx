import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { LungIcon } from '../components/LungIcon';
import { BottomNav } from '../components/BottomNav';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Logo and App Name */}
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white shadow-lg">
              <LungIcon className="w-14 h-14" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold text-gray-900">Breathe2AI</h1>
              <p className="text-lg text-blue-600 font-medium">
                A quick respiratory check using your voice.
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <p className="text-gray-600 leading-relaxed mb-6">
              Complete a quick respiratory screening using short voice recordings. Our AI-powered analysis helps identify potential concerns early.
            </p>

            <Button
              onClick={() => navigate('/instructions')}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg shadow-md"
            >
              Start Check
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-sm text-gray-500">
            Not a substitute for professional medical advice
          </p>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Mic, Circle, ChevronLeft } from 'lucide-react';
import { LungIcon } from '../components/LungIcon';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';

export function VowelTest() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(20).fill(0));
  const { isRecording, isComplete, audioBlob, startRecording, stopRecording, reset, error } = useAudioRecorder();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { stopRecording(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, timeLeft, stopRecording]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveformBars(Array(20).fill(0).map(() => Math.random() * 100));
      }, 100);
    } else {
      setWaveformBars(Array(20).fill(0));
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleRecord = async () => {
    setTimeLeft(10);
    await startRecording();
  };

  const handleContinue = () => {
    if (audioBlob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem('vowelAudio', reader.result as string);
        navigate('/test/breathing');
      };
      reader.readAsDataURL(audioBlob);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/test/cough')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Sustained Vowel</h1>
            <span className="text-sm text-gray-600 font-medium">Step 2 of 3</span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-green-600 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-green-600 rounded-full"></div>
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Instruction Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="space-y-6">
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-gray-700 leading-relaxed text-center">
                <span className="font-semibold">Take a breath and say "Ahhh"</span> steadily for 10 seconds.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Recording Interface */}
            <div className="flex flex-col items-center justify-center py-8">
              {/* Lung Mascot */}
              <div className="mb-6">
                <div className={`transition-transform ${isRecording ? 'scale-110' : 'scale-100'}`}>
                  <LungIcon className={`w-20 h-20 ${isRecording ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
                </div>
              </div>

              {/* Timer Circle */}
              <div className="relative mb-6">
                <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-100' : isComplete ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {isRecording ? (
                    <div className="text-center">
                      <Circle className="w-16 h-16 text-red-600 fill-red-600 mb-2" />
                      <span className="text-3xl font-bold text-red-600">{timeLeft}s</span>
                    </div>
                  ) : (
                    <Mic className={`w-16 h-16 ${isComplete ? 'text-green-600' : 'text-gray-400'}`} />
                  )}
                </div>
              </div>
              
              {/* Waveform Visualization */}
              <div className="w-full flex items-center justify-center gap-1 h-20 mb-4">
                {waveformBars.map((height, index) => (
                  <div
                    key={index}
                    className={`w-2 rounded-full transition-all ${
                      isRecording ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              <div className="text-center">
                {isRecording && (
                  <p className="text-lg font-semibold text-gray-900">Recording... Say "Ahhh"</p>
                )}
                {isComplete && (
                  <p className="text-lg font-semibold text-green-600">✓ Recording complete</p>
                )}
                {!isRecording && !isComplete && (
                  <p className="text-lg font-semibold text-gray-500">Ready to record</p>
                )}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              {!isComplete && !isRecording && (
                <Button
                  onClick={handleRecord}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 h-14 rounded-full text-lg"
                >
                  Stop Recording
                </Button>
              )}
              
              {isComplete && (
                <>
                  <Button
                    onClick={handleContinue}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
                  >
                    Continue to Next Step
                  </Button>
                  <Button
                    onClick={() => { reset(); setTimeLeft(10); }}
                    variant="outline"
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg"
                  >
                    Re-record
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

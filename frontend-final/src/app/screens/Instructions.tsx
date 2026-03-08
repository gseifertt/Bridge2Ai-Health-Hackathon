import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ChevronLeft, Wind, Mic, Waves } from 'lucide-react';

export function Instructions() {
  const navigate = useNavigate();

  const tasks = [
    {
      icon: Mic,
      title: 'Cough Test',
      description: 'Please cough once clearly when prompted.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Waves,
      title: 'Sustained Vowel',
      description: "Say 'Ahhh' steadily for about 5 seconds.",
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Wind,
      title: 'Breathing Test',
      description: 'Take a deep breath and slowly exhale for about 5 seconds.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">
            Quick Respiratory Test
          </h1>
          <p className="text-gray-600">
            This test takes <span className="font-semibold">about 15 seconds</span> and includes three short voice tasks.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <span className="ml-2 text-sm text-gray-600">Step 0 of 3</span>
        </div>

        {/* Task Cards */}
        <div className="space-y-4 mb-8">
          {tasks.map((task, index) => {
            const Icon = task.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${task.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Begin Button */}
        <Button
          onClick={() => navigate('/test/cough')}
          className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg shadow-md"
        >
          Begin Test
        </Button>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">💡 Tips:</span> Find a quiet space and hold your phone about 6 inches from your mouth for best results.
          </p>
        </div>
      </div>
    </div>
  );
}

import { Card } from '../components/ui/card';
import { CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function History() {
  // Mock history data
  const historyItems = [
    {
      id: 1,
      date: 'March 8, 2026',
      time: '2:30 PM',
      result: 'low',
      summary: 'No immediate concerns detected',
    },
    {
      id: 2,
      date: 'March 5, 2026',
      time: '10:15 AM',
      result: 'elevated',
      summary: 'Minor irregularities detected',
    },
    {
      id: 3,
      date: 'March 1, 2026',
      time: '4:45 PM',
      result: 'low',
      summary: 'Normal respiratory patterns',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">History</h1>
          <p className="text-gray-600">Your previous respiratory checks</p>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {historyItems.map((item) => (
            <Card
              key={item.id}
              className={`p-6 border-2 cursor-pointer hover:shadow-lg transition-shadow ${
                item.result === 'low'
                  ? 'bg-white border-gray-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    item.result === 'low'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  {item.result === 'low' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.result === 'low' ? 'Low Risk' : 'Elevated Risk'}
                      </h3>
                      <p className="text-sm text-gray-600">{item.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{item.date} at {item.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State (if needed) */}
        {historyItems.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No history yet
            </h3>
            <p className="text-gray-600">
              Your respiratory check history will appear here
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

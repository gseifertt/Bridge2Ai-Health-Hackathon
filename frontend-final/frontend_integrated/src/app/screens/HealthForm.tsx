import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { ChevronLeft } from 'lucide-react';
import { createScreening } from '../../api/client';

export function HealthForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    smoking: false,
    allergies: false,
    respiratoryCondition: false,
    zip_code: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await createScreening({
        age: Number(formData.age),
        sex_at_birth: formData.sex,
        allergies: formData.allergies,
        respiratory_disease: formData.respiratoryCondition,
        zip_code: formData.zip_code,
      });

      // Save everything Analysis needs
      sessionStorage.setItem('screeningId', String(result.screeningId));
      sessionStorage.setItem('healthData', JSON.stringify(formData));

      navigate('/processing');
    } catch (err) {
      console.error(err);
      setError('Failed to save health info. Is the backend running?');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.age && formData.sex;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/test/breathing')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Health Information</h1>
          <p className="text-gray-600">
            Help us provide a more accurate assessment by sharing a few health details.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="h-12 rounded-xl"
                min="1"
                max="120"
                required
              />
            </div>

            {/* Sex at Birth */}
            <div className="space-y-2">
              <Label htmlFor="sex">Sex at Birth *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'male' })}
                  className={`h-12 rounded-xl border-2 transition-colors ${
                    formData.sex === 'male'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: 'female' })}
                  className={`h-12 rounded-xl border-2 transition-colors ${
                    formData.sex === 'female'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* City / ZIP */}
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code (Optional — for air quality)</Label>
              <Input
                id="zip"
                type="text"
                placeholder="e.g. 10001"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={10}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Health History</p>
              
              {/* Nicotine Consumption */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="smoking" className="font-medium">Nicotine Consumption</Label>
                  <p className="text-sm text-gray-500">Do you use tobacco or nicotine products?</p>
                </div>
                <Switch
                  id="smoking"
                  checked={formData.smoking}
                  onCheckedChange={(checked) => setFormData({ ...formData, smoking: checked })}
                />
              </div>

              {/* Existing Health Conditions */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="respiratory" className="font-medium">Existing Health Conditions</Label>
                  <p className="text-sm text-gray-500">Pre-existing respiratory conditions?</p>
                </div>
                <Switch
                  id="respiratory"
                  checked={formData.respiratoryCondition}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, respiratoryCondition: checked })
                  }
                />
              </div>

              {/* Allergies */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <Label htmlFor="allergies" className="font-medium">Allergies</Label>
                  <p className="text-sm text-gray-500">Do you have any allergies?</p>
                </div>
                <Switch
                  id="allergies"
                  checked={formData.allergies}
                  onCheckedChange={(checked) => setFormData({ ...formData, allergies: checked })}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Analyze Results'}
            </Button>
          </form>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Your data is processed securely and never shared with third parties.
        </p>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Card } from '../components/ui/card';
import { User, Save } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    smoking: false,
    allergies: true,
    respiratoryCondition: false,
    city: '',
  });

  const handleSave = () => {
    // In a real app, this would save to a database
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-24">
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-green-500 mx-auto mb-4 flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your health information</p>
        </div>

        {/* Profile Form */}
        <Card className="p-6 mb-6 bg-white">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 rounded-xl"
                disabled={!isEditing}
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="h-12 rounded-xl"
                disabled={!isEditing}
              />
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label>Sex at Birth</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => isEditing && setFormData({ ...formData, sex: 'male' })}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 transition-colors ${
                    formData.sex === 'male'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 text-gray-700'
                  } ${!isEditing && 'opacity-60'}`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => isEditing && setFormData({ ...formData, sex: 'female' })}
                  disabled={!isEditing}
                  className={`h-12 rounded-xl border-2 transition-colors ${
                    formData.sex === 'female'
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                      : 'border-gray-200 text-gray-700'
                  } ${!isEditing && 'opacity-60'}`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="h-12 rounded-xl"
                disabled={!isEditing}
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Health Information</p>
              
              {/* Smoking Status */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="smoking" className="font-medium">Nicotine Consumption</Label>
                  <p className="text-sm text-gray-500">Do you use tobacco or nicotine products?</p>
                </div>
                <Switch
                  id="smoking"
                  checked={formData.smoking}
                  onCheckedChange={(checked) => isEditing && setFormData({ ...formData, smoking: checked })}
                  disabled={!isEditing}
                />
              </div>

              {/* Respiratory Condition */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <Label htmlFor="respiratory" className="font-medium">Respiratory Conditions</Label>
                  <p className="text-sm text-gray-500">Pre-existing respiratory issues?</p>
                </div>
                <Switch
                  id="respiratory"
                  checked={formData.respiratoryCondition}
                  onCheckedChange={(checked) =>
                    isEditing && setFormData({ ...formData, respiratoryCondition: checked })
                  }
                  disabled={!isEditing}
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
                  onCheckedChange={(checked) => isEditing && setFormData({ ...formData, allergies: checked })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white h-14 rounded-full text-lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 h-14 rounded-full text-lg"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

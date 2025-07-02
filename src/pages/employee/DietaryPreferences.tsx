import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Leaf, Apple, Fish, Wheat, Milk, Nut, Save, AlertCircle, CheckCircle, X } from 'lucide-react';
import { dietaryPreferences } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const dietarySchema = z.object({
  allergies: z.array(z.string()),
  preferences: z.array(z.string()),
  restrictions: z.array(z.string()),
  customNotes: z.string().optional(),
});

type DietaryForm = z.infer<typeof dietarySchema>;

const DietaryPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);

  const employeeId = user?.employee?.employeeID;

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<DietaryForm>({
    resolver: zodResolver(dietarySchema),
    defaultValues: {
      allergies: [],
      preferences: [],
      restrictions: [],
      customNotes: '',
    },
  });

  // Fetch existing dietary preferences
  const { data: existingPreferences, isLoading } = useQuery({
    queryKey: ['dietary-preferences', employeeId],
    queryFn: () => dietaryPreferences.getById(employeeId?.toString() || ''),
    enabled: !!employeeId,
    retry: false, // Don't retry if preferences don't exist yet
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingPreferences?.data) {
      const data = existingPreferences.data;
      reset({
        allergies: data.allergies || [],
        preferences: data.preferences || [],
        restrictions: data.restrictions || [],
        customNotes: data.customNotes || '',
      });
    }
  }, [existingPreferences, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: DietaryForm) => {
      if (!employeeId) {
        throw new Error('Employee ID not found');
      }
      
      const payload = {
        employeeId: employeeId,
        allergies: data.allergies,
        preferences: data.preferences,
        restrictions: data.restrictions,
        ...(data.customNotes ? { customNotes: data.customNotes } : {}),
      };
      
      return dietaryPreferences.createOrUpdate(employeeId.toString(), payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dietary-preferences', employeeId] });
      setSaveResult({ success: true, message: 'Dietary preferences saved successfully!' });
    },
    onError: (error: any) => {
      console.error('Failed to save dietary preferences:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save dietary preferences. Please try again.';
      setSaveResult({ success: false, message: errorMessage });
    },
  });

  const closeSaveResult = () => {
    setSaveResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading preferences...</div>
      </div>
    );
  }

  if (!employeeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You need to be logged in as an employee to manage dietary preferences.
          </p>
        </div>
      </div>
    );
  }

  const allergyOptions = [
    { id: 'nuts', label: 'Nuts', icon: Nut },
    { id: 'dairy', label: 'Dairy', icon: Milk },
    { id: 'gluten', label: 'Gluten', icon: Wheat },
    { id: 'shellfish', label: 'Shellfish', icon: Fish },
    { id: 'eggs', label: 'Eggs', icon: Apple },
    { id: 'soy', label: 'Soy', icon: Leaf },
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Apple },
    { id: 'pescatarian', label: 'Pescatarian', icon: Fish },
    { id: 'keto', label: 'Ketogenic', icon: Leaf },
    { id: 'paleo', label: 'Paleo', icon: Apple },
    { id: 'mediterranean', label: 'Mediterranean', icon: Fish },
  ];

  const restrictionOptions = [
    { id: 'gluten-free', label: 'Gluten Free', icon: Wheat },
    { id: 'low-carb', label: 'Low Carb', icon: Apple },
    { id: 'low-sodium', label: 'Low Sodium', icon: Leaf },
    { id: 'sugar-free', label: 'Sugar Free', icon: Apple },
    { id: 'low-fat', label: 'Low Fat', icon: Fish },
    { id: 'halal', label: 'Halal', icon: Leaf },
  ];

  const watchedValues = watch();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dietary Preferences</h1>
            <p className="mt-2 text-gray-600">
              Help our chefs prepare meals that meet your dietary needs and preferences.
            </p>
            {existingPreferences?.data && (
              <div className="mt-2 text-sm text-green-600">
                ✓ You have existing dietary preferences saved. Update them below as needed.
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
            {/* Allergies Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Food Allergies</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select any food allergies you have. This is critical for your safety.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allergyOptions.map(({ id, label, icon: Icon }) => (
                  <label key={id} className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      {...register('allergies')}
                      value={id}
                      className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                    />
                    <div className="ml-3 flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Preferences */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Preferences</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select your preferred eating style or diet type.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {dietaryOptions.map(({ id, label, icon: Icon }) => (
                  <label key={id} className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      {...register('preferences')}
                      value={id}
                      className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                    />
                    <div className="ml-3 flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dietary Restrictions</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select any specific dietary restrictions you follow.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {restrictionOptions.map(({ id, label, icon: Icon }) => (
                  <label key={id} className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      {...register('restrictions')}
                      value={id}
                      className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                    />
                    <div className="ml-3 flex items-center">
                      <Icon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <p className="text-sm text-gray-600 mb-4">
                Provide any additional information about your dietary needs or preferences.
              </p>
              <textarea
                {...register('customNotes')}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Any specific dietary requirements, food preferences, or additional notes for our chefs..."
              />
            </div>

            {/* Summary */}
            {(watchedValues.allergies?.length > 0 || watchedValues.preferences?.length > 0 || watchedValues.restrictions?.length > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Summary of Your Preferences:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  {watchedValues.allergies?.length > 0 && (
                    <div>
                      <strong>Allergies:</strong> {watchedValues.allergies.join(', ')}
                    </div>
                  )}
                  {watchedValues.preferences?.length > 0 && (
                    <div>
                      <strong>Preferences:</strong> {watchedValues.preferences.join(', ')}
                    </div>
                  )}
                  {watchedValues.restrictions?.length > 0 && (
                    <div>
                      <strong>Restrictions:</strong> {watchedValues.restrictions.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Your dietary preferences will be shared with our chefs to ensure your meals meet your requirements. 
                    Please keep this information up to date, especially regarding allergies.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Save Result Modal */}
      {saveResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {saveResult.success ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className={`text-lg font-semibold mb-2 ${
                saveResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {saveResult.success ? 'Preferences Saved!' : 'Save Failed'}
              </h3>
              <p className={`mb-6 ${
                saveResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {saveResult.message}
              </p>
              <button
                onClick={closeSaveResult}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  saveResult.success 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryPreferences;
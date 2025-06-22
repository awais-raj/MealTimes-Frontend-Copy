import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Leaf, Apple, Fish, Wheat, Milk, Nut, Save, AlertCircle } from 'lucide-react';

const dietarySchema = z.object({
  allergies: z.array(z.string()),
  preferences: z.array(z.string()),
  restrictions: z.array(z.string()),
  customNotes: z.string().optional(),
});

type DietaryForm = z.infer<typeof dietarySchema>;

const DietaryPreferences = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DietaryForm>({
    resolver: zodResolver(dietarySchema),
  });

  const { data: currentPreferences, isLoading } = useQuery({
    queryKey: ['dietary-preferences'],
    queryFn: () => ({
      allergies: ['nuts', 'shellfish'],
      preferences: ['vegetarian'],
      restrictions: ['gluten-free'],
      customNotes: 'Prefer low-spice meals',
    }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: DietaryForm) => Promise.resolve(data),
    onSuccess: () => {
      // Handle success
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading preferences...</div>
      </div>
    );
  }

  const allergyOptions = [
    { id: 'nuts', label: 'Nuts', icon: Nut },
    { id: 'dairy', label: 'Dairy', icon: Milk },
    { id: 'gluten', label: 'Gluten', icon: Wheat },
    { id: 'shellfish', label: 'Shellfish', icon: Fish },
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: Leaf },
    { id: 'vegan', label: 'Vegan', icon: Apple },
    { id: 'pescatarian', label: 'Pescatarian', icon: Fish },
    { id: 'keto', label: 'Ketogenic', icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dietary Preferences</h1>

          <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
            {/* Allergies Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h2>
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    {...register('restrictions')}
                    value="gluten-free"
                    className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                  />
                  <div className="ml-3 flex items-center">
                    <Wheat className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Gluten Free</span>
                  </div>
                </label>
                <label className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    {...register('restrictions')}
                    value="low-carb"
                    className="h-4 w-4 text-brand-red border-gray-300 rounded focus:ring-brand-red"
                  />
                  <div className="ml-3 flex items-center">
                    <Apple className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Low Carb</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <textarea
                {...register('customNotes')}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Any specific dietary requirements or preferences..."
              />
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your dietary preferences will be shared with our chefs to ensure your meals meet your requirements.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DietaryPreferences;
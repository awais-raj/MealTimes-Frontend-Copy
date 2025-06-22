import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Clock, DollarSign, Tag, FileImage, Eye, Upload } from 'lucide-react';
import { meals } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const mealSchema = z.object({
  chefID: z.number(),
  mealName: z.string().min(3, 'Meal name must be at least 3 characters'),
  mealDescription: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  mealCategory: z.string().min(1, 'Please select a category'),
  preparationTime: z.number().min(1, 'Preparation time must be at least 1 minute'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  availability: z.boolean().default(true),
});

type MealForm = z.infer<typeof mealSchema>;

const UploadMeal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  // Extract chef ID from the logged-in user
  const getChefId = () => {
  if (user?.homeChef?.chefID) {
    return user.homeChef.chefID; // ✅ This is the correct key
  }
  if (user?.userID) {
    return user.userID;
  }
  return 0;
};

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      chefID: getChefId(),
      availability: true,
      imageUrl: '',
    },
  });

  const imageUrl = watch('imageUrl');

  const mealCategories = [
    'Breakfast',
    'Lunch', 
    'Dinner',
    'Appetizer',
    'Main Course',
    'Dessert',
    'Beverage',
    'Snack',
    'Salad',
    'Soup'
  ];

  const uploadMutation = useMutation({
    mutationFn: async (data: MealForm) => {
      // Ensure we have a valid chef ID
      const chefId = getChefId();
      if (!chefId || chefId === 0) {
        throw new Error('Chef ID not found. Please ensure you are logged in as a chef.');
      }

      // Clean up the data before sending
      const cleanData = {
        ...data,
        chefID: chefId, // Ensure we use the correct chef ID
        imageUrl: data.imageUrl || null, // Send null if empty string
      };
      
      console.log('Sending meal data:', cleanData); // Debug log
      return meals.create(cleanData);
    },
    onSuccess: () => {
      navigate('/chef/meals');
    },
    onError: (error) => {
      console.error('Meal creation failed:', error);
    },
  });

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url);
    setImageError('');
    
    if (url) {
      // Test if the image loads
      const img = new Image();
      img.onload = () => {
        setImagePreview(url);
        setImageError('');
      };
      img.onerror = () => {
        setImagePreview('');
        setImageError('Invalid image URL or image failed to load');
      };
      img.src = url;
    } else {
      setImagePreview('');
    }
  };

  // Show error if no chef ID is available
  if (!getChefId() || getChefId() === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <UtensilsCrossed className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chef Access Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in as a chef to upload meals. Please ensure your account has chef privileges.
          </p>
          <button
            onClick={() => navigate('/chef/dashboard')}
            className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <UtensilsCrossed className="h-8 w-8 text-brand-red mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Upload New Meal</h1>
          </div>

          {/* Debug info - remove in production */}
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Debug Info:</strong> Chef ID: {getChefId()}, User: {user?.email}
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => uploadMutation.mutate(data))} className="space-y-8">
            {/* Hidden Chef ID */}
            <input type="hidden" {...register('chefID', { valueAsNumber: true })} value={getChefId()} />

            {/* Image URL Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                <FileImage className="h-4 w-4 inline mr-2" />
                Meal Image URL
              </label>
              
              <div className="space-y-4">
                <div>
                  <input
                    type="url"
                    {...register('imageUrl')}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                    placeholder="https://example.com/image.jpg (optional)"
                  />
                  {errors.imageUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                  )}
                  {imageError && (
                    <p className="mt-1 text-sm text-red-600">{imageError}</p>
                  )}
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Meal preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </div>
                  </div>
                )}

                {/* Placeholder when no image */}
                {!imagePreview && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Enter an image URL above to see preview</p>
                    <p className="text-sm text-gray-500 mt-2">
                      You can use images from Unsplash, your own hosting, or any public image URL
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Meal Name
                </label>
                <input
                  type="text"
                  {...register('mealName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Enter meal name"
                />
                {errors.mealName && (
                  <p className="mt-1 text-sm text-red-600">{errors.mealName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Category
                </label>
                <select
                  {...register('mealCategory')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                >
                  <option value="">Select category</option>
                  {mealCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.mealCategory && (
                  <p className="mt-1 text-sm text-red-600">{errors.mealCategory.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('mealDescription')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Describe your meal, ingredients, and what makes it special..."
              />
              {errors.mealDescription && (
                <p className="mt-1 text-sm text-red-600">{errors.mealDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="pl-7 block w-full rounded-md border-gray-300 focus:border-brand-red focus:ring-brand-red"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Preparation Time (minutes)
                </label>
                <input
                  type="number"
                  {...register('preparationTime', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="30"
                />
                {errors.preparationTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.preparationTime.message}</p>
                )}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('availability')}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Available for orders
                </span>
              </label>
            </div>

            {/* Error Display */}
            {uploadMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Failed to upload meal. Please try again.
                  {uploadMutation.error instanceof Error && (
                    <span className="block mt-1 font-mono text-xs">
                      {uploadMutation.error.message}
                    </span>
                  )}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/chef/meals')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadMutation.isPending ? 'Uploading...' : 'Upload Meal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMeal;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { UtensilsCrossed, Clock, DollarSign, Tag, FileImage, Eye, Save } from 'lucide-react';
import { meals } from '../../lib/api';

const mealSchema = z.object({
  mealName: z.string().min(3, 'Meal name must be at least 3 characters'),
  mealDescription: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  mealCategory: z.string().min(1, 'Please select a category'),
  preparationTime: z.number().min(1, 'Preparation time must be at least 1 minute'),
  imageUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  availability: z.boolean().default(true),
});

type MealForm = z.infer<typeof mealSchema>;

const EditMeal = () => {
  const navigate = useNavigate();
  const { mealId } = useParams();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');

  const { data: meal, isLoading } = useQuery({
    queryKey: ['meal', mealId],
    queryFn: () => meals.getById(mealId || ''),
    enabled: !!mealId,
  });

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<MealForm>({
    resolver: zodResolver(mealSchema),
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (meal?.data) {
      reset({
        mealName: meal.data.mealName,
        mealDescription: meal.data.mealDescription,
        price: meal.data.price,
        mealCategory: meal.data.mealCategory,
        preparationTime: meal.data.preparationTime,
        imageUrl: meal.data.imageUrl || '',
        availability: meal.data.availability,
      });
      if (meal.data.imageUrl) {
        setImagePreview(meal.data.imageUrl);
      }
    }
  }, [meal, reset]);

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

  const queryClient = useQueryClient();
  
  const updateMutation = useMutation({
    mutationFn: async (data: MealForm) => {
      const cleanData = {
        ...data,
        mealID: Number(mealId), // ✅ Include the mealID in the body
        imageUrl: data.imageUrl || null,
      };
      return meals.update(mealId || '', cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-meals'] });
      navigate('/chef/meals');
    },
    onError: (error) => {
      console.error('Meal update failed:', error);
    },
  });

  const handleImageUrlChange = (url: string) => {
    setValue('imageUrl', url);
    setImageError('');
    
    if (url) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading meal...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <UtensilsCrossed className="h-8 w-8 text-brand-red mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Meal</h1>
          </div>

          <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))} className="space-y-8">
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
            {updateMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Failed to update meal. Please try again.
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
                disabled={updateMutation.isPending}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateMutation.isPending ? 'Updating...' : 'Update Meal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMeal;
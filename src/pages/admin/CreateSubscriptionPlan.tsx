import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Settings, DollarSign, Users, Calendar, Save, ArrowLeft } from 'lucide-react';
import { subscriptionPlans } from '../../lib/api';

const subscriptionPlanSchema = z.object({
  planName: z.string().min(3, 'Plan name must be at least 3 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  mealLimitPerDay: z.number().min(1, 'Meal limit must be at least 1'),
  durationInDays: z.number().min(1, 'Duration must be at least 1 day'),
  isCustomizable: z.boolean().default(false),
  maxEmployees: z.number().min(1, 'Max employees must be at least 1'),
});

type SubscriptionPlanForm = z.infer<typeof subscriptionPlanSchema>;

const CreateSubscriptionPlan = () => {
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SubscriptionPlanForm>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      isCustomizable: false,
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: (data: SubscriptionPlanForm) => subscriptionPlans.create(data),
    onSuccess: () => {
      navigate('/admin/subscription-plans');
    },
    onError: (error) => {
      console.error('Plan creation failed:', error);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/admin/subscription-plans')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <Settings className="h-8 w-8 text-brand-red mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Create Subscription Plan</h1>
          </div>

          <form onSubmit={handleSubmit((data) => createPlanMutation.mutate(data))} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Plan Name
                </label>
                <input
                  type="text"
                  {...register('planName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Enter plan name"
                />
                {errors.planName && (
                  <p className="mt-1 text-sm text-red-600">{errors.planName.message}</p>
                )}
              </div>

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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Users className="h-4 w-4 inline mr-2" />
                  Maximum Employees
                </label>
                <input
                  type="number"
                  {...register('maxEmployees', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="100"
                />
                {errors.maxEmployees && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxEmployees.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Duration (Days)
                </label>
                <input
                  type="number"
                  {...register('durationInDays', { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="30"
                />
                {errors.durationInDays && (
                  <p className="mt-1 text-sm text-red-600">{errors.durationInDays.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Meal Limit Per Day
              </label>
              <input
                type="number"
                {...register('mealLimitPerDay', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="3"
              />
              {errors.mealLimitPerDay && (
                <p className="mt-1 text-sm text-red-600">{errors.mealLimitPerDay.message}</p>
              )}
            </div>

            {/* Customizable Option */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isCustomizable')}
                  className="rounded border-gray-300 text-brand-red focus:ring-brand-red"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Allow customization for this plan
                </span>
              </label>
              <p className="mt-1 text-sm text-gray-500">
                Customizable plans can be modified by companies to fit their specific needs
              </p>
            </div>

            {/* Error Display */}
            {createPlanMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Failed to create subscription plan. Please try again.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/admin/subscription-plans')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPlanMutation.isPending}
                className="flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {createPlanMutation.isPending ? 'Creating...' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSubscriptionPlan;
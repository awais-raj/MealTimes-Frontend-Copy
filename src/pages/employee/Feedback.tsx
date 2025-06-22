import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Star, Send, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const feedbackSchema = z.object({
  rating: z.number().min(1).max(5),
  category: z.enum(['food', 'service', 'app', 'delivery', 'other']),
  feedback: z.string().min(10, 'Feedback must be at least 10 characters'),
  suggestions: z.string().optional(),
  recommend: z.boolean(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

const Feedback = () => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: (data: FeedbackForm) => Promise.resolve(data),
    onSuccess: () => {
      // Handle success
    },
  });

  const rating = watch('rating');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <MessageSquare className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">Share Your Feedback</h1>
            <p className="mt-2 text-gray-600">
              Help us improve our service with your valuable feedback
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => feedbackMutation.mutate(data))} className="space-y-8">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                How would you rate your overall experience?
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('rating', value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        value <= rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What aspect would you like to provide feedback about?
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              >
                <option value="food">Food Quality</option>
                <option value="service">Service</option>
                <option value="app">App Experience</option>
                <option value="delivery">Delivery</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Feedback
              </label>
              <textarea
                {...register('feedback')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Please share your experience..."
              />
              {errors.feedback && (
                <p className="mt-2 text-sm text-red-600">{errors.feedback.message}</p>
              )}
            </div>

            {/* Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suggestions for Improvement
              </label>
              <textarea
                {...register('suggestions')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="How can we improve our service?"
              />
            </div>

            {/* Recommendation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Would you recommend our service to others?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('recommend')}
                    value="true"
                    className="h-4 w-4 text-brand-red border-gray-300 focus:ring-brand-red"
                  />
                  <ThumbsUp className="h-5 w-5 text-gray-400 ml-2 mr-1" />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    {...register('recommend')}
                    value="false"
                    className="h-4 w-4 text-brand-red border-gray-300 focus:ring-brand-red"
                  />
                  <ThumbsDown className="h-5 w-5 text-gray-400 ml-2 mr-1" />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={feedbackMutation.isPending}
                className="flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
              >
                <Send className="h-5 w-5 mr-2" />
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
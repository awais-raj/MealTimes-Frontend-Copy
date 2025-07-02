import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare, ThumbsUp, Star, Send, Users } from 'lucide-react';

const Feedback = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <MessageSquare className="h-16 w-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Feedback & Suggestions</h1>
          <p className="mt-4 text-xl text-gray-600">
            Help us improve our service with your valuable feedback
          </p>
        </div>

        {/* Feedback Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <ThumbsUp className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Service Quality</h3>
            <p className="text-gray-600">
              Rate your experience with our service
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chef Ratings</h3>
            <p className="text-gray-600">
              Share your experience with our chefs
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <MessageSquare className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Suggestions</h3>
            <p className="text-gray-600">
              Provide ideas for improvement
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Share Your Feedback</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rating Section */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Overall Experience
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="cursor-pointer">
                    <input
                      type="radio"
                      {...register('rating')}
                      value={rating}
                      className="sr-only"
                    />
                    <Star className="h-8 w-8 text-gray-300 hover:text-yellow-400 peer-checked:text-yellow-400" />
                  </label>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Feedback Category
              </label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              >
                <option value="service">Service Quality</option>
                <option value="food">Food Quality</option>
                <option value="app">App Experience</option>
                <option value="delivery">Delivery</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Detailed Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Feedback
              </label>
              <textarea
                {...register('feedback')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="Share your thoughts and suggestions..."
              />
            </div>

            {/* Improvement Suggestions */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Suggestions for Improvement
              </label>
              <textarea
                {...register('suggestions')}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                placeholder="What can we do better?"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name (Optional)</label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
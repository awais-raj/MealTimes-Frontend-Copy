import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Apple, Activity, Scale, Heart, Coffee, Salad } from 'lucide-react';
import { nutrition } from '../lib/api';

const Nutrition = () => {
  const { data: nutritionInfo, isLoading } = useQuery({
    queryKey: ['meal-nutrition'],
    queryFn: () => nutrition.getMealNutrition('sample-meal'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading nutrition information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Nutritional Information</h1>
          <p className="mt-4 text-xl text-gray-600">
            Make informed choices about your meals
          </p>
        </div>

        {/* Nutrition Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="h-8 w-8 text-brand-red" />
              <h3 className="ml-3 text-lg font-semibold">Calories</h3>
            </div>
            <p className="text-3xl font-bold">{nutritionInfo?.calories}</p>
            <p className="text-sm text-gray-500 mt-2">kcal per serving</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Scale className="h-8 w-8 text-brand-red" />
              <h3 className="ml-3 text-lg font-semibold">Protein</h3>
            </div>
            <p className="text-3xl font-bold">{nutritionInfo?.protein}g</p>
            <p className="text-sm text-gray-500 mt-2">per serving</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Coffee className="h-8 w-8 text-brand-red" />
              <h3 className="ml-3 text-lg font-semibold">Carbs</h3>
            </div>
            <p className="text-3xl font-bold">{nutritionInfo?.carbs}g</p>
            <p className="text-sm text-gray-500 mt-2">per serving</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-brand-red" />
              <h3 className="ml-3 text-lg font-semibold">Fat</h3>
            </div>
            <p className="text-3xl font-bold">{nutritionInfo?.fat}g</p>
            <p className="text-sm text-gray-500 mt-2">per serving</p>
          </div>
        </div>

        {/* Detailed Nutrition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vitamins */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Vitamins</h3>
            <div className="space-y-4">
              {Object.entries(nutritionInfo?.vitamins || {}).map(([vitamin, value]) => (
                <div key={vitamin} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Apple className="h-5 w-5 text-brand-red mr-2" />
                    <span>Vitamin {vitamin}</span>
                  </div>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minerals */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">Minerals</h3>
            <div className="space-y-4">
              {Object.entries(nutritionInfo?.minerals || {}).map(([mineral, value]) => (
                <div key={mineral} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Salad className="h-5 w-5 text-brand-red mr-2" />
                    <span className="capitalize">{mineral}</span>
                  </div>
                  <span className="font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nutrition Tips */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Healthy Eating Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">Balanced Diet</h4>
              <p className="text-gray-600">
                Include a variety of foods from all food groups to ensure you get all necessary nutrients.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">Portion Control</h4>
              <p className="text-gray-600">
                Pay attention to portion sizes to maintain a healthy calorie intake.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-semibold mb-2">Stay Hydrated</h4>
              <p className="text-gray-600">
                Drink plenty of water throughout the day to maintain good health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
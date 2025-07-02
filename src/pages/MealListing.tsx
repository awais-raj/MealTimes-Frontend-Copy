import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { meals } from '../lib/api';
import { UtensilsCrossed, Leaf, Clock } from 'lucide-react';

const MealListing = () => {
  const { data: mealPackages, isLoading } = useQuery({
    queryKey: ['meals'],
    queryFn: meals.getAll,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading meals...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Meal Packages</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mealPackages?.map((meal: any) => (
          <div key={meal._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <img
                src={`https://source.unsplash.com/800x600/?food,${meal.type}`}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-800">
                  ${meal.price}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{meal.name}</h2>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded">
                  {meal.type}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{meal.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-gray-500">
                  <UtensilsCrossed className="h-4 w-4 mr-1" />
                  <span className="text-sm">{meal.nutritionalInfo.calories} cal</span>
                </div>
                {meal.dietaryOptions?.includes('vegetarian') && (
                  <div className="flex items-center text-green-600">
                    <Leaf className="h-4 w-4 mr-1" />
                    <span className="text-sm">Vegetarian</span>
                  </div>
                )}
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">20-30 min</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  By Chef {meal.chef.name}
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealListing;
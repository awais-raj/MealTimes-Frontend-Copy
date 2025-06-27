import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { meals } from '../lib/api';
import { Search, UtensilsCrossed, Clock, Star, ChefHat, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../contexts/CurrencyContext';

const PublicMeals = () => {
  const { formatPrice } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: mealsResponse, isLoading } = useQuery({
    queryKey: ['public-meals'],
    queryFn: meals.getAll,
  });

  const allMeals = mealsResponse?.data || [];
  
  // Filter and limit to 10 meals
  const filteredMeals = allMeals
    .filter((meal: any) => 
      meal.availability && 
      (meal.mealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
       meal.mealDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
       meal.chefName.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-900">Loading meals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Hero Section */}
      <div className="relative bg-kitchen bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Recently Added Meals
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">
            Discover delicious meals prepared by expert chefs. Login as an employee to see our full menu!
          </p>
          <div className="mt-8 flex space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-red hover:bg-brand-orange transition-colors"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Login to Browse All Meals
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-brand-red transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Register Now
            </Link>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                placeholder="Search meals or chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-4 text-sm text-gray-500">
              Showing {filteredMeals.length} of {allMeals.filter((meal: any) => meal.availability).length} available meals
            </div>
          </div>
        </div>

        {/* Login Prompt */}
        <div className="bg-gradient-to-r from-brand-red to-brand-orange rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2">Want to see all available meals?</h2>
              <p className="text-white/90">Login as an employee to browse our complete menu and place orders!</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="bg-white text-brand-red px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-white hover:text-brand-red transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Meals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMeals.map((meal: any) => (
            <div key={meal.mealID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img
                  src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                  alt={meal.mealName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-brand-red">
                    {formatPrice(meal.price)}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-900">{meal.mealName}</h2>
                  <span className="px-2 py-1 bg-brand-light text-brand-red text-xs font-semibold rounded">
                    {meal.mealCategory}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{meal.mealDescription}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-gray-500">
                    <UtensilsCrossed className="h-4 w-4 mr-1" />
                    <span className="text-sm">Meal ID: {meal.mealID}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{meal.preparationTime} min</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span className="text-sm">{meal.rating || 'New'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <ChefHat className="h-4 w-4 mr-1" />
                    <span>Chef {meal.chefName}</span>
                  </div>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors text-sm font-medium"
                  >
                    Login to Order
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <UtensilsCrossed className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search to see more meals.'
                : 'No meals are currently available.'}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Login to See All Meals
            </Link>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-6">
            Join our platform to access our complete menu and start ordering delicious meals!
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors font-medium"
            >
              Register as Employee
            </Link>
            <Link
              to="/chef-application"
              className="px-6 py-3 border border-brand-red text-brand-red rounded-md hover:bg-brand-red hover:text-white transition-colors font-medium"
            >
              Become a Chef
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicMeals;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Eye, EyeOff, Plus, Search, Filter, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { meals, auth } from '../../lib/api';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../contexts/AuthContext';

const MealManagement = () => {
  const queryClient = useQueryClient();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  const chefId = user?.homeChef?.chefID;

  const { data: chefMealsResponse, isLoading } = useQuery({
    queryKey: ['chef-meals', chefId],
     queryFn: () => meals.getMealsByChefId(chefId.toString()),
    enabled: !!chefId,
});


  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, availability }: { id: string; availability: boolean }) =>
      meals.updateAvailability(Number(id), availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-meals', chefId] });
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: (id: string) => meals.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-meals', chefId] });
    },
  });

  const chefMeals = chefMealsResponse?.data || [];

  const filteredMeals = chefMeals.filter((meal: any) => {
    const matchesSearch = meal.mealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.mealDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.mealCategory === selectedCategory;
    const matchesAvailability = selectedAvailability === 'all' || 
                               (selectedAvailability === 'available' && meal.availability) ||
                               (selectedAvailability === 'unavailable' && !meal.availability);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const categories = [...new Set(chefMeals.map((meal: any) => meal.mealCategory))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading meals...</div>
      </div>
    );
  }

  if (!chefId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chef Access Required</h1>
          <p className="text-gray-600">
            You need to be logged in as a chef to manage meals.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meal Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your uploaded meals and their availability
            </p>
          </div>
          <Link
            to="/chef/upload-meal"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Meal
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                placeholder="Search meals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={String(category)} value={String(category)}>
                  {String(category)}
                </option>
              ))}
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <div className="flex items-center text-sm text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              {filteredMeals.length} meals found
            </div>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal: any) => (
            <div key={meal.mealID} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    meal.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {meal.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 bg-black bg-opacity-50 text-white rounded text-xs">
                    {meal.mealCategory}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{meal.mealName}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{meal.mealDescription}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-semibold text-gray-900">{formatPrice(meal.price)}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{meal.preparationTime} min</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleAvailabilityMutation.mutate({
                        id: meal.mealID.toString(),
                        availability: !meal.availability
                      })}
                      className={`p-2 rounded-md ${
                        meal.availability 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                      title={meal.availability ? 'Make unavailable' : 'Make available'}
                    >
                      {meal.availability ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    
                    <Link
                      to={`/chef/edit-meal/${meal.mealID}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit meal"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this meal?')) {
                          deleteMealMutation.mutate(meal.mealID.toString());
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete meal"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    ID: {meal.mealID}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMeals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedAvailability !== 'all'
                ? 'Try adjusting your filters to see more meals.'
                : 'Get started by uploading your first meal.'}
            </p>
            <Link
              to="/chef/upload-meal"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Your First Meal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealManagement;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meals, orders } from '../lib/api';
import { Search, Filter, UtensilsCrossed, Clock, Star, ChefHat, ShoppingCart, Check, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';

const Meals = () => {
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('available');
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: mealsResponse, isLoading } = useQuery({
    queryKey: ['all-meals'],
    queryFn: meals.getAll,
  });

const employeeId = user?.employee?.employeeID;

const orderMutation = useMutation({
  mutationFn: (orderData: any) => orders.create(orderData),
  onSuccess: (response) => {
    setSelectedMeals([]);
    queryClient.invalidateQueries({ queryKey: ['employee-orders', employeeId] }); // ✅ Fix here
    setOrderResult({ success: true, message: 'Order placed successfully!' });
    setShowOrderModal(true);
  },
  onError: (error: any) => {
    console.error('Order failed:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to place order. Please try again.';
    setOrderResult({ success: false, message: errorMessage });
    setShowOrderModal(true);
  },
});

  const allMeals = mealsResponse?.data || [];

  const filteredMeals = allMeals.filter((meal: any) => {
    const matchesSearch = meal.mealName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.mealDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.chefName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || meal.mealCategory === selectedCategory;
    const matchesAvailability = selectedAvailability === 'all' || 
                               (selectedAvailability === 'available' && meal.availability) ||
                               (selectedAvailability === 'unavailable' && !meal.availability);
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const categories = [...new Set(allMeals.map((meal: any) => meal.mealCategory))];

  const toggleMealSelection = (mealId: number) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const handlePlaceOrder = () => {
    if (selectedMeals.length === 0) return;
    
    if (!user?.employee?.employeeID) {
      setOrderResult({ success: false, message: 'Employee ID not found. Please ensure you are logged in as an employee.' });
      setShowOrderModal(true);
      return;
    }

    const orderData = {
      EmployeeID: user.employee.employeeID,
      Meals: selectedMeals.map(mealId => ({ MealID: mealId }))
    };

    orderMutation.mutate(orderData);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setOrderResult(null);
  };

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
            Explore Our Meals
          </h1>
          <p className="mt-6 max-w-3xl text-xl text-gray-100">
            Discover a wide variety of delicious meals prepared by expert chefs
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
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

        {/* Order Summary */}
        {user?.role === 'Employee' && selectedMeals.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Selected Meals ({selectedMeals.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Ready to place your order?
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedMeals([])}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderMutation.isPending}
                  className="flex items-center px-6 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {orderMutation.isPending ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        )}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    meal.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {meal.availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                {user?.role === 'Employee' && selectedMeals.includes(meal.mealID) && (
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-green-500 text-white rounded-full p-2">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                )}
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
                  {user?.role === 'Employee' ? (
                    <button 
                      onClick={() => toggleMealSelection(meal.mealID)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        meal.availability
                          ? selectedMeals.includes(meal.mealID)
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-brand-red text-white hover:bg-brand-orange'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!meal.availability}
                    >
                      {selectedMeals.includes(meal.mealID) ? 'Selected' : meal.availability ? 'Select' : 'Unavailable'}
                    </button>
                  ) : (
                    <button 
                      className={`px-4 py-2 rounded-md transition-colors ${
                        meal.availability
                          ? 'bg-brand-red text-white hover:bg-brand-orange'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!meal.availability}
                    >
                      {meal.availability ? 'View Details' : 'Unavailable'}
                    </button>
                  )}
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
              {searchTerm || selectedCategory !== 'all' || selectedAvailability !== 'all'
                ? 'Try adjusting your filters to see more meals.'
                : 'No meals are currently available.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Result Modal */}
      {showOrderModal && orderResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {orderResult.success ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className={`text-lg font-semibold mb-2 ${
                orderResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {orderResult.success ? 'Order Successful!' : 'Order Failed'}
              </h3>
              <p className={`mb-6 ${
                orderResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {orderResult.message}
              </p>
              <button
                onClick={closeOrderModal}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  orderResult.success 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {orderResult.success ? 'Continue' : 'Try Again'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meals;
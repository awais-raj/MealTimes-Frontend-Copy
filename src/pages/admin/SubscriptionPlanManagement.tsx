import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Plus, Search, Filter, DollarSign, Users, Calendar, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscriptionPlans } from '../../lib/api';

const SubscriptionPlanManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlans.getAll,
    staleTime: 0,
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: string) => subscriptionPlans.delete(id),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['subscription-plans'], exact: true });
    },
  });

  const plans = plansResponse?.data || [];

  const filteredPlans = plans.filter((plan: any) =>
    plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading subscription plans...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Subscription Plan Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage subscription plans for corporate clients
            </p>
          </div>
          <Link
            to="/admin/subscription-plans/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Filter className="h-4 w-4 mr-2" />
              {filteredPlans.length} plans found
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan: any) => (
            <div key={plan.subscriptionPlanID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.planName}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.isCustomizable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isCustomizable ? 'Customizable' : 'Fixed'}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex items-center text-3xl font-bold text-gray-900 mb-2">
                    <DollarSign className="h-8 w-8 text-brand-red mr-1" />
                    {plan.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500">for {plan.durationInDays} days</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-brand-red" />
                    <span className="text-sm">Up to {plan.maxEmployees} employees</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-brand-red" />
                    <span className="text-sm">{plan.mealLimitPerDay} meal(s) per day</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Settings className="h-4 w-4 mr-2 text-brand-red" />
                    <span className="text-sm">{plan.durationInDays} days duration</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/subscription-plans/edit/${plan.subscriptionPlanID}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit plan"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this subscription plan?')) {
                          deletePlanMutation.mutate(plan.subscriptionPlanID.toString());
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    ID: {plan.subscriptionPlanID}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No subscription plans found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? 'Try adjusting your search to see more plans.'
                : 'Get started by creating your first subscription plan.'}
            </p>
            <Link
              to="/admin/subscription-plans/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlanManagement;
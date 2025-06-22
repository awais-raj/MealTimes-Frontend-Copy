import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { subscriptionPlans, payments } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Check, DollarSign, Users, Calendar, Settings, CreditCard, Shield } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionPlans = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlans.getAll,
  });

  const subscriptionMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create a payment method (in a real app, you'd collect card details)
      const { token } = await stripe.createToken('card', {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123',
      });

      if (!token) throw new Error('Failed to create payment token');

      return payments.subscribeToplan({
        CompanyId: user?.corporateCompany?.companyID,
        SubscriptionPlanId: paymentData.planId,
        StripeToken: token.id,
      });
    },
    onSuccess: () => {
      setShowPaymentModal(false);
      setSelectedPlan(null);
    },
    onError: (error) => {
      console.error('Subscription failed:', error);
    },
  });

  const plans = plansResponse?.data || [];

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    if (!selectedPlan || !user?.corporateCompany?.companyID) return;
    
    subscriptionMutation.mutate({
      planId: selectedPlan.subscriptionPlanID,
    });
  };

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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect meal plan for your company
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan: any) => (
            <div
              key={plan.subscriptionPlanID}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.planName}</h3>
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
                  <div className="flex items-center text-gray-600">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">24/7 Support</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">Real-time tracking</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">Analytics dashboard</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  className="w-full bg-brand-red text-white py-3 px-4 rounded-md hover:bg-brand-orange transition-colors font-medium"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Subscription
              </h3>
              
              <div className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{selectedPlan.planName}</h4>
                  <div className="flex items-center mt-2">
                    <DollarSign className="h-5 w-5 text-brand-red mr-1" />
                    <span className="text-xl font-bold">${selectedPlan.price}</span>
                    <span className="text-gray-500 ml-2">for {selectedPlan.durationInDays} days</span>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Up to {selectedPlan.maxEmployees} employees
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedPlan.mealLimitPerDay} meal(s) per day
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Secure payment with Stripe
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Demo Mode:</strong> This will use test payment credentials. 
                    No actual charges will be made.
                  </p>
                </div>
              </div>

              {subscriptionMutation.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    Subscription failed. Please try again.
                  </p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedPlan(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={subscriptionMutation.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {subscriptionMutation.isPending ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
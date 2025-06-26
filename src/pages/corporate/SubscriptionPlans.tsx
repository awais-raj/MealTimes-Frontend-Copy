import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { subscriptionPlans, payments, companies } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Check, DollarSign, Users, Calendar, Settings, CreditCard, Shield, X, CheckCircle, AlertTriangle } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890');

const PaymentForm = ({ selectedPlan, onSuccess, onCancel, hasActivePlan }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOverride, setConfirmOverride] = useState(false);

  const subscriptionMutation = useMutation({
    mutationFn: async (paymentData: any) => {
      return payments.subscribeToplan(paymentData);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Subscription failed:', error);
      setError('Subscription failed. Please try again.');
      setIsProcessing(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (hasActivePlan && !confirmOverride) {
      setError('Please confirm that you want to override your current subscription.');
      return;
    }
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // For demo purposes, we'll create a token instead
      const { error: tokenError, token } = await stripe.createToken(cardElement);
      
      if (tokenError) {
        setError(tokenError.message || 'Token creation failed');
        setIsProcessing(false);
        return;
      }

      if (!token) {
        setError('Failed to create payment token');
        setIsProcessing(false);
        return;
      }

      // Submit to backend
      subscriptionMutation.mutate({
        CompanyId: user?.corporateCompany?.companyID,
        SubscriptionPlanId: selectedPlan.subscriptionPlanID,
        StripeToken: token.id,
      });

    } catch (err) {
      setError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {hasActivePlan && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Active Subscription Warning
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                You currently have an active subscription plan. Subscribing to this new plan will cancel your current subscription and replace it with the new one.
              </p>
              <div className="mt-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={confirmOverride}
                    onChange={(e) => setConfirmOverride(e.target.checked)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="ml-2 text-sm text-yellow-800">
                    I understand and want to proceed with the new subscription
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-700">
          <strong>Demo Mode:</strong> Use test card number 4242 4242 4242 4242 with any future expiry date and CVC.
        </p>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing || subscriptionMutation.isPending || (hasActivePlan && !confirmOverride)}
          className="flex-1 flex items-center justify-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isProcessing || subscriptionMutation.isPending ? 'Processing...' : `Pay $${selectedPlan?.price}`}
        </button>
      </div>
    </form>
  );
};

const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Subscription Successful!
          </h3>
          <p className="text-gray-600 mb-6">
            Your subscription has been activated successfully. You can now start using the platform.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-brand-red text-white py-2 px-4 rounded-md hover:bg-brand-orange transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlansContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: plansResponse, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionPlans.getAll,
  });

  // Fetch company details to check for active subscription
  const { data: companyResponse } = useQuery({
    queryKey: ['company-details', user?.corporateCompany?.companyID],
    queryFn: () => companies.getById(user?.corporateCompany?.companyID?.toString() || ''),
    enabled: !!user?.corporateCompany?.companyID,
  });

  const plans = plansResponse?.data || [];
  const company = companyResponse?.data;
  const hasActivePlan = company?.activePlanName;

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    setShowSuccessModal(true);
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/corporate/dashboard');
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
          {hasActivePlan && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 max-w-2xl mx-auto">
              <p className="text-blue-800">
                <strong>Current Plan:</strong> {company.activePlanName}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                You can upgrade or change your plan at any time.
              </p>
            </div>
          )}
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
                  {hasActivePlan && company.activePlanName === plan.planName ? 'Current Plan' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Subscribe to {selectedPlan.planName}
                </h3>
                <button
                  onClick={handlePaymentCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
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
              </div>

              <PaymentForm
                selectedPlan={selectedPlan}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                hasActivePlan={hasActivePlan}
              />
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal isOpen={showSuccessModal} onClose={handleSuccessClose} />
      </div>
    </div>
  );
};

const SubscriptionPlans = () => {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionPlansContent />
    </Elements>
  );
};

export default SubscriptionPlans;
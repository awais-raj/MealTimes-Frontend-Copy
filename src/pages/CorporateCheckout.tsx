import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Building2, CreditCard, Shield, Check } from 'lucide-react';
import { mealPlans } from '../lib/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CorporateCheckout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const { data: plan, isLoading } = useQuery({
    queryKey: ['meal-plan', planId],
    queryFn: () => mealPlans.getPlanById(planId || ''),
  });

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const { sessionId } = await mealPlans.createCheckoutSession(plan.priceId);
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-brand-red" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Corporate Plan Checkout</h1>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Plan Details</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <div className="mt-4">
                    <div className="flex items-center text-2xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="ml-2 text-base font-normal text-gray-500">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="ml-3 text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                    <span className="ml-2 text-gray-600">Secure payment with Stripe</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-brand-red text-white py-3 px-4 rounded-md hover:bg-brand-orange transition-colors flex items-center justify-center"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </button>
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    You will be redirected to Stripe's secure checkout page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateCheckout;
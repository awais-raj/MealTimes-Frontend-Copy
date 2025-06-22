import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock, MapPin, CalendarDays, FileText } from 'lucide-react';
import { meals, orders } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const orderSchema = z.object({
  deliveryTime: z.string(),
  deliveryAddress: z.string().min(1, 'Delivery address is required'),
  specialInstructions: z.string(),
});

type OrderForm = z.infer<typeof orderSchema>;

const EmployeeCheckout = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: meal, isLoading } = useQuery({
    queryKey: ['meal', mealId],
    queryFn: () => meals.getById(mealId || ''),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
  });

  const onSubmit = async (data: OrderForm) => {
    try {
      await orders.create({
        mealId,
        ...data,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error placing order:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Order</h1>
          </div>

          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                      <p className="text-gray-600">{meal.description}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Meal Allowance Remaining</span>
                      <span className="font-semibold text-gray-900">${user.mealAllowance}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Order Amount</span>
                      <span className="font-semibold text-gray-900">${meal.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Time
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="datetime-local"
                        {...register('deliveryTime')}
                        className="pl-10 block w-full rounded-md border-gray-300 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                    {errors.deliveryTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryTime.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Delivery Address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        {...register('deliveryAddress')}
                        placeholder="Office address"
                        className="pl-10 block w-full rounded-md border-gray-300 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                    {errors.deliveryAddress && (
                      <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        {...register('specialInstructions')}
                        rows={3}
                        placeholder="Any special instructions for delivery"
                        className="pl-10 block w-full rounded-md border-gray-300 focus:ring-brand-red focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-red text-white py-3 px-4 rounded-md hover:bg-brand-orange transition-colors flex items-center justify-center"
                  >
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Place Order
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCheckout;
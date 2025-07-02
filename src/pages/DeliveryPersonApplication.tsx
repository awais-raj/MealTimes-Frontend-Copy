import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Truck, Mail, Phone, MapPin, User, Car } from 'lucide-react';
import { auth } from '../lib/api';

const deliveryPersonSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  vehicleInfo: z.string().optional(),
});

type DeliveryPersonSignupForm = z.infer<typeof deliveryPersonSignupSchema>;

const DeliveryPersonApplication = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryPersonSignupForm>({
    resolver: zodResolver(deliveryPersonSignupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: (data: DeliveryPersonSignupForm) => auth.registerDeliveryPerson(data),
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Delivery person signup failed:', error);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Join as a Delivery Person</h1>
          <p className="mt-4 text-xl text-gray-600">
            Start earning by delivering meals to corporate clients
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="h-12 w-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Flexible Schedule</h3>
            <p className="text-sm text-gray-600">Work on your own schedule and choose your delivery hours</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="h-12 w-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-6 w-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Steady Income</h3>
            <p className="text-sm text-gray-600">Earn competitive rates with regular delivery opportunities</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="h-12 w-12 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-6 w-6 text-brand-red" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Local Deliveries</h3>
            <p className="text-sm text-gray-600">Deliver within your local area to corporate offices</p>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Create Your Delivery Account</h2>
          <form onSubmit={handleSubmit((data) => signupMutation.mutate(data))} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  placeholder="Enter your phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 inline mr-2" />
                Address (Optional)
              </label>
              <input
                type="text"
                {...register('address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                placeholder="Enter your address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                <Car className="h-4 w-4 inline mr-2" />
                Vehicle Information (Optional)
              </label>
              <input
                type="text"
                {...register('vehicleInfo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                placeholder="e.g., Motorcycle, Car, Bicycle"
              />
              {errors.vehicleInfo && (
                <p className="mt-1 text-sm text-red-600">{errors.vehicleInfo.message}</p>
              )}
            </div>

            {signupMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Signup failed. Please check your information and try again.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-50"
            >
              {signupMutation.isPending ? 'Creating account...' : 'Create Delivery Account'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-brand-red hover:text-brand-orange">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-brand-light rounded-lg p-8">
          <h3 className="text-xl font-bold text-center mb-4">What happens next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-8 w-8 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <p className="text-sm font-medium">Account Creation</p>
              <p className="text-xs text-gray-600">Your account will be created instantly</p>
            </div>
            <div className="text-center">
              <div className="h-8 w-8 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <p className="text-sm font-medium">Profile Setup</p>
              <p className="text-xs text-gray-600">Complete your delivery profile</p>
            </div>
            <div className="text-center">
              <div className="h-8 w-8 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <p className="text-sm font-medium">Start Delivering</p>
              <p className="text-xs text-gray-600">Begin receiving delivery assignments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPersonApplication;
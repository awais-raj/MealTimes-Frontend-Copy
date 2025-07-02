import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { auth, subscriptionPlans, companies } from '../lib/api';
import { Building2, ChefHat, User, MapPin, Phone, Mail, ArrowRight, Truck } from 'lucide-react';

// Simplified schemas without optional subscription fields
const companySchema = z.object({
  role: z.literal('CorporateCompany'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  phoneNumber: z.string().optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

const employeeSchema = z.object({
  role: z.literal('Employee'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  dietaryPreferences: z.string().optional(),
  companyID: z.number().min(1, 'Please select a company'),
});

const registerSchema = z.discriminatedUnion('role', [companySchema, employeeSchema]);

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'CorporateCompany' | 'Employee'>('CorporateCompany');

  // Fetch companies for employees
  const { data: companiesData } = useQuery({
    queryKey: ['companies'],
    queryFn: companies.getAll,
    enabled: selectedRole === 'Employee',
  });

  // Use the discriminated union schema for validation
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: selectedRole,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => {
      if (data.role === 'CorporateCompany') {
        // Send only required fields for company registration
        const companyData = {
          email: data.email,
          password: data.password,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber || null,
          address: data.address,
        };
        return auth.registerCorporate(companyData);
      } else {
        return auth.registerEmployee(data);
      }
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const handleRoleChange = (role: 'CorporateCompany' | 'Employee') => {
    setSelectedRole(role);
    reset({});
    setValue('role', role);
    setTimeout(() => {
      // @ts-ignore: register is typed for both roles, but only one is active
      setValue('role', role);
    }, 0);
  };

  const roles = [
    { id: 'CorporateCompany', label: 'Company', icon: Building2, description: 'Register your company' },
    { id: 'Employee', label: 'Employee', icon: User, description: 'Join as an employee' },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our corporate meal management platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Application Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Chef Application Banner */}
          <div className="bg-gradient-to-r from-brand-red to-brand-orange rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ChefHat className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="font-semibold">Become a Home Chef</h3>
                  <p className="text-sm opacity-90">Join our chef network</p>
                </div>
              </div>
              <Link
                to="/chef-application"
                className="bg-white text-brand-red px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center text-sm"
              >
                Apply
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>

          {/* Delivery Person Application Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-8 w-8 mr-3" />
                <div>
                  <h3 className="font-semibold">Become a Delivery Person</h3>
                  <p className="text-sm opacity-90">Start delivering meals</p>
                </div>
              </div>
              <Link
                to="/delivery-application"
                className="bg-white text-blue-600 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors flex items-center text-sm"
              >
                Apply
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Account Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map(({ id, label, icon: Icon, description }) => (
                <div key={id} className="relative">
                  <input
                    type="radio"
                    id={id}
                    value={id}
                    checked={selectedRole === id}
                    onChange={() => handleRoleChange(id as any)}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor={id}
                    className="flex flex-col items-center justify-center p-4 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-brand-red peer-checked:text-brand-red hover:text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                    <span className="text-xs text-center mt-1">{description}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit((data) => registerMutation.mutate(data))}>
            <input type="hidden" {...register('role')} value={selectedRole} />

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  <p className="mt-1 text-sm text-brand-red">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-brand-red">{errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Role-specific Fields */}
            {selectedRole === 'CorporateCompany' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Building2 className="h-4 w-4 inline mr-2" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      {...register('companyName')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                      placeholder="Enter company name"
                    />
                    {'companyName' in errors && errors.companyName && (
                      <p className="mt-1 text-sm text-brand-red">{errors.companyName.message}</p>
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
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Company Address
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                    placeholder="Enter company address"
                  />
                  {'address' in errors && errors.address && (
                    <p className="mt-1 text-sm text-brand-red">{errors.address.message}</p>
                  )}
                </div>
              </>
            )}

            {selectedRole === 'Employee' && (
              <>
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
                    {selectedRole === 'Employee' && 'fullName' in errors && errors.fullName && (
                      <p className="mt-1 text-sm text-brand-red">{errors.fullName?.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register('phoneNumber')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-brand-red">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    <Building2 className="h-4 w-4 inline mr-2" />
                    Select Your Company
                  </label>
                  <select
                    {...register('companyID', { valueAsNumber: true })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                  >
                    <option value="">Select your company</option>
                    {companiesData?.data?.map((company: any) => (
                      <option key={company.companyID} value={company.companyID}>
                        {company.companyName} - {company.address}
                      </option>
                    ))}
                  </select>
                  {selectedRole === 'Employee' && 'companyID' in errors && errors.companyID && (
                    <p className="mt-1 text-sm text-brand-red">{errors.companyID?.message as string}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dietary Preferences (Optional)
                  </label>
                  <textarea
                    {...register('dietaryPreferences')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red sm:text-sm"
                    placeholder="Any dietary restrictions or preferences..."
                  />
                </div>
              </>
            )}

            {registerMutation.error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">
                  Registration failed. Please check your information and try again.
                </p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors disabled:opacity-50"
              >
                {registerMutation.isPending ? 'Creating account...' : `Create ${roles.find(r => r.id === selectedRole)?.label} Account`}
              </button>
            </div>

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
      </div>
    </div>
  );
};

export default Register;
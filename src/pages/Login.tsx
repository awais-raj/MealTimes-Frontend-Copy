import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data.email, data.password);
      console.log("🧠 Result from login():", result);
    } catch (error) {
      setError('root', {
        message: 'Invalid credentials or server error'
      });
    }
  };

  // ✅ This ensures we redirect once user is set from context
  useEffect(() => {
    console.log("👀 useEffect saw user change:", user);
    if (!user) return;

    const roleRoutes: Record<string, string> = {
      'Admin': '/admin/dashboard',
      'Company': '/corporate/dashboard',
      'Employee': '/employee/dashboard',
      'Chef': '/chef/dashboard',
      'DeliveryPerson': '/delivery/dashboard'
    };

    const route = roleRoutes[user.role];
    if (route) navigate(route);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-brand-red">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-brand-red">{errors.password.message}</p>
                )}
              </div>
            </div>

            {errors.root && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{errors.root.message}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-brand-orange focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
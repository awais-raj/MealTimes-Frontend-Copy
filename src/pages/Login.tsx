import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { passwordReset } from '../lib/api';
import { Mail, X, CheckCircle, AlertTriangle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type LoginForm = z.infer<typeof loginSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordResult, setForgotPasswordResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { 
    register: registerForgot, 
    handleSubmit: handleSubmitForgot, 
    formState: { errors: forgotErrors },
    reset: resetForgotForm
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => passwordReset.forgotPassword(email),
    onSuccess: (response) => {
      setForgotPasswordResult({
        success: response.isSuccess,
        message: response.data?.message || 'Password reset email sent successfully!'
      });
      resetForgotForm();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send password reset email. Please try again.';
      setForgotPasswordResult({
        success: false,
        message: errorMessage
      });
    },
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

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    forgotPasswordMutation.mutate(data.email);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setForgotPasswordResult(null);
    resetForgotForm();
  };

  const closeForgotPasswordResult = () => {
    setForgotPasswordResult(null);
    setShowForgotPassword(false);
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-brand-red hover:text-brand-orange"
                >
                  Forgot your password?
                </button>
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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reset Password</h3>
              <button
                onClick={closeForgotPasswordModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitForgot(onForgotPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...registerForgot('email')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Enter your email address"
                />
                {forgotErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{forgotErrors.email.message}</p>
                )}
              </div>

              <p className="text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeForgotPasswordModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="flex-1 px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Result Modal */}
      {forgotPasswordResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              {forgotPasswordResult.success ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : (
                <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              <h3 className={`text-lg font-semibold mb-2 ${
                forgotPasswordResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {forgotPasswordResult.success ? 'Email Sent!' : 'Error'}
              </h3>
              <p className={`mb-6 ${
                forgotPasswordResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {forgotPasswordResult.message}
              </p>
              <button
                onClick={closeForgotPasswordResult}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  forgotPasswordResult.success 
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
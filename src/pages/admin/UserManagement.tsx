import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { admin } from '../../lib/api';
import { UserPlus, X, Save, Shield, Mail, Phone } from 'lucide-react';

const adminSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
});

type AdminForm = z.infer<typeof adminSchema>;

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
  });

  const { data: response, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: admin.getUsers,
  });

  const addAdminMutation = useMutation({
    mutationFn: async (data: AdminForm) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://localhost:7000'}/api/User/register/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create admin');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowAddAdminModal(false);
      reset();
    },
    onError: (error) => {
      console.error('Admin creation failed:', error);
    },
  });

  const users = response?.data || [];

  const getUserName = (user: any) => {
    switch (user.role) {
      case 'Admin':
        return user.admin?.email ?? user.email;
      case 'Company':
        return user.corporateCompany?.companyName ?? user.email;
      case 'Chef':
        return user.homeChef?.fullName ?? user.email;
      case 'Employee':
        return user.employee?.fullName ?? user.email;
      case 'DeliveryPerson':
        return user.deliveryPerson?.fullName ?? user.email;
      default:
        return user.email;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin':
        return <Shield className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Company':
        return 'bg-blue-100 text-blue-800';
      case 'Chef':
        return 'bg-purple-100 text-purple-800';
      case 'Employee':
        return 'bg-green-100 text-green-800';
      case 'DeliveryPerson':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl font-semibold">Loading users...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage system users and administrators
            </p>
          </div>
          <button 
            onClick={() => setShowAddAdminModal(true)}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            New Admin
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  User ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user.userID} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {getUserName(user)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.role === 'Company' && user.corporateCompany?.address}
                          {user.role === 'Employee' && user.employee?.phoneNumber}
                          {user.role === 'Chef' && user.homeChef?.phoneNumber}
                          {user.role === 'DeliveryPerson' && user.deliveryPerson?.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 break-all">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${getRoleColor(user.role)}`}>
                      {user.role === 'DeliveryPerson' ? 'Delivery Person' : user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    #{user.userID}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Admin', 'Company', 'Employee', 'Chef', 'DeliveryPerson'].map((role) => {
            const count = users.filter((user: any) => user.role === role).length;
            return (
              <div key={role} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  {getRoleIcon(role)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">
                      {role === 'DeliveryPerson' ? 'Delivery' : role}s
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Admin</h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit((data) => addAdminMutation.mutate(data))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  {...register('phoneNumber')}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter phone number"
                />
              </div>

              {addAdminMutation.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    Failed to create admin. Please try again.
                  </p>
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addAdminMutation.isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {addAdminMutation.isPending ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
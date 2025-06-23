import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orders, employees } from '../../lib/api';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Utensils, 
  Calendar, 
  TrendingUp,
  User,
  Mail,
  Phone,
  Building2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    employeeID: 0,
    fullName: '',
    email: ''
  });

  const employeeId = user?.employee?.employeeID;

  // Fetch employee details
  const { data: employeeResponse, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee-details', employeeId],
    queryFn: () => employees.getById(employeeId?.toString() || ''),
    enabled: !!employeeId,
  });

  const { data: myOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orders.getMyOrders,
  });

  const employee = employeeResponse?.data;

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: (data: any) => employees.update(employeeId?.toString() || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-details', employeeId] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Employee update failed:', error);
    },
  });

  const handleEdit = () => {
    if (employee) {
      setEditForm({
        employeeID: employee.employeeID,
        fullName: employee.fullName,
        email: employee.email
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateEmployeeMutation.mutate(editForm);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      employeeID: 0,
      fullName: '',
      email: ''
    });
  };

  if (employeeLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todaysOrders = myOrders?.filter((order: any) => {
    const orderDate = new Date(order.orderDate).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  }) || [];

  const totalOrders = myOrders?.length || 0;
  const pendingOrders = myOrders?.filter((order: any) => order.deliveryStatus.toLowerCase() === 'pending').length || 0;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {employee?.fullName}
        </p>
      </div>

      {/* Employee Profile */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-brand-light flex items-center justify-center">
              <User className="h-6 w-6 text-brand-red" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              <p className="text-gray-600">Employee ID: #{employee?.employeeID}</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={updateEmployeeMutation.isPending}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateEmployeeMutation.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              />
            ) : (
              <p className="text-gray-900 font-medium">{employee?.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-2" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
              />
            ) : (
              <p className="text-gray-900 font-medium">{employee?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Phone Number
            </label>
            <p className="text-gray-900 font-medium">{employee?.phoneNumber}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="h-4 w-4 inline mr-2" />
              Company
            </label>
            <p className="text-gray-900 font-medium">{employee?.companyName || 'Company Name'}</p>
          </div>
        </div>

        {employee?.dietaryPreferences && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Preferences
            </label>
            <p className="text-gray-900 font-medium">{employee.dietaryPreferences}</p>
          </div>
        )}

        {updateEmployeeMutation.error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">
              Failed to update profile. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-brand-red" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-lg font-semibold text-gray-900">{totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="text-lg font-semibold text-gray-900">{pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Orders</dt>
                  <dd className="text-lg font-semibold text-gray-900">{todaysOrders.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Utensils className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Browse Meals</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    <Link to="/employee/meals" className="text-brand-red hover:text-brand-orange">
                      View All
                    </Link>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/employee/meals"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Utensils className="h-8 w-8 text-brand-red mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Browse Meals</h3>
              <p className="text-sm text-gray-500">Explore available meals</p>
            </div>
          </Link>
          <Link
            to="/employee/preferences"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-8 w-8 text-brand-red mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Preferences</h3>
              <p className="text-sm text-gray-500">Update dietary preferences</p>
            </div>
          </Link>
          <Link
            to="/employee/feedback"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <CheckCircle className="h-8 w-8 text-brand-red mr-4" />
            <div>
              <h3 className="font-medium text-gray-900">Feedback</h3>
              <p className="text-sm text-gray-500">Share your experience</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Orders
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your latest meal orders and their status
          </p>
        </div>
        <div className="border-t border-gray-200">
          {myOrders && myOrders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {myOrders.slice(0, 5).map((order: any) => (
                <li key={order.orderID} className="px-4 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(order.deliveryStatus)}
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.orderID}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.meals?.length || 0} meal(s) ordered
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                        Payment: {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by browsing our available meals.
              </p>
              <div className="mt-6">
                <Link
                  to="/employee/meals"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-red hover:bg-brand-orange"
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Browse Meals
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChefHat, Clock, DollarSign, Users, Package, CheckCircle, Eye, EyeOff, Filter } from 'lucide-react';
import { orders, meals } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';

const ChefDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');

  const chefId = user?.homeChef?.chefID;

  // Fetch chef orders
  const { data: chefOrdersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['chef-orders', chefId],
    queryFn: () => orders.getOrdersByChef(chefId?.toString() || ''),
    enabled: !!chefId,
  });

  // Fetch chef meals for availability toggle
  const { data: chefMealsResponse, isLoading: mealsLoading } = useQuery({
    queryKey: ['chef-meals', chefId],
    queryFn: () => meals.getMealsByChefId(chefId?.toString() || ''),
    enabled: !!chefId,
  });

  const chefOrders = chefOrdersResponse || [];
  const chefMeals = chefMealsResponse?.data || [];

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: (data: { orderId: number; newStatus: string; chefId: number }) =>
      orders.updateOrderStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-orders', chefId] });
    },
    onError: (error) => {
      console.error('Order status update failed:', error);
    },
  });

  // Toggle meal availability mutation
  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ mealId, availability }: { mealId: number; availability: boolean }) =>
      meals.updateAvailability(mealId, availability),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-meals', chefId] });
    },
  });

  // Calculate statistics
  const totalOrders = chefOrders.length;
  const activeOrders = chefOrders.filter((order: any) => order.deliveryStatus !== 'Delivered').length;
  const totalRevenue = chefOrders.reduce((sum: number, order: any) => {
    return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
  }, 0);
  const uniqueCustomers = new Set(chefOrders.map((order: any) => order.employeeID)).size;

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? chefOrders 
    : chefOrders.filter((order: any) => order.deliveryStatus.toLowerCase() === statusFilter.toLowerCase());

  const deliveryStatuses = ['Pending', 'Preparing', 'ReadyForPickup', 'Assigned', 'InTransit', 'Delivered'];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'readyforpickup':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
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
      case 'readyforpickup':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    if (!chefId) return;
    updateOrderStatusMutation.mutate({
      orderId,
      newStatus,
      chefId
    });
  };

  if (ordersLoading || mealsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chef Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your orders and meals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChefHat className="h-6 w-6 text-brand-red" />
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Orders</dt>
                  <dd className="text-lg font-semibold text-gray-900">{activeOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">${totalRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{uniqueCustomers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Meal Management */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Meal Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chefMeals.slice(0, 6).map((meal: any) => (
            <div key={meal.mealID} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">{meal.mealName}</h3>
                <button
                  onClick={() => toggleAvailabilityMutation.mutate({
                    mealId: meal.mealID,
                    availability: !meal.availability
                  })}
                  className={`p-1 rounded ${
                    meal.availability 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                  title={meal.availability ? 'Make unavailable' : 'Make available'}
                >
                  {meal.availability ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-sm text-gray-600">${meal.price}</p>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                meal.availability 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {meal.availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-red focus:border-brand-red"
              >
                <option value="all">All Orders</option>
                {deliveryStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {filteredOrders.length} orders
            </span>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order: any) => (
                  <tr key={order.orderID} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{order.orderID}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">Employee #{order.employeeID}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.deliveryStatus)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.deliveryStatus)}`}>
                          {order.deliveryStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${order.meals.reduce((sum: number, meal: any) => sum + meal.price, 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.deliveryStatus === 'Pending' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderID, 'Preparing')}
                          disabled={updateOrderStatusMutation.isPending}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium disabled:opacity-50"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.deliveryStatus === 'Preparing' && (
                        <button
                          onClick={() => handleStatusUpdate(order.orderID, 'ReadyForPickup')}
                          disabled={updateOrderStatusMutation.isPending}
                          className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                        >
                          Ready for Pickup
                        </button>
                      )}
                      {order.deliveryStatus === 'ReadyForPickup' && (
                        <span className="text-sm text-gray-500">Waiting for assignment</span>
                      )}
                      {['Assigned', 'InTransit', 'Delivered'].includes(order.deliveryStatus) && (
                        <span className="text-sm text-gray-500">In delivery</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter === 'all' 
                ? 'Orders will appear here when customers place them.'
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChefDashboard;
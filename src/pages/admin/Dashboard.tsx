import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  UtensilsCrossed,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  Truck,
  Filter,
  UserPlus
} from 'lucide-react';
import { admin, orders, deliveryPersons, delivery } from '../../lib/api';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [assignForm, setAssignForm] = useState({
    deliveryPersonID: '',
    deliveryServiceName: '',
    trackingNumber: ''
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: admin.getStats,
  });

  // Fetch all orders
  const { data: allOrdersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: orders.getAllOrders,
  });

  // Fetch delivery persons
  const { data: deliveryPersonsResponse, isLoading: deliveryPersonsLoading } = useQuery({
    queryKey: ['delivery-persons'],
    queryFn: deliveryPersons.getAll,
  });

  const allOrders = allOrdersResponse || [];
  const deliveryPersonsList = deliveryPersonsResponse?.data || [];

  // Assign delivery mutation
  const assignDeliveryMutation = useMutation({
    mutationFn: (data: any) => delivery.assignDelivery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-orders'] });
      setShowAssignModal(false);
      setSelectedOrder(null);
      setAssignForm({
        deliveryPersonID: '',
        deliveryServiceName: '',
        trackingNumber: ''
      });
    },
    onError: (error) => {
      console.error('Delivery assignment failed:', error);
    },
  });

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter((order: any) => order.deliveryStatus.toLowerCase() === statusFilter.toLowerCase());

  // Calculate statistics
  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter((order: any) => order.deliveryStatus === 'Pending').length;
  const readyForPickupOrders = allOrders.filter((order: any) => order.deliveryStatus === 'ReadyForPickup').length;
  const deliveredOrders = allOrders.filter((order: any) => order.deliveryStatus === 'Delivered').length;
  const totalRevenue = allOrders.reduce((sum: number, order: any) => {
    return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
  }, 0);

  const deliveryStatuses = ['Pending', 'Preparing', 'ReadyForPickup', 'Assigned', 'InTransit', 'Delivered'];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'readyforpickup':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'assigned':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'intransit':
        return <Truck className="h-5 w-5 text-blue-500" />;
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
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'intransit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignDelivery = (order: any) => {
    setSelectedOrder(order);
    setShowAssignModal(true);
  };

  const handleAssignSubmit = () => {
    if (!selectedOrder || !assignForm.deliveryPersonID) return;

    assignDeliveryMutation.mutate({
      orderID: selectedOrder.orderID,
      deliveryPersonID: parseInt(assignForm.deliveryPersonID),
      deliveryServiceName: assignForm.deliveryServiceName || 'Standard Delivery',
      trackingNumber: assignForm.trackingNumber || `TRK${Date.now()}`
    });
  };

  if (statsLoading || ordersLoading || deliveryPersonsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your meal management system
        </p>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {totalOrders}
                  </dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ready for Pickup
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {readyForPickupOrders}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Delivered
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {deliveredOrders}
                  </dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${totalRevenue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
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
                    Chef
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
                      <span className="text-sm text-gray-900">Chef #{order.chefID}</span>
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
                      {order.deliveryStatus === 'ReadyForPickup' && (
                        <button
                          onClick={() => handleAssignDelivery(order)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Assign Delivery
                        </button>
                      )}
                      {order.deliveryStatus === 'Assigned' && (
                        <span className="text-sm text-gray-500">Assigned</span>
                      )}
                      {order.deliveryStatus === 'InTransit' && (
                        <span className="text-sm text-blue-600">In Transit</span>
                      )}
                      {order.deliveryStatus === 'Delivered' && (
                        <span className="text-sm text-green-600">Delivered</span>
                      )}
                      {!['ReadyForPickup', 'Assigned', 'InTransit', 'Delivered'].includes(order.deliveryStatus) && (
                        <span className="text-sm text-gray-500">-</span>
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
                ? 'Orders will appear here when they are placed.'
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        )}
      </div>

      {/* Assign Delivery Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Delivery for Order #{selectedOrder.orderID}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Person
                </label>
                <select
                  value={assignForm.deliveryPersonID}
                  onChange={(e) => setAssignForm({ ...assignForm, deliveryPersonID: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                >
                  <option value="">Select delivery person</option>
                  {deliveryPersonsList.map((person: any) => (
                    <option key={person.deliveryPersonID} value={person.deliveryPersonID}>
                      {person.fullName} - {person.phoneNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Service Name
                </label>
                <input
                  type="text"
                  value={assignForm.deliveryServiceName}
                  onChange={(e) => setAssignForm({ ...assignForm, deliveryServiceName: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Standard Delivery"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={assignForm.trackingNumber}
                  onChange={(e) => setAssignForm({ ...assignForm, trackingNumber: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  placeholder="Auto-generated if empty"
                />
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                disabled={!assignForm.deliveryPersonID || assignDeliveryMutation.isPending}
                className="flex-1 px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
              >
                {assignDeliveryMutation.isPending ? 'Assigning...' : 'Assign Delivery'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
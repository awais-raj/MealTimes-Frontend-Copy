import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orders } from '../../lib/api';
import { Clock, Package, CheckCircle, X, AlertTriangle, Filter, Eye, DollarSign, Calendar, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const OrderManagement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const chefId = user?.homeChef?.chefID;

  const { data: chefOrders, isLoading } = useQuery({
    queryKey: ['chef-orders', chefId],
    queryFn: () => orders.getOrdersByChef(chefId?.toString() || ''),
    enabled: !!chefId,
  });

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

  const allOrders = chefOrders || [];

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? allOrders 
    : allOrders.filter((order: any) => order.deliveryStatus.toLowerCase() === statusFilter.toLowerCase());

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
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'intransit':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
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

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    if (!chefId) return;
    updateOrderStatusMutation.mutate({
      orderId,
      newStatus,
      chefId
    });
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
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
          </div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order: any) => (
                <div key={order.orderID} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(order.deliveryStatus)}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Order #{order.orderID}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Employee #{order.employeeID}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${order.meals.reduce((sum: number, meal: any) => sum + meal.price, 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.deliveryStatus)}`}>
                        {order.deliveryStatus}
                      </span>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="text-brand-red hover:text-brand-orange flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Meals Ordered</h4>
                      <div className="mt-1">
                        {order.meals.map((meal: any, index: number) => (
                          <div key={index} className="text-sm text-gray-900">
                            Meal ID: {meal.mealID} - ${meal.price}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Payment Status</h4>
                      <p className="mt-1 text-sm text-gray-900">{order.paymentStatus}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Order Time</h4>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-4">
                    {order.deliveryStatus === 'Pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order.orderID, 'Preparing')}
                        disabled={updateOrderStatusMutation.isPending}
                        className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.deliveryStatus === 'Preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.orderID, 'ReadyForPickup')}
                        disabled={updateOrderStatusMutation.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                    {['ReadyForPickup', 'Assigned', 'InTransit'].includes(order.deliveryStatus) && (
                      <span className="px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-md">
                        {order.deliveryStatus === 'ReadyForPickup' && 'Waiting for delivery assignment'}
                        {order.deliveryStatus === 'Assigned' && 'Assigned to delivery person'}
                        {order.deliveryStatus === 'InTransit' && 'Out for delivery'}
                      </span>
                    )}
                    {order.deliveryStatus === 'Delivered' && (
                      <span className="px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md">
                        Order Delivered
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Details - #{selectedOrder.orderID}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order ID:</span>
                      <span className="font-medium">#{selectedOrder.orderID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Employee ID:</span>
                      <span className="font-medium">#{selectedOrder.employeeID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Date:</span>
                      <span className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Order Time:</span>
                      <span className="font-medium">{new Date(selectedOrder.orderDate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Status Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Delivery Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.deliveryStatus)}`}>
                        {selectedOrder.deliveryStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {selectedOrder.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals Details */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Ordered Meals</h4>
                <div className="space-y-3">
                  {selectedOrder.meals.map((meal: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Meal ID: {meal.mealID}</p>
                        <p className="text-sm text-gray-500">
                          {meal.name || 'Meal details not available'}
                        </p>
                        {meal.category && (
                          <span className="inline-block px-2 py-1 text-xs bg-brand-light text-brand-red rounded mt-1">
                            {meal.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${meal.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                    <span className="text-xl font-bold text-brand-red">
                      ${selectedOrder.meals.reduce((sum: number, meal: any) => sum + meal.price, 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedOrder.deliveryStatus === 'Pending' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderID, 'Preparing');
                      setShowOrderDetails(false);
                    }}
                    disabled={updateOrderStatusMutation.isPending}
                    className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                  >
                    Start Preparing
                  </button>
                )}
                {selectedOrder.deliveryStatus === 'Preparing' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.orderID, 'ReadyForPickup');
                      setShowOrderDetails(false);
                    }}
                    disabled={updateOrderStatusMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    Mark Ready for Pickup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
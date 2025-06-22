import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { orders } from '../../lib/api';
import { Clock, Package, CheckCircle, X, AlertTriangle } from 'lucide-react';

const OrderManagement = () => {
  const { data: chefOrders, isLoading } = useQuery({
    queryKey: ['chef-orders'],
    queryFn: orders.getChefOrders,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading orders...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          </div>

          {/* Order Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
                All Orders
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                Pending
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                Preparing
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                Completed
              </button>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-200">
            {chefOrders?.map((order: any) => (
              <div key={order._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order._id.slice(-6)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <button className="text-brand-red hover:text-brand-orange">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                    <p className="mt-1">{order.customer.name}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Items</h4>
                    <ul className="mt-1 space-y-1">
                      {order.items.map((item: any) => (
                        <li key={item._id} className="text-sm">
                          {item.quantity}x {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Special Instructions</h4>
                    <p className="mt-1 text-sm">{order.specialInstructions || 'None'}</p>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-4">
                  {order.status === 'pending' && (
                    <>
                      <button className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
                        Start Preparing
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Cancel Order
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
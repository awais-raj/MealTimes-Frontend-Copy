import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { orders } from '../lib/api';
import { Clock, Package2, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { data: myOrders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orders.getMyOrders,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package2 className="h-6 w-6 text-brand-red" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-900">{myOrders?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {myOrders?.map((order: any) => (
                <li key={order._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-brand-red mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.mealPackage.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Scheduled for: {new Date(order.scheduledFor).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'preparing' ? 'bg-brand-light text-brand-red' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { tracking } from '../lib/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: () => tracking.getOrderStatus(orderId || ''),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading order status...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ordered':
        return <Package className="h-6 w-6 text-brand-red" />;
      case 'preparing':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'in_transit':
        return <Truck className="h-6 w-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Order Tracking</h1>

          {/* Status Timeline */}
          <div className="relative">
            <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {order?.statusHistory.map((status, index) => (
                <div key={index} className="flex items-center">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-white border-2 border-brand-red flex items-center justify-center">
                      {getStatusIcon(status.status)}
                    </div>
                  </div>
                  <div className="ml-6">
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {status.status.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(status.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Details */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                    <p className="font-medium">
                      {new Date(order?.estimatedDelivery).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery Location</p>
                    <p className="font-medium">{order?.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{order?.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">
                    {order?.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
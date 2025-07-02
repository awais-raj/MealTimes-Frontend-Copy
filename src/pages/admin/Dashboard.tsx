import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateSalesReportPDF } from '../../lib/pdfGenerator';
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
  UserPlus,
  CreditCard,
  Download,
  Calendar
} from 'lucide-react';
import { admin, orders, deliveryPersons, delivery, payments } from '../../lib/api';

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
  const [showReportsModal, setShowReportsModal] = useState(false);

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

  // Fetch payments
  const { data: paymentsResponse, isLoading: paymentsLoading } = useQuery({
    queryKey: ['all-payments'],
    queryFn: payments.getAllPayments,
  });

  const allOrders = allOrdersResponse || [];
  const deliveryPersonsList = deliveryPersonsResponse?.data || [];
  const allPayments = paymentsResponse || [];

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

  // Generate Sales Report Data
  const generateSalesReport = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const ordersThisMonth = allOrders.filter((order: any) => 
      new Date(order.orderDate) >= lastMonth
    );
    const ordersThisWeek = allOrders.filter((order: any) => 
      new Date(order.orderDate) >= lastWeek
    );

    const revenueThisMonth = ordersThisMonth.reduce((sum: number, order: any) => {
      return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
    }, 0);

    const revenueThisWeek = ordersThisWeek.reduce((sum: number, order: any) => {
      return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
    }, 0);

    // Group orders by date for trend analysis
    const ordersByDate = allOrders.reduce((acc: any, order: any) => {
      const date = new Date(order.orderDate).toDateString();
      if (!acc[date]) {
        acc[date] = { count: 0, revenue: 0 };
      }
      acc[date].count += 1;
      acc[date].revenue += order.meals.reduce((sum: number, meal: any) => sum + meal.price, 0);
      return acc;
    }, {});

    // Top performing days
    const topDays = Object.entries(ordersByDate)
      .sort(([,a]: any, [,b]: any) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      totalOrders,
      totalRevenue,
      ordersThisMonth: ordersThisMonth.length,
      ordersThisWeek: ordersThisWeek.length,
      revenueThisMonth,
      revenueThisWeek,
      averageOrderValue: totalRevenue / totalOrders || 0,
      topDays,
      ordersByDate
    };
  };

  const salesReport = generateSalesReport();

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

  const downloadSalesReport = () => {
  generateSalesReportPDF(salesReport, allOrders, allPayments);
};

  if (statsLoading || ordersLoading || deliveryPersonsLoading || paymentsLoading) {
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

      {/* Sales Report and Payments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Report */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sales Report</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowReportsModal(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Details
              </button>
              <button
                onClick={downloadSalesReport}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{salesReport.ordersThisMonth}</p>
              <p className="text-sm text-gray-500">orders</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{salesReport.ordersThisWeek}</p>
              <p className="text-sm text-gray-500">orders</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-green-600">${salesReport.revenueThisMonth.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-blue-600">${salesReport.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Payment Records */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
            <CreditCard className="h-6 w-6 text-brand-red" />
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {allPayments.map((payment: any) => (
              <div key={payment.paymentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{payment.companyName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </p>
                  {payment.planName && (
                    <p className="text-xs text-blue-600">{payment.planName}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${payment.paymentAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{payment.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Payments:</span>
              <span className="text-lg font-bold text-green-600">
                ${allPayments.reduce((sum: number, p: any) => sum + p.paymentAmount, 0).toLocaleString()}
              </span>
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
                        <span className="text-sm text-purple-600">Assigned</span>
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

      {/* Sales Report Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Sales Report</h3>
              <button
                onClick={() => setShowReportsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900">Total Orders</h4>
                <p className="text-2xl font-bold text-blue-600">{salesReport.totalOrders}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900">Total Revenue</h4>
                <p className="text-2xl font-bold text-green-600">${salesReport.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-purple-900">This Month</h4>
                <p className="text-2xl font-bold text-purple-600">{salesReport.ordersThisMonth}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-medium text-orange-900">Avg Order Value</h4>
                <p className="text-2xl font-bold text-orange-600">${salesReport.averageOrderValue.toFixed(2)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-4">Top Performing Days</h4>
              <div className="space-y-2">
                {salesReport.topDays.map(([date, data]: any, index: number) => (
                  <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">#{index + 1} {date}</span>
                      <span className="ml-2 text-sm text-gray-600">({data.count} orders)</span>
                    </div>
                    <span className="font-bold text-green-600">${data.revenue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={downloadSalesReport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </button>
              <button
                onClick={() => setShowReportsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
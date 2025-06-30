import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { admin, orders, payments } from '../../lib/api';
import { Download, FileText, BarChart3, TrendingUp, DollarSign, Package } from 'lucide-react';
import { generateSalesReportPDF } from '../../lib/pdfGenerator';

const Reports = () => {
  // Fetch all orders for sales report
  const { data: allOrdersResponse, isLoading: ordersLoading } = useQuery({
    queryKey: ['all-orders'],
    queryFn: orders.getAllOrders,
  });

  // Fetch payments for sales report
  const { data: paymentsResponse, isLoading: paymentsLoading } = useQuery({
    queryKey: ['all-payments'],
    queryFn: payments.getAllPayments,
  });

  const allOrders = allOrdersResponse || [];
  const allPayments = paymentsResponse || [];

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

    const totalRevenue = allOrders.reduce((sum: number, order: any) => {
      return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
    }, 0);

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
      totalOrders: allOrders.length,
      totalRevenue,
      ordersThisMonth: ordersThisMonth.length,
      ordersThisWeek: ordersThisWeek.length,
      revenueThisMonth,
      revenueThisWeek,
      averageOrderValue: totalRevenue / allOrders.length || 0,
      topDays,
      ordersByDate
    };
  };

  const downloadSalesReport = () => {
    const salesReport = generateSalesReport();
    generateSalesReportPDF(salesReport, allOrders, allPayments);
  };

  const isLoading = ordersLoading || paymentsLoading;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>

        {/* Sales Report Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-brand-red mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sales Report</h2>
                <p className="text-gray-600">Comprehensive sales analysis and performance metrics</p>
              </div>
            </div>
            <button
              onClick={downloadSalesReport}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Download PDF'}
            </button>
          </div>

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-brand-red mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{allOrders.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${allOrders.reduce((sum: number, order: any) => {
                        return sum + order.meals.reduce((mealSum: number, meal: any) => mealSum + meal.price, 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-xl font-bold text-gray-900">
                      {allOrders.filter((order: any) => {
                        const orderDate = new Date(order.orderDate);
                        const lastMonth = new Date();
                        lastMonth.setMonth(lastMonth.getMonth() - 1);
                        return orderDate >= lastMonth;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Payments</p>
                    <p className="text-xl font-bold text-gray-900">{allPayments.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Reports Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* User Activity Report */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">User Activity</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                User engagement and behavior analysis
              </p>
            </div>
          </div>

          {/* Financial Report */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Financial Report</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Revenue, expenses, and profit analysis
              </p>
            </div>
          </div>

          {/* Performance Report */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Performance Report</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Platform performance and metrics
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Reports Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Available Reports
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Download detailed reports for analysis and record keeping
            </p>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Sales Performance Report
                    </div>
                    <div className="text-sm text-gray-500">
                      Comprehensive sales analysis with trends
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Sales
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={downloadSalesReport}
                      disabled={isLoading}
                      className="flex items-center text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      User Activity Report
                    </div>
                    <div className="text-sm text-gray-500">
                      User engagement metrics and behavior
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Analytics
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Financial Summary
                    </div>
                    <div className="text-sm text-gray-500">
                      Revenue and payment analysis
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Financial
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date().toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
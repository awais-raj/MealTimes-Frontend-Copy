import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calculator,
  CreditCard,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Play,
  Filter,
  Search,
  Eye,
  X,
  Save
} from 'lucide-react';
import { business } from '../../lib/api';

const BusinessManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('analytics');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedChef, setSelectedChef] = useState<number | null>(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  const [payoutForm, setPayoutForm] = useState({
    chefID: 0,
    payoutPeriod: 'Weekly',
    periodStart: '',
    periodEnd: ''
  });

  // Fetch business analytics
  const { data: analyticsResponse, isLoading: analyticsLoading } = useQuery({
    queryKey: ['business-analytics', dateRange.startDate, dateRange.endDate],
    queryFn: () => business.getBusinessAnalytics(dateRange.startDate, dateRange.endDate),
  });

  // Fetch all commissions
  const { data: commissionsResponse, isLoading: commissionsLoading } = useQuery({
    queryKey: ['all-commissions', dateRange.startDate, dateRange.endDate],
    queryFn: () => business.getAllCommissions(dateRange.startDate, dateRange.endDate),
  });

  // Fetch all payouts
  const { data: payoutsResponse, isLoading: payoutsLoading } = useQuery({
    queryKey: ['chef-payouts'],
    queryFn: () => business.getChefPayouts(),
  });

  // Fetch pending payouts
  const { data: pendingPayoutsResponse, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-payouts'],
    queryFn: () => business.getPendingPayouts(),
  });

  const analytics = analyticsResponse?.data;
  const commissions = commissionsResponse?.data || [];
  const payouts = payoutsResponse?.data || [];
  const pendingPayouts = pendingPayoutsResponse?.data || [];

  // Create payout mutation
  const createPayoutMutation = useMutation({
    mutationFn: (data: any) => business.createChefPayout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payouts'] });
      setShowPayoutModal(false);
      setPayoutForm({ chefID: 0, payoutPeriod: 'Weekly', periodStart: '', periodEnd: '' });
    },
  });

  // Update payout status mutation
  const updatePayoutMutation = useMutation({
    mutationFn: (data: any) => business.updatePayoutStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payouts'] });
    },
  });

  // Process weekly payouts mutation
  const processWeeklyMutation = useMutation({
    mutationFn: () => business.processWeeklyPayouts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payouts'] });
    },
  });

  // Process monthly payouts mutation
  const processMonthlyMutation = useMutation({
    mutationFn: () => business.processMonthlyPayouts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chef-payouts'] });
      queryClient.invalidateQueries({ queryKey: ['pending-payouts'] });
    },
  });

  const handleUpdatePayoutStatus = (payoutId: number, status: string) => {
    updatePayoutMutation.mutate({
      payoutID: payoutId,
      status,
      paymentMethod: 'Bank Transfer',
      paymentReference: `REF${Date.now()}`,
      notes: `Status updated to ${status}`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'commissions', label: 'Commissions', icon: Calculator },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Management</h1>
        <p className="mt-2 text-gray-600">Manage commissions, payouts, and business analytics</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-brand-red text-brand-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {analyticsLoading ? (
                <div className="text-center py-8">Loading analytics...</div>
              ) : (
                <>
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total Revenue</p>
                          <p className="text-2xl font-bold">${analytics?.totalRevenue?.toLocaleString() || 0}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-blue-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Total Profit</p>
                          <p className="text-2xl font-bold">${analytics?.totalProfit?.toLocaleString() || 0}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Total Commissions</p>
                          <p className="text-2xl font-bold">${analytics?.totalCommissions?.toLocaleString() || 0}</p>
                        </div>
                        <Calculator className="h-8 w-8 text-purple-200" />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Chef Payouts</p>
                          <p className="text-2xl font-bold">${analytics?.totalChefPayouts?.toLocaleString() || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-orange-200" />
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Orders</span>
                          <span className="font-semibold">{analytics?.totalOrders || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average Order Value</span>
                          <span className="font-semibold">${analytics?.averageOrderValue?.toFixed(2) || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Profit Margin</span>
                          <span className="font-semibold">{analytics?.profitMargin?.toFixed(2) || 0}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Monthly Growth</span>
                          <span className="font-semibold text-green-600">
                            {analytics?.monthlyGrowthRate?.toFixed(2) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Subscriptions</span>
                          <span className="font-semibold">{analytics?.totalActiveSubscriptions || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Top Chef</p>
                          <p className="font-semibold">{analytics?.topChefs?.[0]?.chefName || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Top Company</p>
                          <p className="font-semibold">{analytics?.topCompanies?.[0]?.companyName || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Commission Management</h2>
              </div>

              {commissionsLoading ? (
                <div className="text-center py-8">Loading commissions...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chef
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Commission
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chef Payable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {commissions.map((commission: any) => (
                        <tr key={commission.commissionID} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{commission.commissionID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {commission.chefName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${commission.orderAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${commission.commissionAmount} ({commission.commissionRate}%)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${commission.chefPayableAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commission.status)}`}>
                              {commission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedCommission(commission);
                                setShowCommissionModal(true);
                              }}
                              className="text-brand-red hover:text-brand-orange"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Payout Management</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowPayoutModal(true)}
                    className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange"
                  >
                    Create Payout
                  </button>
                  <button
                    onClick={() => processWeeklyMutation.mutate()}
                    disabled={processWeeklyMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    Process Weekly
                  </button>
                  <button
                    onClick={() => processMonthlyMutation.mutate()}
                    disabled={processMonthlyMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Process Monthly
                  </button>
                </div>
              </div>

              {/* Pending Payouts */}
              {pendingPayouts.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-4">
                    Pending Payouts ({pendingPayouts.length})
                  </h3>
                  <div className="space-y-2">
                    {pendingPayouts.slice(0, 3).map((payout: any) => (
                      <div key={payout.payoutID} className="flex items-center justify-between bg-white p-3 rounded">
                        <div>
                          <span className="font-medium">{payout.chefName}</span>
                          <span className="text-sm text-gray-600 ml-2">${payout.payableAmount}</span>
                        </div>
                        <button
                          onClick={() => handleUpdatePayoutStatus(payout.payoutID, 'Paid')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Mark Paid
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {payoutsLoading ? (
                <div className="text-center py-8">Loading payouts...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payout ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chef
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Earnings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payable Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payouts.map((payout: any) => (
                        <tr key={payout.payoutID} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{payout.payoutID}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payout.chefName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payout.payoutPeriod}
                            <br />
                            <span className="text-xs text-gray-500">
                              {new Date(payout.periodStart).toLocaleDateString()} - {new Date(payout.periodEnd).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${payout.totalEarnings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            ${payout.payableAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                              {payout.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {payout.status === 'Pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUpdatePayoutStatus(payout.payoutID, 'Paid')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdatePayoutStatus(payout.payoutID, 'Failed')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Business Reports</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-8 w-8 text-brand-red mr-3" />
                    <h3 className="text-lg font-semibold">Profit & Loss Report</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Generate comprehensive P&L reports for any period</p>
                  <button className="w-full bg-brand-red text-white py-2 px-4 rounded-md hover:bg-brand-orange">
                    Generate Report
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-lg font-semibold">Commission Report</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Detailed commission breakdown by chef and period</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    View Commissions
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                    <h3 className="text-lg font-semibold">Growth Analytics</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Track business growth and performance metrics</p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Chef Payout</h3>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              createPayoutMutation.mutate(payoutForm);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chef ID</label>
                <input
                  type="number"
                  value={payoutForm.chefID}
                  onChange={(e) => setPayoutForm({ ...payoutForm, chefID: parseInt(e.target.value) })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payout Period</label>
                <select
                  value={payoutForm.payoutPeriod}
                  onChange={(e) => setPayoutForm({ ...payoutForm, payoutPeriod: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period Start</label>
                <input
                  type="date"
                  value={payoutForm.periodStart}
                  onChange={(e) => setPayoutForm({ ...payoutForm, periodStart: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period End</label>
                <input
                  type="date"
                  value={payoutForm.periodEnd}
                  onChange={(e) => setPayoutForm({ ...payoutForm, periodEnd: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-red focus:ring-brand-red"
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createPayoutMutation.isPending}
                  className="flex-1 px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors disabled:opacity-50"
                >
                  {createPayoutMutation.isPending ? 'Creating...' : 'Create Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Commission Details Modal */}
      {showCommissionModal && selectedCommission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Commission Details - #{selectedCommission.commissionID}
              </h3>
              <button
                onClick={() => setShowCommissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-medium">#{selectedCommission.orderID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chef:</span>
                    <span className="font-medium">{selectedCommission.chefName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Amount:</span>
                    <span className="font-medium">${selectedCommission.orderAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Created:</span>
                    <span className="font-medium">{new Date(selectedCommission.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Commission Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commission Rate:</span>
                    <span className="font-medium">{selectedCommission.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Commission Amount:</span>
                    <span className="font-medium text-red-600">${selectedCommission.commissionAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chef Payable:</span>
                    <span className="font-medium text-green-600">${selectedCommission.chefPayableAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Platform Earning:</span>
                    <span className="font-medium text-blue-600">${selectedCommission.platformEarning}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCommission.status)}`}>
                  {selectedCommission.status}
                </span>
                <button
                  onClick={() => setShowCommissionModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessManagement;
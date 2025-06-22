import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { admin } from '../../lib/api';
import { Download } from 'lucide-react';

const Reports = () => {
  const { data: reports } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: admin.getReports,
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Sales Report Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Sales Report</h3>
                <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Detailed sales analysis with trends and patterns
              </p>
            </div>
          </div>

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
        </div>

        {/* Detailed Reports Table */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Available Reports
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports?.map((report) => (
                  <tr key={report._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {report.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(report.generatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="flex items-center text-indigo-600 hover:text-indigo-900">
                        <Download className="h-5 w-5 mr-2" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
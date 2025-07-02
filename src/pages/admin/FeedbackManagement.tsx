import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle, Star, Flag, CheckCircle, XCircle, Filter } from 'lucide-react';
import { admin } from '../../lib/api';

const FeedbackManagement = () => {
  const { data: feedbacks, isLoading } = useQuery({
    queryKey: ['admin-feedbacks'],
    queryFn: () => admin.getFeedbacks(),
  });

  const [filter, setFilter] = React.useState('all');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading feedback...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Feedback Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Filter className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-brand-red focus:border-brand-red"
              >
                <option value="all">All Feedback</option>
                <option value="unresolved">Unresolved</option>
                <option value="resolved">Resolved</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {feedbacks?.map((feedback) => (
              <li key={feedback.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={feedback.user.avatar}
                      alt={feedback.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{feedback.user.name}</h3>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(feedback.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {feedback.status === 'resolved' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Resolved
                      </span>
                    ) : feedback.status === 'flagged' ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Flagged
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{feedback.message}</p>
                  {feedback.response && (
                    <div className="mt-2 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm text-gray-600 italic">{feedback.response}</p>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end space-x-4">
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Reply
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Flag className="h-4 w-4 mr-1" />
                    Flag
                  </button>
                  {feedback.status !== 'resolved' && (
                    <button className="flex items-center text-sm text-green-600 hover:text-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as Resolved
                    </button>
                  )}
                  <button className="flex items-center text-sm text-red-600 hover:text-red-700">
                    <XCircle className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackManagement;
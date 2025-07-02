import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Gift, Award, Star, TrendingUp, Share2, Trophy } from 'lucide-react';
import { rewards } from '../lib/api';

const Rewards = () => {
  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: rewards.getPoints,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading rewards...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Trophy className="h-16 w-16 text-brand-red mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Rewards Program</h1>
          <p className="mt-4 text-xl text-gray-600">
            Earn points and unlock exclusive rewards
          </p>
        </div>

        {/* Points Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Star className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{rewardsData?.points}</h3>
              <p className="text-gray-600">Available Points</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{rewardsData?.tier}</h3>
              <p className="text-gray-600">Current Tier</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-brand-red mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">250</h3>
              <p className="text-gray-600">Points to Next Tier</p>
            </div>
          </div>
        </div>

        {/* Available Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {rewardsData?.rewards.map((reward) => (
            <div key={reward.id} className="bg-white rounded-lg shadow-lg p-6">
              <Gift className="h-8 w-8 text-brand-red mb-4" />
              <h3 className="text-xl font-semibold mb-2">{reward.name}</h3>
              <p className="text-gray-600 mb-4">{reward.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  {reward.points} points
                </span>
                <button className="px-4 py-2 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
                  Redeem
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Points History */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Points History</h2>
          <div className="space-y-4">
            {rewardsData?.history.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span className="font-semibold text-brand-red">+{item.points} points</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <Share2 className="h-12 w-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Refer a Friend</h2>
            <p className="text-gray-600 mb-6">
              Earn 500 bonus points for each friend who joins and places their first order
            </p>
            <button className="px-6 py-3 bg-brand-red text-white rounded-md hover:bg-brand-orange transition-colors">
              Share Referral Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
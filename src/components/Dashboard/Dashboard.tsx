import React from 'react';
import { useApp } from '../../context/AppContext';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import TimeTracker from '../TimeTracking/TimeTracker';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { user } = state;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-yellow-600 mb-2">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your {user?.role === 'manager' ? 'team' : 'tasks'} today.
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <TimeTracker />
      </div>
    </div>
  );
};

export default Dashboard;
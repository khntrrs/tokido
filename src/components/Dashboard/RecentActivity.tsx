import React from 'react';
import { Clock, CheckSquare, PlayCircle, PauseCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime, formatTime } from '../../utils/dateUtils';

const RecentActivity: React.FC = () => {
  const { state } = useApp();
  const { tasks, timeLogs, user } = state;

  // Get recent activities
  const recentTasks = tasks
    .filter(task => user?.role === 'manager' ? task.assignerId === user.id : task.assigneeId === user?.id)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const recentTimeLogs = timeLogs
    .filter(log => log.userId === user?.id)
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime())
    .slice(0, 2);

  const activities = [
    ...recentTasks.map(task => ({
      id: task.id,
      type: 'task',
      icon: CheckSquare,
      title: `Updated "${task.title}"`,
      time: formatDateTime(task.updatedAt),
      status: task.status,
    })),
    ...recentTimeLogs.map(log => ({
      id: log.id,
      type: 'time',
      icon: Clock,
      title: log.clockOut ? 'Clocked out' : 'Clocked in',
      time: formatDateTime(log.clockOut || log.clockIn),
      status: log.clockOut ? 'completed' : 'active',
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-emerald-600';
      case 'in-progress':
      case 'active':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`${getStatusColor(activity.status)} p-2 rounded-lg bg-gray-50`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <span className={`text-xs font-medium capitalize px-2 py-1 rounded-full ${
                  activity.status === 'completed' || activity.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : activity.status === 'in-progress' || activity.status === 'active'
                    ? 'bg-blue-100 text-blue-700'
                    : activity.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {activity.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
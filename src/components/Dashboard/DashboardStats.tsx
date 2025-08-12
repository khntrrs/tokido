import React from 'react';
import { CheckSquare, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

import { formatDuration } from '../../utils/dateUtils';

const DashboardStats: React.FC = () => {
  const { state } = useApp();
  const { tasks, timeLogs, user } = state;

  const userTasks = user?.role === 'manager' 
    ? tasks.filter(task => task.assignerId === user.id)
    : tasks.filter(task => task.assigneeId === user?.id);

  const completedTasks = userTasks.filter(task => task.status === 'completed' || task.status === 'approved');
  const pendingTasks = userTasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
  const overdueTasks = userTasks.filter(task => 
    (task.status === 'pending' || task.status === 'in-progress') && 
    new Date(task.deadline) < new Date()
  );

  const todayLogs = timeLogs.filter(log => 
    log.userId === user?.id && 
    log.date === new Date().toISOString().split('T')[0]
  );
  
  const totalHoursToday = todayLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  
  const totalTimeSpent = userTasks.reduce((sum, task) => sum + task.timeSpent, 0);

  const stats = [
    {
      title: 'Completed Tasks',
      value: completedTasks.length,
      icon: CheckSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Pending Tasks',
      value: pendingTasks.length,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Hours Today',
      value: `${totalHoursToday.toFixed(1)}h`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} ${stat.bgColor} p-3 rounded-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            {stat.title === 'Hours Today' && totalTimeSpent > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Total: {formatDuration(totalTimeSpent)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
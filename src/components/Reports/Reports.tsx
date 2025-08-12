import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Clock,
  CheckSquare,
  User,
  AlertCircle,
  Target,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDuration } from '../../utils/dateUtils';

const Reports: React.FC = () => {
  const { state } = useApp();
  const { tasks, timeLogs, user } = state;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const getDateRange = (period: 'week' | 'month' | 'quarter') => {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    switch (period) {
      case 'week':
        start.setDate(now.getDate() - 7);
        break;
      case 'month':
        start.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(now.getMonth() - 3);
        break;
    }

    return { start, end };
  };

  const { start, end } = getDateRange(selectedPeriod);

  const periodTasks = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= start && taskDate <= end;
  });

  const periodTimeLogs = timeLogs.filter(log => {
    const logDate = new Date(log.date);
    return logDate >= start && logDate <= end;
  });

  const completedTasks = periodTasks.filter(task => task.status === 'completed' || task.status === 'approved');
  const pendingTasks = periodTasks.filter(task => task.status === 'pending');
  const inProgressTasks = periodTasks.filter(task => task.status === 'in-progress');
  const overdueTasks = periodTasks.filter(task => 
    (task.status === 'pending' || task.status === 'in-progress') && 
    new Date(task.deadline) < new Date()
  );

  const totalHours = periodTimeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  const totalTimeSpent = periodTasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const averageTaskTime = completedTasks.length > 0 ? totalTimeSpent / completedTasks.length : 0;

  const completionRate = periodTasks.length > 0 ? (completedTasks.length / periodTasks.length) * 100 : 0;

  const getPerformanceGrade = (rate: number) => {
    if (rate >= 90) return { grade: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (rate >= 80) return { grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (rate >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (rate >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const performance = getPerformanceGrade(completionRate);

  const dailyStats = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.updatedAt);
      return taskDate.toDateString() === date.toDateString();
    });
    const dayLogs = timeLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.toDateString() === date.toDateString();
    });
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      tasks: dayTasks.length,
      hours: dayLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0),
    };
  }).reverse();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Performance Reports</h1>
          <p className="text-gray-600">Analyze your productivity and performance metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
          </select>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Performance Overview</h2>
            <p className="text-gray-600">Your productivity summary for the selected period</p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${performance.bg}`}>
            <Award className={`w-5 h-5 ${performance.color}`} />
            <span className={`font-bold text-lg ${performance.color}`}>{performance.grade}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">{completedTasks.length}</span>
            </div>
            <p className="text-sm text-gray-600">Tasks Completed</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}h</span>
            </div>
            <p className="text-sm text-gray-600">Hours Logged</p>
            <p className="text-xs text-gray-500 mt-1">
              Avg: {(totalHours / Math.max(periodTimeLogs.length, 1)).toFixed(1)}h/day
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{completionRate.toFixed(0)}%</span>
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-1">
              {completedTasks.length} of {periodTasks.length} tasks
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">{formatDuration(averageTaskTime)}</span>
            </div>
            <p className="text-sm text-gray-600">Avg Task Time</p>
            <p className="text-xs text-gray-500 mt-1">
              Per completed task
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity</h3>
          <div className="space-y-4">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 text-sm text-gray-600">{day.date}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((day.hours / 8) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{day.hours.toFixed(1)}h</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">{day.tasks} tasks</div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{completedTasks.length}</span>
                <span className="text-xs text-gray-500">
                  ({periodTasks.length > 0 ? ((completedTasks.length / periodTasks.length) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{inProgressTasks.length}</span>
                <span className="text-xs text-gray-500">
                  ({periodTasks.length > 0 ? ((inProgressTasks.length / periodTasks.length) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{pendingTasks.length}</span>
                <span className="text-xs text-gray-500">
                  ({periodTasks.length > 0 ? ((pendingTasks.length / periodTasks.length) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Overdue</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-900">{overdueTasks.length}</span>
                <span className="text-xs text-gray-500">
                  ({periodTasks.length > 0 ? ((overdueTasks.length / periodTasks.length) * 100).toFixed(0) : 0}%)
                </span>
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${(completedTasks.length / Math.max(periodTasks.length, 1)) * 100}%` }}
                ></div>
                <div 
                  className="bg-blue-500 transition-all"
                  style={{ width: `${(inProgressTasks.length / Math.max(periodTasks.length, 1)) * 100}%` }}
                ></div>
                <div 
                  className="bg-yellow-500 transition-all"
                  style={{ width: `${(pendingTasks.length / Math.max(periodTasks.length, 1)) * 100}%` }}
                ></div>
                <div 
                  className="bg-red-500 transition-all"
                  style={{ width: `${(overdueTasks.length / Math.max(periodTasks.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Strong Performance</p>
                <p className="text-sm text-gray-600">
                  You've completed {completedTasks.length} tasks with a {completionRate.toFixed(0)}% completion rate.
                </p>
              </div>
            </div>

            {overdueTasks.length > 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Overdue Tasks</p>
                  <p className="text-sm text-gray-600">
                    You have {overdueTasks.length} overdue tasks that need immediate attention.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Time Management</p>
                <p className="text-sm text-gray-600">
                  Average {formatDuration(averageTaskTime)} per task. Consider breaking down larger tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Productivity Goal</p>
                <p className="text-sm text-gray-600">
                  Aim for 85% completion rate to reach excellent performance level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
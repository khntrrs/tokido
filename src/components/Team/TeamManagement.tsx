import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Calendar, 
  CheckSquare,
  Clock,
  MoreHorizontal,
  Activity,
  Star,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers } from '../../utils/mockData';
import { formatDate } from '../../utils/dateUtils';

const TeamManagement: React.FC = () => {
  const { state } = useApp();
  const { tasks, timeLogs, user } = state;
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Get team members (excluding current user)
  const teamMembers = mockUsers.filter(member => member.id !== user?.id);

  const getMemberStats = (memberId: string) => {
    const memberTasks = tasks.filter(task => task.assigneeId === memberId);
    const completedTasks = memberTasks.filter(task => task.status === 'completed' || task.status === 'approved');
    const pendingTasks = memberTasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
    const memberTimeLogs = timeLogs.filter(log => log.userId === memberId);
    const totalHours = memberTimeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
    
    return {
      totalTasks: memberTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      totalHours: totalHours,
      completionRate: memberTasks.length > 0 ? (completedTasks.length / memberTasks.length) * 100 : 0,
    };
  };

  const getPerformanceColor = (completionRate: number) => {
    if (completionRate >= 80) return 'text-emerald-600 bg-emerald-50';
    if (completionRate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getPerformanceLabel = (completionRate: number) => {
    if (completionRate >= 80) return 'Excellent';
    if (completionRate >= 60) return 'Good';
    if (completionRate >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Management</h1>
          <p className="text-gray-600">Monitor team performance and manage assignments</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Active Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(task => task.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Completed Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {tasks.filter(task => task.status === 'completed' || task.status === 'approved').length}
              </p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl">
              <CheckSquare className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {timeLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0).toFixed(1)}h
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map(member => {
          const stats = getMemberStats(member.id);
          const performanceColor = getPerformanceColor(stats.completionRate);
          const performanceLabel = getPerformanceLabel(stats.completionRate);

          return (
            <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{member.email}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Joined</span>
                  <span className="text-gray-900">{formatDate(member.joinDate)}</span>
                </div>
              </div>

              {/* Performance Badge */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${performanceColor}`}>
                <Star className="w-4 h-4 mr-1" />
                {performanceLabel}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                  <p className="text-xs text-gray-600">Total Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{stats.completedTasks}</p>
                  <p className="text-xs text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalHours.toFixed(1)}h</p>
                  <p className="text-xs text-gray-600">Hours Logged</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{stats.completionRate.toFixed(0)}%</p>
                  <p className="text-xs text-gray-600">Completion Rate</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  <span>Message</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>View Stats</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamManagement;
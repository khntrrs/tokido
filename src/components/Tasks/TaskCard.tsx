import React, { useState } from 'react';
import { 
  Clock, 
  User, 
  Calendar, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatDate, formatDuration, isOverdue, getTimeUntilDeadline } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { state, dispatch } = useApp();
  const { user } = state;
  const [timerElapsed, setTimerElapsed] = useState(0);

  const isAssignee = task.assigneeId === user?.id;
  const isManager = user?.role === 'manager';
  const canEdit = isAssignee || isManager;
  const canApprove = isManager && task.status === 'completed';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-purple-100 text-purple-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartTimer = () => {
    const now = new Date().toISOString();
    dispatch({ 
      type: 'SET_TIMER', 
      payload: { taskId: task.id, timerStarted: now } 
    });
  };

  const handleStopTimer = () => {
    if (task.timerStarted) {
      const timeSpent = Math.floor((Date.now() - new Date(task.timerStarted).getTime()) / 60000);
      dispatch({ 
        type: 'STOP_TIMER', 
        payload: { taskId: task.id, timeSpent } 
      });
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    const updatedTask: Task = {
      ...task,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const handleApprove = () => {
    const updatedTask: Task = {
      ...task,
      status: 'approved',
      updatedAt: new Date().toISOString(),
      approvalNotes: 'Task approved',
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  const handleReject = () => {
    const updatedTask: Task = {
      ...task,
      status: 'rejected',
      updatedAt: new Date().toISOString(),
      approvalNotes: 'Task requires revision',
    };
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
        </div>
        {canEdit && (
          <button
            onClick={() => onEdit?.(task)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className={isOverdue(task.deadline) ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.deadline)}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(task.timeSpent)}</span>
          </div>
        </div>
        <div className={`text-xs font-medium ${isOverdue(task.deadline) ? 'text-red-600' : 'text-gray-500'}`}>
          {getTimeUntilDeadline(task.deadline)}
        </div>
      </div>

      {isAssignee && (
        <div className="flex items-center space-x-2 mb-4">
          {task.timerStarted ? (
            <button
              onClick={handleStopTimer}
              className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <PauseCircle className="w-4 h-4" />
              <span>Stop Timer</span>
            </button>
          ) : (
            <button
              onClick={handleStartTimer}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Start Timer</span>
            </button>
          )}

          {task.status === 'in-progress' && (
            <button
              onClick={() => handleStatusChange('completed')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete</span>
            </button>
          )}
        </div>
      )}

      {canApprove && (
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={handleApprove}
            className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve</span>
          </button>
          <button
            onClick={handleReject}
            className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {isAssignee ? 'Assigned to you' : 'Assigned by you'}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{task.comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
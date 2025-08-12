import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  UserPlus, 
  MessageSquare,
  X,
  Check,
  Eye,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDateTime } from '../../utils/dateUtils';

const Notifications: React.FC = () => {
  const { state, dispatch } = useApp();
  const { notifications } = state;

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task-assigned':
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'task-deadline':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'task-approved':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'task-rejected':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'clock-reminder':
        return <Clock className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task-assigned':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'task-deadline':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      case 'task-approved':
        return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
      case 'task-rejected':
        return 'bg-red-50 border-red-200 hover:bg-red-100';
      case 'clock-reminder':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const handleMarkAllAsRead = () => {
    unreadNotifications.forEach(notification => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notification.id });
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: notificationId });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your tasks and team activities
          </p>
        </div>
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Unread</p>
              <p className="text-2xl font-bold text-orange-600">{unreadNotifications.length}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Read</p>
              <p className="text-2xl font-bold text-emerald-600">{readNotifications.length}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {/* Unread Notifications */}
        {unreadNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Unread ({unreadNotifications.length})</h2>
            <div className="space-y-3">
              {unreadNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border-2 transition-all ${getNotificationColor(notification.type)}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          <p className="text-gray-700 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{formatDateTime(notification.createdAt)}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifications.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Read ({readNotifications.length})</h2>
            <div className="space-y-3">
              {readNotifications.map(notification => (
                <div
                  key={notification.id}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all opacity-75"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1 opacity-60">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-700">{notification.title}</h3>
                          <p className="text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-sm text-gray-500 mt-2">{formatDateTime(notification.createdAt)}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-4"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You'll see notifications about tasks, deadlines, and team updates here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
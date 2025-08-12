import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  PlayCircle, 
  PauseCircle, 
  StopCircle,
  Calendar,
  TrendingUp,
  Timer,
  Coffee,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTime, formatDuration, calculateHours } from '../../utils/dateUtils';

const TimeTracker: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user, currentTimeLog, timeLogs, tasks } = state;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionElapsed, setSessionElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (currentTimeLog) {
        const elapsed = Math.floor((Date.now() - new Date(currentTimeLog.clockIn).getTime()) / 1000);
        setSessionElapsed(elapsed);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTimeLog]);

  const todayLogs = timeLogs.filter(log => 
    log.userId === user?.id && 
    log.date === new Date().toISOString().split('T')[0]
  );

  const totalHoursToday = todayLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);
  const weeklyLogs = timeLogs.filter(log => {
    const logDate = new Date(log.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return log.userId === user?.id && logDate >= weekStart;
  });
  const totalHoursWeek = weeklyLogs.reduce((sum, log) => sum + (log.totalHours || 0), 0);

  const handleClockIn = () => {
    const now = new Date().toISOString();
    const timeLog = {
      id: Date.now().toString(),
      userId: user?.id || '',
      clockIn: now,
      date: new Date().toISOString().split('T')[0],
      tasks: [],
    };
    
    dispatch({ type: 'CLOCK_IN', payload: timeLog });
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      userId: user?.id || '',
      type: 'clock-reminder' as const,
      title: 'Clocked In',
      message: `You clocked in at ${formatTime(now)}`,
      read: false,
      createdAt: now,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const handleClockOut = () => {
    if (!currentTimeLog) return;

    const now = new Date().toISOString();
    const totalHours = calculateHours(currentTimeLog.clockIn, now);
    
    const updatedLog = {
      ...currentTimeLog,
      clockOut: now,
      totalHours,
    };
    
    dispatch({ type: 'CLOCK_OUT', payload: updatedLog });
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      userId: user?.id || '',
      type: 'clock-reminder' as const,
      title: 'Clocked Out',
      message: `You clocked out at ${formatTime(now)}. Total hours: ${totalHours.toFixed(2)}h`,
      read: false,
      createdAt: now,
    };
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const recentLogs = timeLogs
    .filter(log => log.userId === user?.id && log.clockOut)
    .sort((a, b) => new Date(b.clockIn).getTime() - new Date(a.clockIn).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Time Tracking</h1>
        <p className="text-gray-600">Track your work hours and manage your time effectively</p>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-center">
          <div className="mb-6">
            <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {currentTimeLog ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 font-medium">Currently Clocked In</span>
                </div>
                <div className="text-2xl font-mono font-bold text-green-800">
                  {formatElapsedTime(sessionElapsed)}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  Started at {formatTime(currentTimeLog.clockIn)}
                </div>
              </div>
              
              <button
                onClick={handleClockOut}
                className="flex items-center justify-center space-x-2 bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                <StopCircle className="w-5 h-5" />
                <span>Clock Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 font-medium">Ready to Work</span>
                </div>
                <div className="text-gray-500">Click to start tracking your time</div>
              </div>
              
              <button
                onClick={handleClockIn}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Clock In</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Today</p>
              <p className="text-2xl font-bold text-gray-900">{totalHoursToday.toFixed(1)}h</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Timer className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{totalHoursWeek.toFixed(1)}h</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Average/Day</p>
              <p className="text-2xl font-bold text-gray-900">
                {weeklyLogs.length > 0 ? (totalHoursWeek / Math.max(weeklyLogs.length, 1)).toFixed(1) : '0.0'}h
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Time Logs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Time Logs</h3>
        
        {recentLogs.length === 0 ? (
          <div className="text-center py-8">
            <Coffee className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No time logs yet</p>
            <p className="text-sm text-gray-400">Start tracking your time to see logs here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatTime(log.clockIn)} - {log.clockOut ? formatTime(log.clockOut) : 'In progress'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{log.totalHours?.toFixed(2)}h</p>
                  <p className="text-sm text-gray-500">{log.tasks.length} tasks</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;
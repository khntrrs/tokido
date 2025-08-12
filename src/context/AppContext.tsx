import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Task, TimeLog, Notification } from '../types';

interface AppState {
  user: User | null;
  tasks: Task[];
  timeLogs: TimeLog[];
  notifications: Notification[];
  currentTimeLog: TimeLog | null;
  isAuthenticated: boolean;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'CLOCK_IN'; payload: TimeLog }
  | { type: 'CLOCK_OUT'; payload: TimeLog }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'SET_TIMER'; payload: { taskId: string; timerStarted: string } }
  | { type: 'STOP_TIMER'; payload: { taskId: string; timeSpent: number } };

const initialState: AppState = {
  user: null,
  tasks: [],
  timeLogs: [],
  notifications: [],
  currentTimeLog: null,
  isAuthenticated: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'CLOCK_IN':
      return {
        ...state,
        currentTimeLog: action.payload,
        timeLogs: [...state.timeLogs, action.payload],
      };
    case 'CLOCK_OUT':
      return {
        ...state,
        currentTimeLog: null,
        timeLogs: state.timeLogs.map(log => 
          log.id === action.payload.id ? action.payload : log
        ),
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif => 
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
    case 'SET_TIMER':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId 
            ? { ...task, timerStarted: action.payload.timerStarted, status: 'in-progress' }
            : task
        ),
      };
    case 'STOP_TIMER':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.taskId 
            ? { 
                ...task, 
                timerStarted: undefined, 
                timeSpent: task.timeSpent + action.payload.timeSpent,
                updatedAt: new Date().toISOString()
              }
            : task
        ),
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('tokido-user');
    const savedTasks = localStorage.getItem('tokido-tasks');
    const savedTimeLogs = localStorage.getItem('tokido-timelogs');
    const savedNotifications = localStorage.getItem('tokido-notifications');
    
    if (savedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(savedUser) });
    }
    
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach((task: Task) => {
        dispatch({ type: 'ADD_TASK', payload: task });
      });
    }
    
    if (savedTimeLogs) {
      const timeLogs = JSON.parse(savedTimeLogs);
      timeLogs.forEach((log: TimeLog) => {
        if (!log.clockOut) {
          dispatch({ type: 'CLOCK_IN', payload: log });
        }
      });
    }
    
    if (savedNotifications) {
      const notifications = JSON.parse(savedNotifications);
      notifications.forEach((notification: Notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
      });
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('tokido-user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('tokido-user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('tokido-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  useEffect(() => {
    localStorage.setItem('tokido-timelogs', JSON.stringify(state.timeLogs));
  }, [state.timeLogs]);

  useEffect(() => {
    localStorage.setItem('tokido-notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
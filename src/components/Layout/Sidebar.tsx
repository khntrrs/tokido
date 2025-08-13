import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Users,
  Timer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const { state, dispatch } = useApp();
  const { user } = state;

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'time', label: 'Time Tracking', icon: Clock },
    ...(user?.role === 'manager' ? [{ id: 'team', label: 'Team', icon: Users }] : []),
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="bg-white h-full w-64 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Timer className="w-6 h-6 text-white" />
          </div> */}
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <img
              src="https://i.ibb.co/j9v9VGGs/logo-Tokido.png" 
              alt="App Logo"
              className="w-10 h-10 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tokido</h1>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'notifications' && state.notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {state.notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onViewChange('settings')}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
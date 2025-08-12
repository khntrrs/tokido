import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import TaskList from './components/Tasks/TaskList';
import TimeTracker from './components/TimeTracking/TimeTracker';
import TeamManagement from './components/Team/TeamManagement';
import Reports from './components/Reports/Reports';
import Notifications from './components/Notifications/Notifications';
import Settings from './components/Settings/Settings';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [activeView, setActiveView] = useState('dashboard');

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <TaskList />;
      case 'time':
        return <TimeTracker />;
      case 'team':
        return <TeamManagement />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
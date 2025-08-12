import React, { useState } from 'react';
import { LogIn, User, Mail, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockUsers, generateMockTasks, generateMockTimeLogs, generateMockNotifications } from '../../utils/mockData';

const LoginForm: React.FC = () => {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'manager' | 'member'>('member');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role,
        joinDate: new Date().toISOString(),
      };
      
      dispatch({ type: 'LOGIN', payload: newUser });
      
      // Generate mock data for new user
      const tasks = generateMockTasks(newUser.id, role);
      const timeLogs = generateMockTimeLogs(newUser.id);
      const notifications = generateMockNotifications(newUser.id);
      
      tasks.forEach(task => dispatch({ type: 'ADD_TASK', payload: task }));
      notifications.forEach(notif => dispatch({ type: 'ADD_NOTIFICATION', payload: notif }));
    } else {
      // Demo login
      const demoUser = mockUsers.find(user => user.email === email) || mockUsers[1];
      dispatch({ type: 'LOGIN', payload: demoUser });
      
      // Generate mock data
      const tasks = generateMockTasks(demoUser.id, demoUser.role);
      const timeLogs = generateMockTimeLogs(demoUser.id);
      const notifications = generateMockNotifications(demoUser.id);
      
      tasks.forEach(task => dispatch({ type: 'ADD_TASK', payload: task }));
      notifications.forEach(notif => dispatch({ type: 'ADD_NOTIFICATION', payload: notif }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Tokido</h1>
          <p className="text-gray-600">Project management made simple</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
              required
            />
            {!isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Try: sarah@tokido.com (Manager) or mike@tokido.com (Member)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="member"
                    checked={role === 'member'}
                    onChange={(e) => setRole(e.target.value as 'member')}
                    className="mr-2"
                  />
                  Member
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="manager"
                    checked={role === 'manager'}
                    onChange={(e) => setRole(e.target.value as 'manager')}
                    className="mr-2"
                  />
                  Manager
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
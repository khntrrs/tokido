import { User, Task, TimeLog, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@tokido.com',
    role: 'manager',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@tokido.com',
    role: 'member',
    joinDate: '2024-02-01',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@tokido.com',
    role: 'member',
    joinDate: '2024-02-15',
  },
];

export const generateMockTasks = (userId: string, userRole: 'manager' | 'member'): Task[] => {
  const baseTasks: Omit<Task, 'assigneeId' | 'assignerId'>[] = [
    {
      id: '1',
      title: 'Design Homepage Layout',
      description: 'Create a modern, responsive homepage design for the new website',
      deadline: '2024-12-25T17:00:00',
      status: 'in-progress',
      priority: 'high',
      timeSpent: 120,
      createdAt: '2024-12-20T09:00:00',
      updatedAt: '2024-12-20T14:30:00',
      comments: [],
    },
    {
      id: '2',
      title: 'User Authentication API',
      description: 'Implement secure user authentication endpoints',
      deadline: '2024-12-28T12:00:00',
      status: 'pending',
      priority: 'medium',
      timeSpent: 0,
      createdAt: '2024-12-19T10:00:00',
      updatedAt: '2024-12-19T10:00:00',
      comments: [],
    },
    {
      id: '3',
      title: 'Database Migration',
      description: 'Update database schema for new features',
      deadline: '2024-12-30T15:00:00',
      status: 'completed',
      priority: 'low',
      timeSpent: 90,
      createdAt: '2024-12-18T08:00:00',
      updatedAt: '2024-12-21T16:00:00',
      comments: [],
    },
  ];

  if (userRole === 'manager') {
    return baseTasks.map(task => ({
      ...task,
      assigneeId: '2', // Assign to Mike
      assignerId: userId,
    }));
  } else {
    return baseTasks.map(task => ({
      ...task,
      assigneeId: userId,
      assignerId: '1', // Assigned by Sarah
    }));
  }
};

export const generateMockTimeLogs = (userId: string): TimeLog[] => [
  {
    id: '1',
    userId,
    clockIn: '2024-12-21T09:00:00',
    clockOut: '2024-12-21T17:30:00',
    totalHours: 8.5,
    date: '2024-12-21',
    tasks: ['1', '2'],
  },
  {
    id: '2',
    userId,
    clockIn: '2024-12-20T08:30:00',
    clockOut: '2024-12-20T16:45:00',
    totalHours: 8.25,
    date: '2024-12-20',
    tasks: ['1'],
  },
];

export const generateMockNotifications = (userId: string): Notification[] => [
  {
    id: '1',
    userId,
    type: 'task-assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned to "Design Homepage Layout"',
    read: false,
    createdAt: '2024-12-21T10:00:00',
  },
  {
    id: '2',
    userId,
    type: 'task-deadline',
    title: 'Deadline Reminder',
    message: 'Task "User Authentication API" is due in 2 days',
    read: true,
    createdAt: '2024-12-21T09:00:00',
  },
];
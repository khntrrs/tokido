export interface User {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'member';
  avatar?: string;
  joinDate: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assignerId: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  timeSpent: number; // in minutes
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  timerStarted?: string;
  approvalNotes?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface TimeLog {
  id: string;
  userId: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  date: string;
  tasks: string[]; // task IDs worked on
}

export interface MonthlyReport {
  id: string;
  userId: string;
  month: string;
  year: number;
  totalHours: number;
  tasksCompleted: number;
  tasksAssigned: number;
  averageTaskTime: number;
  performance: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement';
  tasks: Task[];
  timeLogs: TimeLog[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task-assigned' | 'task-deadline' | 'task-approved' | 'task-rejected' | 'clock-reminder';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
import { Student, CallLog, User, DashboardStats, AttendanceData, GradeData } from '@/types';

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Verma',
    class: '10A',
    section: 'A',
    attendance: 62,
    grade: 'B',
    riskLevel: 'high',
    riskScore: 85,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'rahul.verma@school.edu',
    parentEmail: 'parent.verma@email.com',
    lastCallStatus: 'completed',
    lastCallDate: '2025-01-15',
    notes: 'Student showing signs of disengagement. Parent meeting scheduled.'
  },
  {
    id: '2',
    name: 'Sara Patel',
    class: '12C',
    section: 'C',
    attendance: 89,
    grade: 'A',
    riskLevel: 'low',
    riskScore: 25,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'sara.patel@school.edu',
    parentEmail: 'parent.patel@email.com'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    class: '11B',
    section: 'B',
    attendance: 74,
    grade: 'C',
    riskLevel: 'medium',
    riskScore: 55,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'amit.kumar@school.edu',
    parentEmail: 'parent.kumar@email.com',
    lastCallStatus: 'no-answer',
    lastCallDate: '2025-01-14'
  },
  {
    id: '4',
    name: 'Priya Sharma',
    class: '9A',
    section: 'A',
    attendance: 45,
    grade: 'D',
    riskLevel: 'high',
    riskScore: 92,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'priya.sharma@school.edu',
    parentEmail: 'parent.sharma@email.com',
    lastCallStatus: 'scheduled',
    lastCallDate: '2025-01-16'
  },
  {
    id: '5',
    name: 'Ravi Gupta',
    class: '10B',
    section: 'B',
    attendance: 91,
    grade: 'A',
    riskLevel: 'low',
    riskScore: 15,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'ravi.gupta@school.edu',
    parentEmail: 'parent.gupta@email.com'
  },
  {
    id: '6',
    name: 'Sneha Singh',
    class: '11A',
    section: 'A',
    attendance: 68,
    grade: 'B',
    riskLevel: 'medium',
    riskScore: 48,
    phone: '7013271894',
    parentPhone: '7013271894',
    email: 'sneha.singh@school.edu',
    parentEmail: 'parent.singh@email.com',
    lastCallStatus: 'failed',
    lastCallDate: '2025-01-13'
  }
];

export const mockCallLogs: CallLog[] = [
  {
    id: '1',
    date: '2025-01-15',
    studentId: '1',
    studentName: 'Rahul Verma',
    callType: 'parent',
    agentType: 'AI Counselor',
    outcome: 'completed',
    duration: 320,
    notes: 'Parent expressed concern about recent behavior changes. Scheduled in-person meeting.'
  },
  {
    id: '2',
    date: '2025-01-14',
    studentId: '3',
    studentName: 'Amit Kumar',
    callType: 'student',
    agentType: 'AI Mentor',
    outcome: 'no-answer',
    duration: 0,
    notes: 'No response. Will try again tomorrow.'
  },
  {
    id: '3',
    date: '2025-01-14',
    studentId: '2',
    studentName: 'Sara Patel',
    callType: 'parent',
    agentType: 'AI Counselor',
    outcome: 'completed',
    duration: 180,
    notes: 'Positive discussion about academic progress. No concerns noted.'
  },
  {
    id: '4',
    date: '2025-01-13',
    studentId: '6',
    studentName: 'Sneha Singh',
    callType: 'mentor',
    agentType: 'AI Support',
    outcome: 'failed',
    duration: 0,
    notes: 'Phone number not reachable. Need to update contact information.'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Anita Sharma',
    role: 'admin',
    email: 'admin@school.edu',
    phone: '9812345001'
  },
  {
    id: '2',
    name: 'Meera Patel',
    role: 'counselor',
    email: 'counselor@school.edu',
    phone: '9812345003'
  },
  {
    id: '3',
    name: 'Vikram Singh',
    role: 'mentor',
    email: 'mentor@school.edu',
    phone: '9812345004'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalStudents: 150,
  highRiskStudents: 23,
  averageAttendance: 76.5,
  callsToday: 8,
  successfulCalls: 6
};

export const mockAttendanceData: AttendanceData[] = [
  { month: 'Apr', attendance: 85 },
  { month: 'May', attendance: 78 },
  { month: 'Jun', attendance: 82 },
  { month: 'Jul', attendance: 75 },
  { month: 'Aug', attendance: 68 },
  { month: 'Sep', attendance: 62 },
  { month: 'Oct', attendance: 58 },
  { month: 'Nov', attendance: 55 },
  { month: 'Dec', attendance: 52 }
];

export const mockGradeData: GradeData[] = [
  { subject: 'Mathematics', grade: 65, maxGrade: 100 },
  { subject: 'Science', grade: 72, maxGrade: 100 },
  { subject: 'English', grade: 58, maxGrade: 100 },
  { subject: 'Social Studies', grade: 61, maxGrade: 100 },
  { subject: 'Hindi', grade: 75, maxGrade: 100 }
];
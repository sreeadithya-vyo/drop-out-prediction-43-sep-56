export type UserRole = 'admin' | 'counselor' | 'mentor';

export type RiskLevel = 'low' | 'medium' | 'high';

export type CallStatus = 'completed' | 'no-answer' | 'scheduled' | 'failed';

export type Student = {
  id: string;
  name: string;
  class: string;
  section?: string;
  attendance: number;
  grade: string;
  riskLevel: RiskLevel;
  riskScore: number;
  phone: string;
  parentPhone?: string;
  mentorPhone?: string;
  email?: string;
  parentEmail?: string;
  lastCallStatus?: CallStatus;
  lastCallDate?: string;
  notes?: string;
};

export type CallLog = {
  id: string;
  date: string;
  studentId: string;
  studentName: string;
  callType: 'parent' | 'student' | 'mentor';
  agentType: string;
  outcome: CallStatus;
  duration?: number;
  notes?: string;
};

export type User = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
};

export type DashboardStats = {
  totalStudents: number;
  highRiskStudents: number;
  averageAttendance: number;
  callsToday: number;
  successfulCalls: number;
};

export type AttendanceData = {
  month: string;
  attendance: number;
};

export type GradeData = {
  subject: string;
  grade: number;
  maxGrade: number;
};
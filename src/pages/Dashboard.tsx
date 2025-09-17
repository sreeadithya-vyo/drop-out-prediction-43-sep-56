import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockStudents, mockDashboardStats } from '@/data/mockData';
import { RiskBadge } from '@/components/common/RiskBadge';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Phone,
  Search,
  Filter,
  CheckCircle
} from 'lucide-react';
import { Student, RiskLevel } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [callType, setCallType] = useState<'parent' | 'student' | 'mentor'>('parent');

  // Filter students based on search and filters
  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    
    return matchesSearch && matchesRisk && matchesClass;
  });

  const uniqueClasses = [...new Set(mockStudents.map(s => s.class))];

  const handleCallClick = (student: Student, type: 'parent' | 'student' | 'mentor') => {
    setSelectedStudent(student);
    setCallType(type);
    setCallDialogOpen(true);
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
  };

  const getCallButtonText = (type: 'parent' | 'student' | 'mentor') => {
    switch(type) {
      case 'parent': return 'Call Parent';
      case 'student': return 'Call Student';
      case 'mentor': return 'Call Mentor';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-white/80">
          Here's your overview of student risk assessments and recent activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active in system</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-risk-high" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-risk-high">{mockDashboardStats.highRiskStudents}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.averageAttendance}%</div>
            <p className="text-xs text-muted-foreground">School-wide average</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDashboardStats.successfulCalls}/{mockDashboardStats.callsToday}</div>
            <p className="text-xs text-muted-foreground">Successful calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Risk Assessment</CardTitle>
              <CardDescription>Monitor and manage student dropout risks</CardDescription>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={riskFilter} onValueChange={(value) => setRiskFilter(value as RiskLevel | 'all')}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>

              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student Name</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Attendance</th>
                  <th className="text-left p-3 font-medium">Grade</th>
                  <th className="text-left p-3 font-medium">Risk Level</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                  <th className="text-left p-3 font-medium">Last Call</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <button
                        onClick={() => handleStudentClick(student.id)}
                        className="text-left hover:text-primary transition-colors"
                      >
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </button>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{student.class}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          student.attendance >= 80 ? 'bg-risk-low' :
                          student.attendance >= 60 ? 'bg-risk-medium' : 'bg-risk-high'
                        }`} />
                        {student.attendance}%
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{student.grade}</Badge>
                    </td>
                    <td className="p-3">
                      <RiskBadge risk={student.riskLevel} />
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {student.phone}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallClick(student, 'parent')}
                          className="text-xs"
                        >
                          Parent
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallClick(student, 'student')}
                          className="text-xs"
                        >
                          Student
                        </Button>
                      </div>
                    </td>
                    <td className="p-3">
                      {student.lastCallStatus && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className={`w-3 h-3 ${
                            student.lastCallStatus === 'completed' ? 'text-risk-low' :
                            student.lastCallStatus === 'scheduled' ? 'text-risk-medium' : 'text-risk-high'
                          }`} />
                          <span className="text-xs capitalize">{student.lastCallStatus}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Call Dialog */}
      <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>AI Counseling Call</DialogTitle>
            <DialogDescription>
              Initiating {getCallButtonText(callType).toLowerCase()} for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Simulated AI Call</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This is a demonstration of how the AI counseling system would work. 
                In a real implementation, this would connect to the AI voice agent.
              </p>
              
              <div className="bg-primary/10 p-3 rounded border-l-4 border-primary">
                <p className="text-sm">
                  <strong>AI Script Preview:</strong> "Hello, this is an automated call from {selectedStudent?.name}'s school. 
                  We're reaching out because we care about {selectedStudent?.name}'s academic progress and want to ensure 
                  they have all the support they need to succeed..."
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                onClick={() => {
                  setCallDialogOpen(false);
                  if (selectedStudent) {
                    navigate('/voice-call', { 
                      state: { 
                        student: selectedStudent, 
                        callType: callType 
                      } 
                    });
                  }
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Call
              </Button>
              <Button variant="outline" onClick={() => setCallDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
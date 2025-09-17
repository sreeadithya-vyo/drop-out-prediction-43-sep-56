import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { mockStudents, mockAttendanceData, mockGradeData } from '@/data/mockData';
import { RiskBadge } from '@/components/common/RiskBadge';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar,
  TrendingDown,
  BookOpen,
  Users,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Students() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">All Students</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockStudents.map((student) => (
            <Card key={student.id} className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer"
                  onClick={() => navigate(`/students/${student.id}`)}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <CardDescription>{student.email}</CardDescription>
                  </div>
                  <RiskBadge risk={student.riskLevel} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Class:</span>
                    <Badge variant="outline">{student.class}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Attendance:</span>
                    <span className={student.attendance >= 75 ? 'text-risk-low' : 
                                   student.attendance >= 60 ? 'text-risk-medium' : 'text-risk-high'}>
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Grade:</span>
                    <Badge variant="secondary">{student.grade}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const student = mockStudents.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Student Not Found</h2>
        <Button onClick={() => navigate('/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/students')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground">{student.email}</p>
        </div>
        <div className="ml-auto">
          <RiskBadge risk={student.riskLevel} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Class:</span>
                  <Badge variant="outline">{student.class} {student.section}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Grade:</span>
                  <Badge variant="secondary">{student.grade}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Score:</span>
                  <span className="font-medium">{student.riskScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Attendance:</span>
                  <span className={student.attendance >= 75 ? 'text-risk-low' : 
                                 student.attendance >= 60 ? 'text-risk-medium' : 'text-risk-high'}>
                    {student.attendance}%
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                {student.parentPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>Parent: {student.parentPhone}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate('/voice-call', { 
                    state: { 
                      student: student, 
                      callType: 'student' 
                    } 
                  })}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Student
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate('/voice-call', { 
                    state: { 
                      student: student, 
                      callType: 'parent' 
                    } 
                  })}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Parent
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Risk Analysis */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium mb-2">Key Risk Factors:</div>
                  <ul className="space-y-1 text-muted-foreground">
                    {student.attendance < 70 && (
                      <li>• Low attendance pattern detected</li>
                    )}
                    {student.grade === 'D' && (
                      <li>• Poor academic performance</li>
                    )}
                    {student.riskScore > 70 && (
                      <li>• Behavioral changes noted</li>
                    )}
                    <li>• Lack of parent engagement</li>
                  </ul>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium mb-2">Recommendations:</div>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Schedule parent-teacher meeting</li>
                    <li>• Implement tutoring support</li>
                    <li>• Regular counseling sessions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Trend */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Attendance Trend
              </CardTitle>
              <CardDescription>Monthly attendance percentage over the academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockAttendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Grade Performance */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Grade Performance
              </CardTitle>
              <CardDescription>Current performance across different subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockGradeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="grade" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Counseling Log */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Counseling Notes
              </CardTitle>
              <CardDescription>Add notes and track counseling sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.notes && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Previous Notes:</div>
                  <p className="text-sm text-muted-foreground">{student.notes}</p>
                </div>
              )}
              
              <div>
                <Textarea 
                  placeholder="Add new counseling notes..."
                  className="min-h-[100px]"
                />
                <Button className="mt-2" size="sm">
                  Save Note
                </Button>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Counseling History:</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <div>
                      <div className="text-sm font-medium">Parent Meeting</div>
                      <div className="text-xs text-muted-foreground">Jan 15, 2025</div>
                    </div>
                    <Badge variant="outline" className="text-xs">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                    <div>
                      <div className="text-sm font-medium">Student Counseling</div>
                      <div className="text-xs text-muted-foreground">Jan 12, 2025</div>
                    </div>
                    <Badge variant="outline" className="text-xs">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
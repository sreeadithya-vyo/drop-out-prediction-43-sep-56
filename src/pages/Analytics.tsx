import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Phone,
  Target,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const riskDistributionData = [
  { name: 'Low Risk', value: 68, color: 'hsl(var(--risk-low))' },
  { name: 'Medium Risk', value: 59, color: 'hsl(var(--risk-medium))' },
  { name: 'High Risk', value: 23, color: 'hsl(var(--risk-high))' }
];

const attendanceTrendData = [
  { month: 'Jan', average: 82, target: 85 },
  { month: 'Feb', average: 79, target: 85 },
  { month: 'Mar', average: 84, target: 85 },
  { month: 'Apr', average: 81, target: 85 },
  { month: 'May', average: 78, target: 85 },
  { month: 'Jun', average: 75, target: 85 },
  { month: 'Jul', average: 73, target: 85 },
  { month: 'Aug', average: 71, target: 85 },
  { month: 'Sep', average: 69, target: 85 }
];

const classPerformanceData = [
  { class: '9A', students: 28, highRisk: 5, avgAttendance: 72 },
  { class: '9B', students: 30, highRisk: 3, avgAttendance: 78 },
  { class: '10A', students: 32, highRisk: 7, avgAttendance: 68 },
  { class: '10B', students: 29, highRisk: 4, avgAttendance: 75 },
  { class: '11A', students: 27, highRisk: 2, avgAttendance: 82 },
  { class: '11B', students: 31, highRisk: 6, avgAttendance: 71 },
  { class: '12A', students: 25, highRisk: 1, avgAttendance: 87 },
  { class: '12B', students: 28, highRisk: 3, avgAttendance: 83 }
];

const interventionEffectivenessData = [
  { type: 'Parent Calls', attempted: 45, successful: 38, effectiveness: 84 },
  { type: 'Student Counseling', attempted: 32, successful: 29, effectiveness: 91 },
  { type: 'Mentor Support', attempted: 18, successful: 15, effectiveness: 83 },
  { type: 'Tutoring Program', attempted: 12, successful: 11, effectiveness: 92 }
];

export default function Analytics() {
  const totalStudents = classPerformanceData.reduce((sum, cls) => sum + cls.students, 0);
  const totalHighRisk = classPerformanceData.reduce((sum, cls) => sum + cls.highRisk, 0);
  const avgAttendance = Math.round(classPerformanceData.reduce((sum, cls) => sum + cls.avgAttendance, 0) / classPerformanceData.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into student performance and intervention effectiveness
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalStudents}</div>
                <div className="text-xs text-muted-foreground">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-risk-high" />
              <div>
                <div className="text-2xl font-bold text-risk-high">{totalHighRisk}</div>
                <div className="text-xs text-muted-foreground">High Risk Students</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-warning" />
              <div>
                <div className="text-2xl font-bold">{avgAttendance}%</div>
                <div className="text-xs text-muted-foreground">Avg Attendance</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-risk-low" />
              <div>
                <div className="text-2xl font-bold text-risk-low">87%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Risk Level Distribution
            </CardTitle>
            <CardDescription>Current distribution of student risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {riskDistributionData.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{item.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Attendance Trends
            </CardTitle>
            <CardDescription>Monthly average attendance vs target</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[65, 90]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="average" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.1}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="hsl(var(--risk-low))" 
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Performance */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Class Performance Overview
          </CardTitle>
          <CardDescription>Performance metrics by class section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Total Students</th>
                  <th className="text-left p-3 font-medium">High Risk</th>
                  <th className="text-left p-3 font-medium">Risk Percentage</th>
                  <th className="text-left p-3 font-medium">Avg Attendance</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {classPerformanceData.map((cls) => {
                  const riskPercentage = Math.round((cls.highRisk / cls.students) * 100);
                  const status = riskPercentage > 20 ? 'critical' : 
                                riskPercentage > 10 ? 'warning' : 'good';
                  
                  return (
                    <tr key={cls.class} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <Badge variant="outline" className="font-medium">{cls.class}</Badge>
                      </td>
                      <td className="p-3">{cls.students}</td>
                      <td className="p-3">
                        <span className="text-risk-high font-medium">{cls.highRisk}</span>
                      </td>
                      <td className="p-3">{riskPercentage}%</td>
                      <td className="p-3">
                        <span className={cls.avgAttendance >= 80 ? 'text-risk-low' : 
                                       cls.avgAttendance >= 70 ? 'text-risk-medium' : 'text-risk-high'}>
                          {cls.avgAttendance}%
                        </span>
                      </td>
                      <td className="p-3">
                        <Badge className={
                          status === 'good' ? 'bg-risk-low text-white' :
                          status === 'warning' ? 'bg-risk-medium text-white' : 'bg-risk-high text-white'
                        }>
                          {status === 'good' ? 'Good' : status === 'warning' ? 'Monitor' : 'Critical'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Intervention Effectiveness */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Intervention Effectiveness
          </CardTitle>
          <CardDescription>Success rates of different intervention strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interventionEffectivenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="effectiveness" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {interventionEffectivenessData.map((intervention, index) => (
              <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-lg font-bold text-primary">{intervention.effectiveness}%</div>
                <div className="text-sm text-muted-foreground mb-2">{intervention.type}</div>
                <div className="text-xs text-muted-foreground">
                  {intervention.successful}/{intervention.attempted} successful
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Data-driven insights and suggested actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-risk-high/10 rounded-lg border-l-4 border-risk-high">
              <AlertTriangle className="w-5 h-5 text-risk-high mt-0.5" />
              <div>
                <div className="font-medium text-risk-high">Urgent Action Required</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Class 10A has 7 high-risk students (22% of class). Immediate intervention recommended.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-risk-medium/10 rounded-lg border-l-4 border-risk-medium">
              <TrendingDown className="w-5 h-5 text-risk-medium mt-0.5" />
              <div>
                <div className="font-medium text-risk-medium">Declining Trend Alert</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Overall attendance has dropped 13% over the last 8 months. Consider school-wide initiatives.
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-risk-low/10 rounded-lg border-l-4 border-risk-low">
              <TrendingUp className="w-5 h-5 text-risk-low mt-0.5" />
              <div>
                <div className="font-medium text-risk-low">Success Story</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Student counseling has 91% effectiveness. Consider expanding this program.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
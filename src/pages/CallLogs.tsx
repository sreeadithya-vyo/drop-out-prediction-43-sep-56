import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCallLogs, mockStudents } from '@/data/mockData';
import { 
  Phone, 
  Search, 
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  TrendingUp
} from 'lucide-react';
import { CallStatus } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function CallLogs() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CallStatus | 'all'>('all');
  const [callTypeFilter, setCallTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const filteredLogs = mockCallLogs.filter((log) => {
    const matchesSearch = log.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.agentType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.outcome === statusFilter;
    const matchesType = callTypeFilter === 'all' || log.callType === callTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusIcon = (status: CallStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-risk-low" />;
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-risk-medium" />;
      case 'no-answer':
        return <AlertCircle className="w-4 h-4 text-risk-medium" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-risk-high" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-risk-low text-white';
      case 'scheduled':
        return 'bg-risk-medium text-white';
      case 'no-answer':
        return 'bg-warning text-white';
      case 'failed':
        return 'bg-risk-high text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const initiateVoiceCall = (studentName: string, callType: string) => {
    const student = mockStudents.find(s => s.name === studentName);
    if (!student) {
      toast({
        title: "Error",
        description: "Student not found",
        variant: "destructive",
      });
      return;
    }

    navigate('/voice-call', { 
      state: { 
        student: student, 
        callType: callType as 'parent' | 'student' | 'mentor'
      } 
    });
  };

  const getPhoneNumber = (log: any, callType: string) => {
    // Find student data to get phone numbers
    const student = mockStudents.find(s => s.name === log.studentName);
    if (!student) return null;
    
    switch (callType) {
      case 'parent':
        return student.parentPhone;
      case 'student':
        return student.phone;
      default:
        return student.phone;
    }
  };

  const stats = {
    totalCalls: mockCallLogs.length,
    successfulCalls: mockCallLogs.filter(log => log.outcome === 'completed').length,
    avgDuration: Math.round(mockCallLogs.filter(log => log.duration).reduce((acc, log) => acc + (log.duration || 0), 0) / mockCallLogs.filter(log => log.duration).length),
    pendingFollowups: mockCallLogs.filter(log => log.outcome === 'no-answer' || log.outcome === 'scheduled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Call Logs</h1>
        <p className="text-muted-foreground">
          Track and manage AI counseling calls and interventions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{stats.totalCalls}</div>
                <div className="text-xs text-muted-foreground">Total Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-risk-low" />
              <div>
                <div className="text-2xl font-bold text-risk-low">{stats.successfulCalls}</div>
                <div className="text-xs text-muted-foreground">Successful</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-2xl font-bold">{formatDuration(stats.avgDuration)}</div>
                <div className="text-xs text-muted-foreground">Avg Duration</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-risk-medium" />
              <div>
                <div className="text-2xl font-bold text-risk-medium">{stats.pendingFollowups}</div>
                <div className="text-xs text-muted-foreground">Follow-ups</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Call History</CardTitle>
              <CardDescription>View and manage all counseling call activities</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search calls..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CallStatus | 'all')}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={callTypeFilter} onValueChange={setCallTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
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
                  <th className="text-left p-3 font-medium">Date & Time</th>
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Call Type</th>
                  <th className="text-left p-3 font-medium">Agent</th>
                  <th className="text-left p-3 font-medium">Duration</th>
                  <th className="text-left p-3 font-medium">Outcome</th>
                  <th className="text-left p-3 font-medium">Notes</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">{new Date(log.date).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{log.studentName}</div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">
                        {log.callType}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {log.agentType}
                    </td>
                    <td className="p-3 text-sm">
                      {log.duration ? formatDuration(log.duration) : '-'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.outcome)}
                        <Badge className={cn(getStatusColor(log.outcome), 'text-xs')}>
                          {log.outcome.replace('-', ' ')}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="text-sm text-muted-foreground truncate">
                        {log.notes || 'No notes'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs">
                          View Details
                        </Button>
                        {log.outcome === 'no-answer' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs"
                            onClick={() => initiateVoiceCall(log.studentName, log.callType)}
                          >
                            Retry Call
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="text-xs"
                          onClick={() => initiateVoiceCall(log.studentName, log.callType)}
                        >
                          Start Voice Call
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Phone className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No call logs found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timeline View */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Activity Timeline
          </CardTitle>
          <CardDescription>Chronological view of recent counseling activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCallLogs.slice(0, 5).map((log, index) => (
              <div key={log.id} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-sm">{log.studentName}</div>
                    <Badge variant="outline" className="text-xs capitalize">{log.callType}</Badge>
                    {getStatusIcon(log.outcome)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {log.agentType} • {new Date(log.date).toLocaleDateString()} • 
                    {log.duration ? ` ${formatDuration(log.duration)}` : ' No duration'}
                  </div>
                  {log.notes && (
                    <div className="text-xs text-muted-foreground mt-1 italic">
                      "{log.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
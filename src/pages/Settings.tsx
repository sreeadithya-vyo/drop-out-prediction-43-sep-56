import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings as SettingsIcon, 
  Users, 
  Download, 
  Globe, 
  Bell,
  Shield,
  FileText,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/data/mockData';

export default function Settings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    dailyReports: false,
    callReminders: true,
    systemUpdates: false
  });
  const [language, setLanguage] = useState('english');

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const downloadTemplate = () => {
    // Same as upload page
    const csvContent = "Student Name,Class,Section,Attendance %,Current Grade,Student Phone,Parent Phone,Parent Email\n" +
                      "John Doe,10A,A,85,B,9812345678,9812345679,parent@email.com\n" +
                      "Jane Smith,11B,B,92,A,9812345680,9812345681,parent2@email.com";
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure system preferences and manage user accounts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management
            </CardTitle>
            <CardDescription>Manage system users and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUsers.map((mockUser) => (
                <div key={mockUser.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{mockUser.name}</div>
                    <div className="text-sm text-muted-foreground">{mockUser.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={mockUser.id === user?.id ? 'bg-primary/10 text-primary' : ''}
                    >
                      {mockUser.role}
                      {mockUser.id === user?.id && ' (You)'}
                    </Badge>
                    <Button size="sm" variant="outline" disabled={mockUser.id === user?.id}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Add New User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Configure alert and notification settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">High Risk Alerts</Label>
                  <div className="text-xs text-muted-foreground">
                    Immediate notifications for high-risk students
                  </div>
                </div>
                <Switch
                  checked={notifications.highRiskAlerts}
                  onCheckedChange={(checked) => handleNotificationChange('highRiskAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Daily Reports</Label>
                  <div className="text-xs text-muted-foreground">
                    Daily summary of student activity
                  </div>
                </div>
                <Switch
                  checked={notifications.dailyReports}
                  onCheckedChange={(checked) => handleNotificationChange('dailyReports', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Call Reminders</Label>
                  <div className="text-xs text-muted-foreground">
                    Reminders for scheduled calls
                  </div>
                </div>
                <Switch
                  checked={notifications.callReminders}
                  onCheckedChange={(checked) => handleNotificationChange('callReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">System Updates</Label>
                  <div className="text-xs text-muted-foreground">
                    Notifications about system changes
                  </div>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language & Localization
            </CardTitle>
            <CardDescription>Configure system language preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">System Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
                    <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-2">Demo Language Preview</div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {language === 'english' && (
                    <>
                      <div>• Dashboard: "Student Risk Assessment"</div>
                      <div>• Call Button: "Call Parent"</div>
                    </>
                  )}
                  {language === 'hindi' && (
                    <>
                      <div>• डैशबोर्ड: "छात्र जोखिम मूल्यांकन"</div>
                      <div>• कॉल बटन: "अभिभावक को कॉल करें"</div>
                    </>
                  )}
                  {language === 'telugu' && (
                    <>
                      <div>• డాష్‌బోర్డ్: "విద్యార్థి రిస్క్ అసెస్‌మెంట్"</div>
                      <div>• కాల్ బటన్: "తల్లిదండ్రులను కాల్ చేయండి"</div>
                    </>
                  )}
                  {language === 'tamil' && (
                    <>
                      <div>• டாஷ்போர்டு: "மாணவர் ஆபத்து மதிப்பீடு"</div>
                      <div>• அழைப்பு பொத்தான்: "பெற்றோரை அழைக்கவும்"</div>
                    </>
                  )}
                </div>
              </div>

              <Button className="w-full" variant="outline">
                Apply Language Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Templates & Export */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>Download templates and manage data exports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full justify-start gap-2" variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4" />
                Download Student Data Template
              </Button>

              <Button className="w-full justify-start gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Export Current Student Data
              </Button>

              <Button className="w-full justify-start gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Export Call Logs Report
              </Button>

              <Button className="w-full justify-start gap-2" variant="outline">
                <Download className="w-4 h-4" />
                Export Analytics Report
              </Button>

              <div className="pt-4 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-3 h-3" />
                  <span>Data exports include privacy protections</span>
                </div>
                <div>All exports are encrypted and logged for security compliance.</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            System Information
          </CardTitle>
          <CardDescription>System status and configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-primary">v2.1.0</div>
              <div className="text-sm text-muted-foreground">System Version</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-risk-low">Online</div>
              <div className="text-sm text-muted-foreground">AI Service Status</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold">15 Jan 2025</div>
              <div className="text-sm text-muted-foreground">Last Backup</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-bold text-risk-low">98.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help & Support */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help & Support
          </CardTitle>
          <CardDescription>Get assistance and access documentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="justify-start gap-2 h-auto p-4" variant="outline">
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">User Documentation</div>
                <div className="text-xs text-muted-foreground">Complete user guide and tutorials</div>
              </div>
            </Button>

            <Button className="justify-start gap-2 h-auto p-4" variant="outline">
              <Mail className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Email Support</div>
                <div className="text-xs text-muted-foreground">Contact: support@edupredict.com</div>
              </div>
            </Button>

            <Button className="justify-start gap-2 h-auto p-4" variant="outline">
              <Phone className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Phone Support</div>
                <div className="text-xs text-muted-foreground">Call: 1-800-EDU-HELP</div>
              </div>
            </Button>

            <Button className="justify-start gap-2 h-auto p-4" variant="outline">
              <HelpCircle className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">FAQ & Troubleshooting</div>
                <div className="text-xs text-muted-foreground">Common questions and solutions</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
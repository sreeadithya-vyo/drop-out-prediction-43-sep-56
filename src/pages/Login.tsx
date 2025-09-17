import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  GraduationCap, 
  Heart, 
  Users,
  BookOpen,
  BarChart3
} from 'lucide-react';

const roleConfig = {
  admin: {
    icon: ShieldCheck,
    title: 'Admin',
    description: 'Full system access with analytics and user management',
    color: 'bg-primary',
  },
  counselor: {
    icon: Heart,
    title: 'Principal',
    description: 'Focus on at-risk students and intervention strategies',
    color: 'bg-risk-medium',
  },
  mentor: {
    icon: Users,
    title: 'Mentor',
    description: 'Support and guide assigned students individually',
    color: 'bg-info',
  },
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">EduPredict</h1>
              <p className="text-white/80 text-lg">AI-Based Dropout Prevention System</p>
            </div>
          </div>
          <p className="text-white/60 text-center max-w-2xl mx-auto">
            Empowering educators with AI-driven insights to identify at-risk students 
            and provide timely interventions for better educational outcomes.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Select Your Role
          </h2>
          <p className="text-white/70 text-center mb-8">
            Choose your role to access the appropriate dashboard and features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(roleConfig).map(([role, config]) => {
              const Icon = config.icon;
              return (
                <Card 
                  key={role}
                  className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer group"
                  onClick={() => handleLogin(role as UserRole)}
                >
                  <CardHeader className="text-center pb-2">
                    <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{config.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-white/70 text-sm leading-relaxed mb-6">
                      {config.description}
                    </CardDescription>
                    <Button 
                      className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                      variant="outline"
                    >
                      Access Dashboard
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Demo Notice */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-white/80" />
              <p className="text-white font-medium">Demo System</p>
            </div>
            <p className="text-white/70 text-sm">
              This is a demonstration of the AI-based dropout prediction system. 
              All data shown is simulated for showcase purposes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
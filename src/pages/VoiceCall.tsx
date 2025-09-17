import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useElevenLabsConversation } from '@/hooks/useElevenLabsConversation';
import { supabase } from '@/integrations/supabase/client';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Volume2,
  VolumeX
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Student } from '@/types';

const VoiceCall = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [callDuration, setCallDuration] = useState(0);

  // Get student and call type from navigation state
  const callData = location.state as { student: Student; callType: 'parent' | 'student' | 'mentor' } | null;

  useEffect(() => {
    if (!callData) {
      toast({
        title: "No Call Data",
        description: "Please select a student to call",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
  }, [callData, navigate, toast]);

  const {
    startConversation,
    endConversation,
    setVolume: setConversationVolume,
    isConnected,
    isSpeaking,
    isLoading,
    status
  } = useElevenLabsConversation();

  // Timer for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    if (!callData) return;
    
    // Start conversation with student data
    await startConversation({
      agentId: 'agent_9401k5c618s9fzkv0m8k76rfww00',
      phoneNumber: callData.student.phone,
      studentName: callData.student.name,
      callType: callData.callType
    });
  };

  const handleEndCall = async () => {
    await endConversation();
    setCallDuration(0);
    
    toast({
      title: "Call Ended",
      description: "Counseling session completed successfully",
    });
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setConversationVolume(newVolume);
  };

  if (!callData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            No Call Data Available
          </h3>
          <p className="text-muted-foreground mb-6">
            Please select a student to call from the dashboard or students page.
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Counseling Call - Agent Yohan & {callData.student.name}
            </h1>
            <div className="text-sm text-muted-foreground">
              {callData.callType === 'parent' ? 'Parent Call' : 
               callData.callType === 'student' ? 'Student Call' : 'Mentor Call'}
            </div>
            {isConnected && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  {formatDuration(callDuration)}
                </span>
              </div>
            )}
          </div>
          
          {isSpeaking && (
            <div className="flex items-center gap-2 text-accent">
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-accent rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-accent rounded-full animate-pulse delay-75" />
                <div className="w-1 h-5 bg-accent rounded-full animate-pulse delay-150" />
              </div>
              <span className="text-sm font-medium">Agent Yohan is speaking...</span>
            </div>
          )}
        </div>
      </div>

      {/* Video Call Interface */}
      <div className="flex-1 relative bg-gradient-to-br from-background to-secondary/10">
        {/* Main Video Area - Student */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="w-full max-w-4xl mx-4 aspect-video bg-card border shadow-strong overflow-hidden">
            <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Video className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{callData.student.name}</h3>
                    <p className="text-muted-foreground">
                      {callData.callType === 'parent' ? 'Parent' : 
                       callData.callType === 'student' ? 'Student' : 'Mentor'} - Video feed active
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Video is off</p>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-lg">
                <span className="text-sm font-medium text-foreground">{callData.student.name}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Agent Video - Small overlay */}
        <div className="absolute top-6 right-6 w-64 h-48">
          <Card className="w-full h-full bg-card border shadow-medium overflow-hidden">
            <div className="relative w-full h-full bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">Y</span>
                  </div>
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Agent Yohan</h4>
                <p className="text-xs text-muted-foreground">AI Counselor</p>
                {isConnected && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <span className="text-xs text-success">Online</span>
                  </div>
                )}
              </div>
              
              {/* Agent name overlay */}
              <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                <span className="text-xs font-medium text-foreground">Agent Yohan</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Connection Status */}
        {!isConnected && !isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Card className="p-8 text-center bg-card/95 backdrop-blur-sm">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Ready to Start Counseling Session with {callData.student.name}
              </h3>
              <p className="text-muted-foreground mb-2">
                Connect with AI Agent Yohan for personalized student counseling
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Call Type: {callData.callType === 'parent' ? 'Parent Call' : 
                           callData.callType === 'student' ? 'Student Call' : 'Mentor Call'}
              </p>
              <Button 
                onClick={handleStartCall}
                disabled={isLoading}
                className="bg-success hover:bg-success/90 text-white"
                size="lg"
              >
                {isLoading ? 'Connecting...' : 'Start Call'}
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-card border-t border-border p-6">
        <div className="flex items-center justify-center gap-6">
          {/* Video Toggle */}
          <Button
            variant={isVideoOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="w-14 h-14 rounded-full"
          >
            {isVideoOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </Button>

          {/* Microphone Toggle */}
          <Button
            variant={isMicOn ? "default" : "destructive"}
            size="lg"
            onClick={toggleMic}
            disabled={!isConnected}
            className="w-14 h-14 rounded-full"
          >
            {isMicOn ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </Button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVolumeChange(volume > 0 ? 0 : 0.8)}
              disabled={!isConnected}
            >
              {volume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              disabled={!isConnected}
              className="w-20 accent-primary"
            />
          </div>

          {/* End Call */}
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            disabled={!isConnected}
            className="w-14 h-14 rounded-full bg-destructive hover:bg-destructive/90"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Status Text */}
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {!isConnected && !isLoading && `Click 'Start Call' to begin the counseling session with ${callData.student.name}`}
            {isLoading && "Connecting to Agent Yohan..."}
            {isConnected && !isSpeaking && `Connected with ${callData.student.name} - You can start speaking`}
            {isConnected && isSpeaking && "Agent Yohan is responding..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useElevenLabsConversation = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startConversation = async () => {
    setIsLoading(true);
    
    try {
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: {
          agentId: 'agent_9401k5c618s9fzkv0m8k76rfww00',
          phoneNumber: '+1234567890',
          studentName: 'Student',
          callType: 'student'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to initialize conversation');
      }

      if (!data?.success) {
        throw new Error('Failed to initialize conversation');
      }

      setIsConnected(true);
      
      // Simulate speaking state for demo
      setTimeout(() => {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 3000);
      }, 2000);
      
      toast({
        title: "Connected",
        description: "Voice conversation started with Agent Yohan",
      });
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    try {
      setIsConnected(false);
      setIsSpeaking(false);
      
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  const setVolume = async (volume: number) => {
    console.log('Setting volume to:', volume);
    // Volume control implementation would go here
  };

  return {
    startConversation,
    endConversation,
    setVolume,
    isConnected,
    isSpeaking,
    isLoading,
    status: isConnected ? 'connected' : 'disconnected'
  };
};
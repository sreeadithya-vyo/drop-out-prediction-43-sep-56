import { useRef } from 'react';
import { useConversation } from '@11labs/react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConversationParams {
  agentId: string;
  phoneNumber: string;
  studentName: string;
  callType: 'parent' | 'student' | 'mentor';
}

export const useElevenLabsConversation = () => {
  const { toast } = useToast();
  const conversationParams = useRef<ConversationParams | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs conversation connected');
      toast({
        title: "Connected",
        description: "Voice conversation started with Agent Yohan",
      });
    },
    onDisconnect: () => {
      console.log('ElevenLabs conversation disconnected');
      toast({
        title: "Disconnected",
        description: "Voice conversation ended",
      });
    },
    onMessage: (message) => {
      console.log('Conversation message:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs conversation error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to maintain voice connection",
        variant: "destructive",
      });
    }
  });

  const startConversation = async (params?: ConversationParams) => {
    try {
      // Store conversation parameters
      if (params) {
        conversationParams.current = params;
      }

      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation', {
        body: conversationParams.current || {
          agentId: 'agent_9401k5c618s9fzkv0m8k76rfww00',
          phoneNumber: '+1234567890',
          studentName: 'Student',
          callType: 'student'
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to initialize conversation');
      }

      if (!data?.success || !data?.conversationUrl) {
        throw new Error('Failed to get conversation URL');
      }

      // Start the conversation with the signed URL
      await conversation.startSession({ 
        signedUrl: data.conversationUrl 
      });
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      await conversation.setVolume({ volume });
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  return {
    startConversation,
    endConversation,
    setVolume,
    isConnected: conversation.status === 'connected',
    isSpeaking: conversation.isSpeaking,
    isLoading: conversation.status === 'connecting',
    status: conversation.status
  };
};
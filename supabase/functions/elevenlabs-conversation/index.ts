import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, phoneNumber, studentName, callType } = await req.json();
    
    if (!agentId) {
      throw new Error('Agent ID is required');
    }
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    console.log(`Starting ElevenLabs conversation for ${studentName} at ${phoneNumber}`);

    // Generate signed URL for the conversational AI agent
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: "GET",
        headers: {
          "xi-api-key": elevenLabsApiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!signedUrlResponse.ok) {
      const errorText = await signedUrlResponse.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`Failed to get signed URL: ${signedUrlResponse.status} ${errorText}`);
    }

    const { signed_url } = await signedUrlResponse.json();

    console.log('Successfully generated signed URL for conversation');

    // Here you would typically integrate with a telephony service
    // For now, we'll return the signed URL and conversation details
    return new Response(
      JSON.stringify({
        success: true,
        conversationUrl: signed_url,
        agentId,
        phoneNumber,
        studentName,
        callType,
        message: `Conversation initialized for ${studentName}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-conversation function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to initialize conversation',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
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
    const { phoneNumber, studentName, parentName } = await req.json();
    
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_PARENT_API_KEY');
    const parentAgentId = Deno.env.get('ELEVENLABS_PARENT_AGENT_ID');
    
    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs Parent API key not configured');
    }

    if (!parentAgentId) {
      throw new Error('ElevenLabs Parent Agent ID not configured');
    }

    console.log(`Starting ElevenLabs parent counseling conversation for ${parentName} about ${studentName} at ${phoneNumber}`);

    // Generate signed URL for the parent counseling conversational AI agent
    const signedUrlResponse = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${parentAgentId}`,
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
      console.error('ElevenLabs Parent API error:', errorText);
      throw new Error(`Failed to get signed URL: ${signedUrlResponse.status} ${errorText}`);
    }

    const { signed_url } = await signedUrlResponse.json();

    console.log('Successfully generated signed URL for parent counseling conversation');

    return new Response(
      JSON.stringify({
        success: true,
        conversationUrl: signed_url,
        agentId: parentAgentId,
        phoneNumber,
        studentName,
        parentName,
        callType: 'parent',
        message: `Parent counseling conversation initialized for ${parentName} regarding ${studentName}`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in elevenlabs-parent-counseling function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to initialize parent counseling conversation',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
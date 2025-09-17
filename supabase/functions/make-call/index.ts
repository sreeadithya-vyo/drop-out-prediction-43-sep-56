import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, callType, studentId } = await req.json();
    
    console.log('Making call to:', phoneNumber, 'for student:', studentId, 'type:', callType);

    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    // Twilio credentials
    const accountSid = "AC512d7a20977b889f2af2461ffde578da";
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = "+18582938272";

    if (!authToken) {
      throw new Error('Twilio auth token not configured');
    }

    // Create Twilio call
    const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'To': phoneNumber,
        'From': fromNumber,
        'Url': 'http://demo.twilio.com/docs/voice.xml'
      }),
    });

    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error('Twilio API error:', errorText);
      throw new Error(`Twilio API error: ${twilioResponse.status} ${errorText}`);
    }

    const twilioData = await twilioResponse.json();
    console.log('Twilio call created:', twilioData.sid);

    // Get current user from JWT token
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token || '');

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Log the call in our database
    const { error: logError } = await supabase
      .from('call_logs')
      .insert({
        student_id: studentId,
        phone_number: phoneNumber,
        call_type: callType || 'unknown',
        call_status: 'initiated',
        initiated_by: user.id,
        vapi_call_id: twilioData.sid
      });

    if (logError) {
      console.error('Error logging call:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      callSid: twilioData.sid,
      message: `Call initiated to ${phoneNumber}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in make-call function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
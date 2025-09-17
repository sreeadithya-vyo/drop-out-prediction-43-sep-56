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
    const { action, callSid, studentId } = await req.json();
    
    console.log('Call logs API request:', { action, callSid, studentId });

    // Get credentials from secrets
    const accountSid = Deno.env.get('ACCOUNT_SID');
    const authToken = Deno.env.get('ACCOUNT_TOKEN');

    if (!accountSid || !authToken) {
      throw new Error('Account SID or Auth Token not configured');
    }

    let result;

    switch (action) {
      case 'get_call_status':
        if (!callSid) {
          throw new Error('Call SID is required for status check');
        }
        result = await getCallStatus(accountSid, authToken, callSid);
        break;

      case 'get_call_logs':
        result = await getCallLogs(accountSid, authToken, studentId);
        break;

      case 'update_call_status':
        if (!callSid) {
          throw new Error('Call SID is required for status update');
        }
        result = await updateCallInDatabase(callSid, studentId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in call-logs-api function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getCallStatus(accountSid: string, authToken: string, callSid: string) {
  console.log('Fetching call status for:', callSid);
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls/${callSid}.json`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twilio API error:', errorText);
    throw new Error(`Twilio API error: ${response.status} ${errorText}`);
  }

  const callData = await response.json();
  console.log('Call status retrieved:', callData.status);
  
  return {
    callSid: callData.sid,
    status: callData.status,
    duration: callData.duration,
    startTime: callData.start_time,
    endTime: callData.end_time,
    direction: callData.direction,
    from: callData.from,
    to: callData.to
  };
}

async function getCallLogs(accountSid: string, authToken: string, studentId?: string) {
  console.log('Fetching call logs', studentId ? `for student: ${studentId}` : 'for all calls');
  
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json?PageSize=50`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Twilio API error:', errorText);
    throw new Error(`Twilio API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log(`Retrieved ${data.calls.length} calls from Twilio`);
  
  // If studentId provided, also get our database records
  if (studentId) {
    const { data: dbCalls, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching database calls:', error);
    }

    return {
      twilioCallsTotal: data.calls.length,
      twilioCallsRecent: data.calls.slice(0, 10),
      databaseCalls: dbCalls || []
    };
  }
  
  return {
    totalCalls: data.calls.length,
    calls: data.calls.map((call: any) => ({
      callSid: call.sid,
      status: call.status,
      duration: call.duration,
      startTime: call.start_time,
      endTime: call.end_time,
      direction: call.direction,
      from: call.from,
      to: call.to
    }))
  };
}

async function updateCallInDatabase(callSid: string, studentId?: string) {
  console.log('Updating call in database:', callSid);
  
  // First get the call status from Twilio
  const accountSid = Deno.env.get('ACCOUNT_SID');
  const authToken = Deno.env.get('ACCOUNT_TOKEN');
  
  if (!accountSid || !authToken) {
    throw new Error('Account credentials not available');
  }
  
  const callStatus = await getCallStatus(accountSid, authToken, callSid);
  
  // Update our database record
  const updateData: any = {
    call_status: callStatus.status,
    call_duration: callStatus.duration ? parseInt(callStatus.duration) : null,
  };

  // Determine call outcome based on status
  if (callStatus.status === 'completed') {
    updateData.call_outcome = 'successful';
  } else if (['busy', 'no-answer', 'failed', 'canceled'].includes(callStatus.status)) {
    updateData.call_outcome = 'failed';
  }

  const { data, error } = await supabase
    .from('call_logs')
    .update(updateData)
    .eq('vapi_call_id', callSid)
    .select()
    .single();

  if (error) {
    console.error('Error updating database:', error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  console.log('Database updated successfully');
  return { ...callStatus, databaseRecord: data };
}
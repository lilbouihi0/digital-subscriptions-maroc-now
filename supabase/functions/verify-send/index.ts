
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Twilio client
const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const twilioVerifySid = 'VA7917d13cd7684c76b48eefe1867fff95'; // Using the provided SID

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Create Twilio API request
    const twilioEndpoint = `https://verify.twilio.com/v2/Services/${twilioVerifySid}/Verifications`;
    const twilioResponse = await fetch(twilioEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
      },
      body: new URLSearchParams({
        'To': phoneNumber,
        'Channel': 'whatsapp'
      })
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio API error:', twilioData);
      return new Response(
        JSON.stringify({ error: 'Failed to send verification code', details: twilioData }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Success
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent',
        status: twilioData.status
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

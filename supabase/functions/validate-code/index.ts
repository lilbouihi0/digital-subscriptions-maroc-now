
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const { code } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Code is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the code in the database
    const { data, error } = await supabase
      .from('spins')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid code', valid: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404
        }
      );
    }

    // Check if the code has expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    const isExpired = now > expiresAt;

    // Check if the code has been redeemed
    const isRedeemed = data.redeemed;

    return new Response(
      JSON.stringify({ 
        valid: !isExpired && !isRedeemed,
        expired: isExpired,
        redeemed: isRedeemed,
        details: {
          phone: data.phone,
          prize_type: data.prize_type,
          prize_name: data.prize_name,
          prize_value: data.prize_value,
          created_at: data.created_at,
          expires_at: data.expires_at
        }
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

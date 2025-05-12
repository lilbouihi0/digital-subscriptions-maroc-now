
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
    // Get the phone number from query parameters
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
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

    // Check if the user has already spun today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingSpin, error: spinQueryError } = await supabase
      .from('spins')
      .select('*')
      .eq('phone', phone)
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (spinQueryError) {
      console.error('Database query error:', spinQueryError);
      return new Response(
        JSON.stringify({ error: 'Failed to check spin history', details: spinQueryError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Determine if user has spun today
    const hasSpun = existingSpin && existingSpin.length > 0;

    // Return the result
    return new Response(
      JSON.stringify({ 
        hasSpun,
        lastSpin: hasSpun ? existingSpin[0].created_at : null
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

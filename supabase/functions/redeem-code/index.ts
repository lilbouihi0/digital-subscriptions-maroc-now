
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
    const { code, adminKey } = await req.json();

    // Simple admin authentication
    const validAdminKey = Deno.env.get('ADMIN_KEY');
    if (!validAdminKey || adminKey !== validAdminKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 401 
        }
      );
    }

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

    // Check if the code exists and is valid
    const { data: existingCode, error: codeError } = await supabase
      .from('spins')
      .select('*')
      .eq('code', code)
      .single();

    if (codeError || !existingCode) {
      return new Response(
        JSON.stringify({ error: 'Invalid code', valid: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 404
        }
      );
    }

    // Check if the code has already been redeemed
    if (existingCode.redeemed) {
      return new Response(
        JSON.stringify({ error: 'Code has already been redeemed', valid: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400
        }
      );
    }

    // Check if the code has expired
    const expiresAt = new Date(existingCode.expires_at);
    const now = new Date();
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Code has expired', valid: false }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400
        }
      );
    }

    // Mark the code as redeemed
    const { data: updatedCode, error: updateError } = await supabase
      .from('spins')
      .update({ redeemed: true, redeemed_at: new Date().toISOString() })
      .eq('code', code)
      .select();

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to redeem code', details: updateError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Code successfully redeemed',
        details: updatedCode[0]
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

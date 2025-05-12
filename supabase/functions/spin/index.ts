
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Prize definitions with probabilities
const prizes = [
  { 
    type: 'discount', 
    name: '10% OFF', 
    value: '10%', 
    probability: 20, 
    color: '#6366F1'  // Indigo
  },
  { 
    type: 'cashback', 
    name: '20% Cash Back', 
    value: '20%', 
    probability: 20, 
    color: '#4338CA'  // Darker indigo
  },
  { 
    type: 'freeAccount', 
    name: 'Free Account', 
    value: 'Free', 
    probability: 10, 
    color: '#8B5CF6'  // Purple
  },
  { 
    type: 'discount', 
    name: '10% OFF', 
    value: '10%', 
    probability: 5, 
    color: '#EC4899'  // Pink
  },
  { 
    type: 'discount', 
    name: '5% OFF', 
    value: '5%', 
    probability: 5, 
    color: '#3B82F6'  // Blue
  },
  { 
    type: 'tryAgain', 
    name: 'Try Again', 
    value: null, 
    probability: 40, 
    color: '#9CA3AF'  // Gray
  }
];

// Function to generate a unique code
function generateUniqueCode(prizeType: string, phoneNumber: string): string {
  const timestamp = new Date().getTime().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const prizePrefix = prizeType.substring(0, 3).toUpperCase();
  
  // Use the last 4 digits of the phone number (if available)
  const phoneDigits = phoneNumber.replace(/\D/g, '').slice(-4);
  
  return `${prizePrefix}-${randomChars}-${phoneDigits}-${timestamp}`;
}

// Function to determine prize based on probabilities
function selectRandomPrize() {
  const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
  let random = Math.random() * totalProbability;
  
  for (let i = 0; i < prizes.length; i++) {
    if (random < prizes[i].probability) {
      return { prize: prizes[i], prizeIndex: i };
    }
    random -= prizes[i].probability;
  }
  
  // Default to first prize if something goes wrong
  return { prize: prizes[0], prizeIndex: 0 };
}

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

    // Check if the user has already spun today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data: existingSpin, error: spinQueryError } = await supabase
      .from('spins')
      .select('*')
      .eq('phone', phoneNumber)
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

    // If the user has already spun today, reject the request
    if (existingSpin && existingSpin.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You have already spun today', hasSpun: true }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 403 
        }
      );
    }

    // Select a random prize based on probability
    const { prize, prizeIndex } = selectRandomPrize();
    
    // Generate a unique code for certain prize types
    let code = null;
    if (prize.type === 'freeAccount') {
      code = generateUniqueCode(prize.type, phoneNumber);
    }
    
    // Calculate expiry date (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);
    
    // Save the spin result to the database
    const spinRecord = {
      phone: phoneNumber,
      prize_type: prize.type,
      prize_name: prize.name,
      prize_value: prize.value,
      code: code,
      expires_at: expiresAt.toISOString(),
      redeemed: false
    };
    
    const { data: spinData, error: spinError } = await supabase
      .from('spins')
      .insert(spinRecord)
      .select();

    if (spinError) {
      console.error('Database insertion error:', spinError);
      return new Response(
        JSON.stringify({ error: 'Failed to record spin result', details: spinError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      );
    }

    // Return the prize information
    return new Response(
      JSON.stringify({ 
        ...prize,
        code,
        expiresAt: expiresAt.toISOString(),
        prizeIndex,
        totalSegments: prizes.length,
        timestamp: new Date().toISOString(),
        spinId: spinData[0].id
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

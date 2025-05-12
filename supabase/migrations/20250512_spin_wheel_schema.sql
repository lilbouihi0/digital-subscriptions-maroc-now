
-- Create users table to store verified phone numbers
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL UNIQUE,
  last_verified_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create spins table to track spin history and rewards
CREATE TABLE IF NOT EXISTS spins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL REFERENCES users(phone),
  prize_type TEXT NOT NULL,
  prize_name TEXT NOT NULL,
  prize_value TEXT,
  code TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for querying spins by phone number
CREATE INDEX IF NOT EXISTS idx_spins_phone ON spins(phone);

-- Add index for validating codes
CREATE INDEX IF NOT EXISTS idx_spins_code ON spins(code);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE spins ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated access
CREATE POLICY "Allow service role full access to users" ON users
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow service role full access to spins" ON spins
  USING (true)
  WITH CHECK (true);

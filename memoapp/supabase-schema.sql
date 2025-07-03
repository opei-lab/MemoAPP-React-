-- Create memos table
CREATE TABLE IF NOT EXISTS memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  color TEXT DEFAULT '#FFE4B5',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memos_updated_at BEFORE UPDATE
  ON memos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can only see their own memos
CREATE POLICY "Users can view own memos" ON memos
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own memos
CREATE POLICY "Users can insert own memos" ON memos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own memos
CREATE POLICY "Users can update own memos" ON memos
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own memos
CREATE POLICY "Users can delete own memos" ON memos
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_memos_user_id ON memos(user_id);
CREATE INDEX idx_memos_position ON memos(user_id, position);
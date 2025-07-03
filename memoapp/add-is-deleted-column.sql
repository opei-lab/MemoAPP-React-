-- Add is_deleted column to memos table
ALTER TABLE memos 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Create index for better performance when filtering deleted memos
CREATE INDEX idx_memos_is_deleted ON memos(user_id, is_deleted);
-- titleカラムが存在しない場合、追加する
ALTER TABLE memos ADD COLUMN IF NOT EXISTS title TEXT;

-- contentカラムが存在しない場合、追加する
ALTER TABLE memos ADD COLUMN IF NOT EXISTS content TEXT;

-- colorカラムが存在しない場合、追加する
ALTER TABLE memos ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#FFE4B5';

-- positionカラムが存在しない場合、追加する
ALTER TABLE memos ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- updated_atカラムが存在しない場合、追加する
ALTER TABLE memos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
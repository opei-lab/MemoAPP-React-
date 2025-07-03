-- titleカラムを追加
ALTER TABLE memos ADD COLUMN title TEXT DEFAULT '';

-- positionカラムの型を変更（一旦削除して再作成）
ALTER TABLE memos DROP COLUMN position;
ALTER TABLE memos ADD COLUMN position INTEGER DEFAULT 0;

-- user_idに外部キー制約を追加
ALTER TABLE memos 
  ALTER COLUMN user_id DROP DEFAULT,
  ADD CONSTRAINT memos_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- タイムスタンプをタイムゾーン付きに変更（推奨）
ALTER TABLE memos 
  ALTER COLUMN created_at TYPE TIMESTAMP WITH TIME ZONE,
  ALTER COLUMN updated_at TYPE TIMESTAMP WITH TIME ZONE;

-- デフォルト値を設定
ALTER TABLE memos 
  ALTER COLUMN created_at SET DEFAULT NOW(),
  ALTER COLUMN updated_at SET DEFAULT NOW();
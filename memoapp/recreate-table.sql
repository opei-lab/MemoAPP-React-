-- 既存のデータをバックアップ
CREATE TABLE memos_backup AS SELECT * FROM memos;

-- テーブルを削除
DROP TABLE memos;

-- 正しい順番で再作成
CREATE TABLE memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT '',
  content TEXT NOT NULL,
  color TEXT DEFAULT '#FFE4B5',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- データを復元
INSERT INTO memos (id, user_id, title, content, color, position, created_at, updated_at)
SELECT id, user_id, title, content, color, position, created_at, updated_at FROM memos_backup;

-- バックアップテーブルを削除
DROP TABLE memos_backup;

-- RLSを有効化
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- RLSポリシーを再作成
CREATE POLICY "Users can view own memos" ON memos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memos" ON memos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memos" ON memos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memos" ON memos FOR DELETE USING (auth.uid() = user_id);
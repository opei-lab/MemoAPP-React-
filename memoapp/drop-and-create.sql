-- テーブルを削除
DROP TABLE IF EXISTS memos;

-- 正しい構造で新規作成
CREATE TABLE memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT '',
  content TEXT NOT NULL,
  color TEXT DEFAULT '#FFE4B5',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- updated_atの自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memos_updated_at BEFORE UPDATE
  ON memos FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLSを有効化
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;

-- RLSポリシー作成
CREATE POLICY "Users can view own memos" ON memos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memos" ON memos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own memos" ON memos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own memos" ON memos
  FOR DELETE USING (auth.uid() = user_id);

-- インデックス作成（パフォーマンス向上）
CREATE INDEX idx_memos_user_id ON memos(user_id);
CREATE INDEX idx_memos_position ON memos(user_id, position);
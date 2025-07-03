-- titleカラムを追加（これが最も重要）
ALTER TABLE memos ADD COLUMN title TEXT DEFAULT '';

-- positionをINTEGERに変更
ALTER TABLE memos DROP COLUMN position;
ALTER TABLE memos ADD COLUMN position INTEGER DEFAULT 0;
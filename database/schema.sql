-- 资产表：电子遗产管家核心数据
-- 启动时由 useDatabase 初始化执行
CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  account TEXT DEFAULT '',
  password TEXT DEFAULT '',
  note TEXT DEFAULT '',
  imageUri TEXT DEFAULT '',
  createdAt INTEGER NOT NULL
);

-- 创建时间索引，用于列表按创建时间倒序
CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(createdAt DESC);

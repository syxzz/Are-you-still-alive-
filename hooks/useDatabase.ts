import { useCallback, useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Asset, AssetFormData } from '../types/asset';

const DB_NAME = 'legacy.db';

/** 启动时初始化数据库：建表 */
async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
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
    CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(createdAt DESC);
  `);
}

/**
 * 数据库 Hook：初始化 + 资产增删改查
 */
export function useDatabase() {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [ready, setReady] = useState(false);
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const database = await SQLite.openDatabaseAsync(DB_NAME);
        if (!mounted) return;
        await initDatabase(database);
        if (!mounted) return;
        dbRef.current = database;
        setDb(database);
        setReady(true);
      } catch (e) {
        if (mounted) setReady(true);
        console.error('数据库初始化失败', e);
      }
    })();
    return () => {
      mounted = false;
      if (dbRef.current) {
        dbRef.current.closeAsync();
        dbRef.current = null;
      }
    };
  }, []);

  /** 查询全部资产，按创建时间倒序 */
  const getAllAssets = useCallback(async (): Promise<Asset[]> => {
    if (!db) return [];
    try {
      const rows = await db.getAllAsync<Asset>(
        'SELECT id, name, category, account, password, note, imageUri, createdAt FROM assets ORDER BY createdAt DESC'
      );
      return rows;
    } catch (e) {
      console.error('getAllAssets error', e);
      return [];
    }
  }, [db]);

  /** 根据 id 查询单条资产 */
  const getAssetById = useCallback(
    async (id: number): Promise<Asset | null> => {
      if (!db) return null;
      try {
        const row = await db.getFirstAsync<Asset>(
          'SELECT id, name, category, account, password, note, imageUri, createdAt FROM assets WHERE id = ?',
          [id]
        );
        return row ?? null;
      } catch (e) {
        console.error('getAssetById error', e);
        return null;
      }
    },
    [db]
  );

  /** 新增资产 */
  const insertAsset = useCallback(
    async (data: AssetFormData): Promise<number | null> => {
      if (!db) return null;
      try {
        const createdAt = Date.now();
        const result = await db.runAsync(
          'INSERT INTO assets (name, category, account, password, note, imageUri, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            data.name,
            data.category,
            data.account,
            data.password,
            data.note,
            data.imageUri ?? '',
            createdAt,
          ]
        );
        return result.lastInsertRowId;
      } catch (e) {
        console.error('insertAsset error', e);
        return null;
      }
    },
    [db]
  );

  /** 更新资产 */
  const updateAsset = useCallback(
    async (id: number, data: AssetFormData): Promise<boolean> => {
      if (!db) return false;
      try {
        await db.runAsync(
          'UPDATE assets SET name = ?, category = ?, account = ?, password = ?, note = ?, imageUri = ? WHERE id = ?',
          [
            data.name,
            data.category,
            data.account,
            data.password,
            data.note,
            data.imageUri ?? '',
            id,
          ]
        );
        return true;
      } catch (e) {
        console.error('updateAsset error', e);
        return false;
      }
    },
    [db]
  );

  /** 删除资产 */
  const deleteAsset = useCallback(
    async (id: number): Promise<boolean> => {
      if (!db) return false;
      try {
        await db.runAsync('DELETE FROM assets WHERE id = ?', [id]);
        return true;
      } catch (e) {
        console.error('deleteAsset error', e);
        return false;
      }
    },
    [db]
  );

  return {
    ready,
    getAllAssets,
    getAssetById,
    insertAsset,
    updateAsset,
    deleteAsset,
  };
}

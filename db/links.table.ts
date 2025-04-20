import * as SQLite from "expo-sqlite";

export const initLinksTable = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS Links (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      url TEXT UNIQUE NOT NULL, 
      title VARCHAR(255) NOT NULL, 
      description TEXT, 
      preview_image_url VARCHAR(2048), 
      favorite INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
      ;`);
  } catch (error) {
    console.error("init-links-table", error);
  }
};

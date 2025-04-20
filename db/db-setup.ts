import * as SQLite from "expo-sqlite";
import { initLinksTable } from "./links.table";
import { initTagsTable } from "./tags.table";
import { initLinkTagsTable } from "./links-tags.table";

export const initDB = async (db: SQLite.SQLiteDatabase) => {
  await initLinksTable(db);
  await initTagsTable(db);
  await initLinkTagsTable(db);
};

export const migrateDbIfNeeded = async (db: SQLite.SQLiteDatabase) => {
  const DATABASE_VERSION = 1;
  let currDB = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  let { user_version: currentDbVersion } = currDB || {};

  if (currentDbVersion && currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await initDB(db);
    currentDbVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
};

import { ITag } from "@/interfaces/tags.types";
import * as SQLite from "expo-sqlite";

export const initTagsTable = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS Tags (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name VARCHAR(64) NOT NULL, 
      color VARCHAR(7) NOT NULL);`
    );
  } catch (error) {
    console.error("init-tags-table", error);
  }
};

export const bulkAddNewTags = async (
  newTags: Omit<ITag, "id">[],
  db: SQLite.SQLiteDatabase
) => {
  let data: number[] = [];
  await db.withExclusiveTransactionAsync(async (tra) => {
    const promises = newTags.map((item) =>
      tra.runAsync(
        `INSERT INTO Tags (name,color) VALUES ($name, $color);
           SELECT * FROM Tags Where id = last_insert_rowid()`,
        { $name: item.name, $color: item.color }
      )
    );
    const settled = await Promise.allSettled(promises);
    const ids: number[] = [];
    settled.forEach((i) => {
      i.status == "fulfilled" ? ids.push(i.value.lastInsertRowId) : null;
    });
    data = ids;
  });
  return data;
};

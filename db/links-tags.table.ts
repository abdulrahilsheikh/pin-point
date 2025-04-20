import * as SQLite from "expo-sqlite";

export const initLinkTagsTable = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS LinkTags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      link_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (link_id) REFERENCES Links(id),
      FOREIGN KEY (tag_id) REFERENCES Tags(id)
      );`);
  } catch (error) {
    console.error("init-links-tags--table", error);
  }
};
export const bulkConnectTagsWithLink = async (
  tagIds: number[],
  linkId: number,
  db: SQLite.SQLiteDatabase
) => {
  let data: number[] = [];

  await db.withExclusiveTransactionAsync(async (tra) => {
    const promise = tagIds.map((i) =>
      tra.runAsync(
        `INSERT INTO LinkTags (link_id, tag_id) VALUES ($linkId, $tagId)`,
        { $linkId: linkId, $tagId: i }
      )
    );
    const allSettled = await Promise.allSettled(promise);
    const ids: number[] = [];
    allSettled.forEach((i) => {
      i.status == "fulfilled"
        ? ids.push(i.value.lastInsertRowId)
        : console.log(i.reason);
    });
    data = ids;
  });
  return data;
};

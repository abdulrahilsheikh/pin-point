import { ITag } from "@/interfaces/tags.types";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export const useTagsStore = () => {
  const sql = useSQLiteContext();
  const getTags = async () => {
    try {
      return await sql.getAllAsync<ITag>(`SELECT * from Tags`);
    } catch (error) {
      throw new Error("Something went wrong.");
    }
  };
  const addTag = async ({ name, color }: { name: string; color: string }) => {
    try {
      return await sql.runAsync(
        `INSERT INTO Tags 
        (name , color) 
        VALUES ($name, $color);
        SELECT * FROM Tags WHERE id = last_insert_rowid();`,
        {
          $name: name,
          $color: color,
        }
      );
    } catch (error) {
      throw new Error("Something went wrong.");
    }
  };
  return { getTags, addTag };
};

import { bulkConnectTagsWithLink } from "@/db/links-tags.table";
import { bulkAddNewTags } from "@/db/tags.table";
import { ILink, ILInkWithTags } from "@/interfaces/links.types";
import { ITag, ITagWithoutId } from "@/interfaces/tags.types";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export const useLinksStore = () => {
  const db = useSQLiteContext();

  const getLinks = useCallback(async () => {
    let links: any[] = [];
    try {
      const temp = await db.getAllAsync(
        `SELECT 
              Links.*,
              COALESCE(
                  json_group_array(
                      json_object(
                          'id', Tags.id,
                          'name', Tags.name,
                          'color', Tags.color
                      )
                  ), '[]'
              ) AS tags
          FROM Links
          LEFT JOIN LinkTags ON Links.id = LinkTags.link_id
          LEFT JOIN Tags ON LinkTags.tag_id = Tags.id
          GROUP BY Links.id
          ORDER BY Links.updated_at DESC;
`
      );
      links = temp || [];
    } catch (error) {
      console.error(error);
    }
    return links.map((i) => {
      i.tags = JSON.parse(i.tags);
      return i;
    }) as ILInkWithTags[];
  }, [db]);

  const getFavouriteLinks = useCallback(async () => {
    let links: any[] = [];
    try {
      const temp = await db.getAllAsync(
        `SELECT 
              Links.*,
              COALESCE(
                  json_group_array(
                      json_object(
                          'id', Tags.id,
                          'name', Tags.name,
                          'color', Tags.color
                      )
                  ), '[]'
              ) AS tags
          FROM Links
          LEFT JOIN LinkTags ON Links.id = LinkTags.link_id
          LEFT JOIN Tags ON LinkTags.tag_id = Tags.id
          WHERE Links.favorite = 1
          GROUP BY Links.id
          ORDER BY Links.updated_at DESC;
`
      );
      links = temp || [];
    } catch (error) {
      console.error(error);
    }
    return links.map((i) => {
      i.tags = JSON.parse(i.tags);
      return i;
    }) as ILInkWithTags[];
  }, [db]);
  const getLinkById = useCallback(
    async (linkId: number) => {
      let link: ILInkWithTags | null = null;
      try {
        const temp: (ILInkWithTags & { tags: string }) | null =
          await db.getFirstAsync(
            `SELECT 
              Links.*,
              COALESCE(
                  json_group_array(
                      json_object(
                          'id', Tags.id,
                          'name', Tags.name,
                          'color', Tags.color
                      )
                  ), '[]'
              ) AS tags
          FROM Links
          LEFT JOIN LinkTags ON Links.id = LinkTags.link_id
          LEFT JOIN Tags ON LinkTags.tag_id = Tags.id
          WHERE Links.id = ?
          GROUP BY Links.id
          ORDER BY Links.updated_at DESC;
`,
            [linkId]
          );
        if (temp) {
          const tags = JSON.parse(temp!.tags!);
          link = { ...temp, tags };
        }
      } catch (error) {
        console.error(error);
      }
      return link;
    },
    [db]
  );

  const updateLink = useCallback(
    async (
      linkId: number,
      updatedLink: Pick<ILink, "description" | "title">,
      {
        addedTags,
        removedTags,
        newTags,
      }: { addedTags: ITag[]; removedTags: ITag[]; newTags: ITagWithoutId[] }
    ) => {
      try {
        await db.runAsync(
          `UPDATE Links
            SET title = $title,
            description = $description
            WHERE id = $id
            `,
          {
            $id: linkId,
            $title: updatedLink.title,
            $description: updatedLink.description,
          }
        );
        if (removedTags.length) {
          await db.getAllAsync(
            `
            DELETE FROM LinkTags
            WHERE link_id = ? 
            AND tag_id IN (${removedTags.map((i) => "?").join(",")})
            `,
            linkId,
            ...removedTags.map((i) => i.id)
          );
        }
        if (newTags.length || addedTags.length) {
          const ids = newTags.length ? await bulkAddNewTags(newTags, db) : [];
          await bulkConnectTagsWithLink(
            ids.concat(...addedTags.map((i) => i.id)),
            linkId,
            db
          );
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    },
    [db]
  );

  const addNewLink = useCallback(
    async (
      link: Pick<
        ILink,
        "title" | "description" | "preview_image_url" | "url"
      > & { tags: { newTags: Omit<ITag, "id">[]; existingTags: ITag[] } }
    ) => {
      try {
        const newLink = await db.runAsync(
          `INSERT INTO Links
            (url, title, description, preview_image_url)
            VALUES ($url, $title, $description, $preview_image_url);
            SELECT * FROM Links WHERE id = last_insert_rowid();
            `,
          {
            $url: link.url,
            $title: link.title,
            $description: link.description,
            $preview_image_url: link.preview_image_url,
          }
        );
        const ids = await bulkAddNewTags(link.tags.newTags, db);
        await bulkConnectTagsWithLink(
          ids.concat(...link.tags.existingTags.map((i) => i.id)),
          newLink.lastInsertRowId,
          db
        );
      } catch (_e) {
        throw new Error("This link already exists.");
      }
    },

    [db]
  );
  const toggleIsLinkFavorite = async (linkId: number, isFavorite: 0 | 1) => {
    try {
      await db.runAsync(
        `UPDATE Links
            SET favorite = $isFavorite
            WHERE id = $id`,
        {
          $id: linkId,
          $isFavorite: isFavorite,
        }
      );
      return (await db.getFirstAsync(
        `SELECT * FROM Links WHERE id = ?`,
        linkId
      )) as ILInkWithTags;
    } catch (error) {
      console.error(error);
    }
    return null;
  };
  return {
    getLinkById,
    getLinks,
    updateLink,
    addNewLink,
    bulkAddNewTags,
    toggleIsLinkFavorite, getFavouriteLinks
  };
};

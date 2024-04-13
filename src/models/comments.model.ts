import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let comment: PostComment | null;

class PostComment {
  static getInstance = () => (comment ? comment : new PostComment());

  getComments = async () => {
    const sql =
      "SELECT c.id, c.body, c.created_at, c.modified_at, c.current_status, u.username, u.avatar_url, u.full_name, p.title, p.slug_url FROM comment AS c JOIN user AS u ON u.id = c.user_id JOIN post AS p ON p.id = c.post_id;";
    return await db.query<RowDataPacket[]>(sql).then(([rows, _]) => rows);
  };

  getComment = async (id: string) => {
    const sql =
      "SELECT c.id, c.body, c.created_at, c.modified_at, c.current_status, u.username, u.avatar_url, u.full_name, u.biography, p.title, p.summary, p.slug_url FROM comment AS c JOIN user AS u ON u.id = c.user_id JOIN post AS p ON p.id = c.post_id WHERE c.id = ?;";
    return await db
      .query<RowDataPacket[]>(sql, [id])
      .then(([rows, _]) => rows[0]);
  };

  updateStatus = async (id: string, status: string) => {
    let sql: string =
      "UPDATE comment SET current_status = ?, published_at = NULL, modified_at = CURRENT_TIMESTAMP () WHERE id = ?;";

    if (status === "approved") {
      sql =
        "UPDATE comment SET current_status = ?, published_at = CURRENT_TIMESTAMP (), modified_at = CURRENT_TIMESTAMP () WHERE id = ?;";
    }

    return await db
      .query<ResultSetHeader>(sql, [status, id])
      .then(([rows, _]) => rows);
  };

  getReplies = async (parentId: string) => {
    const sql =
      "SELECT  c.id, c.body, c.created_at, c.modified_at, c.current_status, u.username, u.avatar_url, u.full_name, p.title, p.slug_url FROM comment AS c JOIN user AS u ON u.id = c.user_id JOIN post AS p ON p.id = c.post_id WHERE c.parent_id = ?;";
    return await db
      .query<RowDataPacket[]>(sql, [parentId])
      .then(([rows, _]) => rows);
  };

  deleteComment = async (id: string) => {
    const sql = "DELETE FROM comment WHERE id = ?;";
    return await db.query<ResultSetHeader>(sql, [id]).then(([rows, _]) => rows);
  };
}

export default PostComment;

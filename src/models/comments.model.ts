import { RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let comment: PostComment | null;

class PostComment {
  static getInstance = () => (comment ? comment : new PostComment());

  getComments = async () => {
    const sql = `SELECT c.id, c.body, c.created_at, c.modified_at, c.current_status, u.username, u.avatar_url, u.full_name, p.title, p.slug_url FROM comment AS c JOIN user AS u ON u.id = c.user_id JOIN post AS p ON c.post_id = p.id;`;
    return await db.query<RowDataPacket[]>(sql).then(([rows, _]) => rows);
  };
}

export default PostComment;

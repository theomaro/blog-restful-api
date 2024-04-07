import { RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let post: Post | null;

class Post {
  title: string = "";
  summary: string = "";
  status: string = "";
  slug_url: string = "";
  author: {
    username: string;
    full_name: string;
    avatar_url: string;
  } = {
    username: "",
    full_name: "",
    avatar_url: "",
  };
  modified_at: string = "";

  static getInstance = () => (post = post ? post : new Post());

  getPosts = async () => {
    const sql =
      "SELECT p.title, p.summary, p.slug_url, p.current_status, p.modified_at, u.full_name, u.username, u.avatar_url FROM post AS p JOIN user AS u ON p.user_id=u.id ORDER BY title, modified_at DESC;";
    return await db.query<RowDataPacket[]>(sql).then(([rows, _]) => rows);
  };

  getPost = async (slug_url: string) => {
    const sql =
      "SELECT p.title, p.meta_title, p.summary, p.body, p.banner_url, p.slug_url, p.current_status, p.modified_at, u.full_name, u.username, u.avatar_url FROM post AS p JOIN user AS u ON p.user_id=u.id WHERE slug_url=?;";
    return await db
      .query<RowDataPacket[]>(sql, [slug_url])
      .then(([rows, _]) => rows[0]);
  };
}

export default Post;

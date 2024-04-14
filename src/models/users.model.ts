import { RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let user: User | null;

class User {
  static getInstance = () => (user ? user : new User());

  getUsers = async (id: string) => {
    const sql =
      "SELECT username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id != ? ORDER BY username, full_name DESC;";
    return await db.query<RowDataPacket[]>(sql, [id]).then(([rows, _]) => rows);
  };

  getUser = async (username: string) => {
    const sql =
      "SELECT current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, last_login_at FROM user WHERE username = ?;";
    return await db
      .query<RowDataPacket[]>(sql, [username])
      .then(([rows, _]) => rows[0]);
  };

  getUserPosts = async (username: string) => {
    const sql =
      "SELECT u.username, u.full_name, u.avatar_url, p.title, p.summary, p.slug_url, p.current_status as status, p.created_at, p.modified_at FROM user AS u JOIN post AS p ON u.id = p.user_id WHERE u.username = ?";
    return await db
      .query<RowDataPacket[]>(sql, [username])
      .then(([rows, _]) => rows);
  };
}

export default User;

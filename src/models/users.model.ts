import { RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let user: User | null;

class User {
  static getInstance = () => (user ? user : new User());

  getUsers = async (id: string, limit: number = 10, offset: number = 0) => {
    const sql =
      "SELECT username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id != ? LIMIT ? OFFSET ?;";
    return await db
      .query<RowDataPacket[]>(sql, [id, limit, offset])
      .then(([rows, _]) => rows);
  };

  getUser = async (username: string) => {
    const sql =
      "SELECT current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, last_login_at FROM user WHERE username = ?;";
    return await db
      .query<RowDataPacket[]>(sql, [username])
      .then(([rows, _]) => rows[0]);
  };
}

export default User;

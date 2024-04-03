import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let userAuth: UserAuth | null;

class UserAuth {
  static getInstance = () => (userAuth ? userAuth : new UserAuth());

  public registerUser = async (
    email: string,
    username: string,
    password_hash: string
  ) => {
    const sql = `INSERT INTO user (id, email, username, password_hash) VALUES (uuid(), ?, ?, ?);`;
    return await db
      .query<ResultSetHeader>(sql, [email, username, password_hash])
      .then(([rows, _]) => rows);
  };

  public isEmailExist = async (email: string) => {
    const sql = "SELECT email FROM user WHERE email=?;";
    const [rows, _] = await db.query<RowDataPacket[]>(sql, [email]);
    const rowData = rows[0];
    return rowData ? true : false;
  };

  public isUsernameExist = async (username: string) => {
    const sql = "SELECT username FROM user WHERE username=?;";
    const [rows, _] = await db.query<RowDataPacket[]>(sql, [username]);
    const rowData = rows[0];
    return rowData ? true : false;
  };

  public getUserBy = async (username: string) => {
    const sql =
      "SELECT id, username, password_hash, current_role FROM user WHERE username=?;";
    const [rows, _] = await db.query<RowDataPacket[]>(sql, [username]);
    return rows[0];
  };

  public updateLastLogin = async (id: string) => {
    const sql =
      "UPDATE user SET last_login_at=CURRENT_TIMESTAMP () WHERE id=?;";
    const [results, _] = await db.query<ResultSetHeader>(sql, [id]);

    return results;
  };
}

export default UserAuth;

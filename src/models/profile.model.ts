import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../config/db.config.js";

let profile: Profile | null = null;

interface UserProfile {
  id: string;
  username: string;
  current_role: string;
  full_name: string;
  sex: string;
  birth_date: string | null;
  phone: string;
  email: string;
  biography: string;
  location: string;
  avatar_url: string;
  current_status: string;
}

class Profile {
  static getInstance = () => (profile ? profile : new Profile());

  getProfile = async (id: string) => {
    const sql =
      "SELECT username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status FROM user WHERE id=?;";
    return await db
      .query<RowDataPacket[]>(sql, [id])
      .then(([rows, _]) => rows[0]);
  };

  public updateProfile = async (profile: UserProfile) => {
    let sql: string;

    if (profile.username) {
      sql =
        "UPDATE user SET full_name=?, sex=?, birth_date=?, phone=?, email=?, avatar_url=?, biography=?, location=?, modified_at=CURRENT_TIMESTAMP () WHERE username=?;";
      return await db
        .query<ResultSetHeader>(sql, [
          profile.full_name,
          profile.sex,
          profile.birth_date,
          profile.phone,
          profile.email,
          profile.avatar_url,
          profile.biography,
          profile.location,
          profile.username,
        ])
        .then(([rows, _]) => rows);
    } else {
      sql =
        "UPDATE user SET full_name=?, sex=?, birth_date=?, phone=?, email=?, avatar_url=?, biography=?, location=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;";
      return await db
        .query<ResultSetHeader>(sql, [
          profile.full_name,
          profile.sex,
          profile.birth_date,
          profile.phone,
          profile.email,
          profile.avatar_url,
          profile.biography,
          profile.location,
          profile.id,
        ])
        .then(([rows, _]) => rows);
    }
  };
  public updateUsername = async (id: string, username: string) => {
    const sql =
      "UPDATE user SET username=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;";
    return await db
      .query<ResultSetHeader>(sql, [username, id])
      .then(([rows, _]) => rows);
  };

  public updatePassword = async (id: string, password_hash: string) => {
    const sql =
      "UPDATE user SET password_hash=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;";
    return await db
      .query<ResultSetHeader>(sql, [password_hash, id])
      .then(([rows, _]) => rows);
  };

  public getCredentials = async (id: string) => {
    const sql = "SELECT username, password_hash FROM user WHERE id=?;";
    return await db
      .query<RowDataPacket[]>(sql, [id])
      .then(([rows, _]) => rows[0]);
  };

  public deleteProfile = async (id: string) => {
    const sql = "DELETE FROM user WHERE id=?;";
    return await db.query<ResultSetHeader>(sql, [id]).then(([rows, _]) => rows);
  };

  public getUsernames = async () => {
    const sql = "SELECT username FROM user;";
    return await db.query<RowDataPacket[]>(sql).then(([rows, _]) => rows);
  };
}

export default Profile;

import db from "../config/db.config.js";

let user = null;

class User {
  static getInstance = () => {
    return user ? user : new User();
  };

  getUsers = (id = "", limit = "", page = "") =>
    db.query(
      "SELECT id, username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id != ? LIMIT ? OFFSET ?;",
      [id, limit, page]
    );

  getUserById = (id) =>
    db.query(
      "SELECT id, username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id=?;",
      [id]
    );

  getCredentials = (id) =>
    db.query("SELECT username, password_hash FROM user WHERE id=?;", [id]);

  updateUsername = (id, username) =>
    db.query(
      "UPDATE user SET username=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;",
      [username, id]
    );

  updatePassword = (id, password_hash) =>
    db.query(
      "UPDATE user SET password_hash=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;",
      [password_hash, id]
    );

  deleteUserById = (id) => db.query("DELETE FROM user WHERE id=?;", [id]);

  updateUser = (user) =>
    db.query(
      "UPDATE user SET full_name=?, sex=?, birth_date=?, phone=?, email=?, avatar_url=?, biography=?, location=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;",
      [
        user.full_name,
        user.sex,
        user.birth_date,
        user.phone,
        user.email,
        user.avatar_url,
        user.biography,
        user.location,
        user.id,
      ]
    );
}

export default User;

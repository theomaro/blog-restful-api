import db from "../config/db.config.js";

let user = null;

class User {
  static getInstance = () => {
    return user ? user : new User();
  };

  getUserById = (id) =>
    db.query(
      "SELECT id, username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id=?;",
      [id]
    );

  getCredentials = (id) =>
    db.query("SELECT username, password_hash FROM user WHERE id=?;", [id]);

  deleteUserById = (id) => db.query("DELETE FROM user WHERE id=?;", [id]);
}

export default User;

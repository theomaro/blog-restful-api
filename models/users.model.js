import db from "../config/db.config.js";

let user = null;

class User {
  static getInstance = () => (user ? user : new User());

  getUsers = (id) =>
    db.query(
      "SELECT username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id != ?;",
      [id]
    );

  getUser = (username) =>
    db.query(
      "SELECT current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, last_login_at FROM user WHERE username = ?;",
      [username]
    );
}

export default User;

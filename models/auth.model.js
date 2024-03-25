import db from "../config/db.config.js";

let userAuth = null;

class AuthUser {
  static getInstance = () => {
    return userAuth ? userAuth : new AuthUser();
  };

  registerUser = (email, username, password_hash) => {
    const sql = `INSERT INTO user (id, email, username, password_hash) VALUES (uuid(), ?, ?, ?);`;
    return db.query(sql, [email, username, password_hash]);
  };

  isEmailExist = (email) =>
    db.query("SELECT email FROM user WHERE email=?;", [email]);

  isUsernameExist = (username) =>
    db.query("SELECT username FROM user WHERE username=?;", username);

  getUserBy = (username) =>
    db.query("SELECT id, username, password_hash FROM user WHERE username=?;", [
      username,
    ]);

  getUserById = (id) => {
    const sql =
      "SELECT id, username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status, modified_at, last_login_at FROM user WHERE id=?;";
    return db.query(sql, [id]);
  };

  updateLastLogin = (id) =>
    db.query("UPDATE user SET last_login_at=CURRENT_TIMESTAMP () WHERE id=?;", [
      id,
    ]);
}

export default AuthUser;

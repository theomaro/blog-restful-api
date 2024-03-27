import db from "../config/db.config.js";

let userAuth = null;

class AuthUser {
  static getInstance = () => (userAuth ? userAuth : new AuthUser());

  registerUser = (email, username, password_hash) =>
    db.query(
      `INSERT INTO user (id, email, username, password_hash) VALUES (uuid(), ?, ?, ?);`,
      [email, username, password_hash]
    );

  isEmailExist = (email) =>
    db.query("SELECT email FROM user WHERE email=?;", [email]);

  isUsernameExist = (username) =>
    db.query("SELECT username FROM user WHERE username=?;", username);

  getUserBy = (username) =>
    db.query("SELECT id, username, password_hash FROM user WHERE username=?;", [
      username,
    ]);

  updateLastLogin = (id) =>
    db.query("UPDATE user SET last_login_at=CURRENT_TIMESTAMP () WHERE id=?;", [
      id,
    ]);
}

export default AuthUser;

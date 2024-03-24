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
}

export default AuthUser;

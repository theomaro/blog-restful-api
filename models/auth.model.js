import db from "../config/db.config.js";

let userAuth = null;

class AuthUser {
  static getInstance = () => {
    return userAuth ? userAuth : new AuthUser();
  };
}

export default AuthUser;

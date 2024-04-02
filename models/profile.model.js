import db from "../config/db.config.js";

let profile = null;

class Profile {
  static getInstance = () => (profile ? profile : new Profile());

  getProfile = (id) =>
    db.query(
      "SELECT username, current_role, full_name, sex, birth_date, phone, email, biography, location, avatar_url, current_status FROM user WHERE id=?;",
      [id]
    );

  updateProfile = (profile) =>
    db.query(
      "UPDATE user SET full_name=?, sex=?, birth_date=?, phone=?, email=?, avatar_url=?, biography=?, location=?, modified_at=CURRENT_TIMESTAMP () WHERE id=?;",
      [
        profile.full_name,
        profile.sex,
        profile.birth_date,
        profile.phone,
        profile.email,
        profile.avatar_url,
        profile.biography,
        profile.location,
        profile.id,
      ]
    );

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

  getCredentials = (id) => db.query("SELECT username, password_hash FROM user WHERE id=?;", [id]);
  deleteProfile = (id) => db.query("DELETE FROM user WHERE id=?;", [id]);

  getUsernames = () => db.query("SELECT username FROM user;");
}

export default Profile;

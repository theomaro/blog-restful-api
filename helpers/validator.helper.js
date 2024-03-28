import Joi from "joi";

const register = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string()
    .regex(new RegExp("(?=.*([A-Z]){1,})"), "uppercase")
    .message("Must have at least one uppercase")
    .regex(new RegExp("(?=.*[a-z]{1,})"), "lowercase")
    .message("Must have at least one lowercase")
    .regex(new RegExp("(?=.*[)(!@#$&*]{1,})"), "character")
    .message("Must have at least one character")
    .regex(new RegExp("(?=.*[0-9]{1,})"), "number")
    .message("Must have at least one number")
    .regex(new RegExp(".{8,30}"), "min")
    .message("Must be at least 8 character long")
    .required(),
  confirmed_password: Joi.ref("password"),
}).with("password", "confirmed_password");

const login = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().required(),
});

const passwords = Joi.object({
  oldPassword: Joi.string()
    .regex(new RegExp("(?=.*([A-Z]){1,})"), "uppercase")
    .message("oldPassword Must have at least one uppercase")
    .regex(new RegExp("(?=.*[a-z]{1,})"), "lowercase")
    .message("oldPassword Must have at least one lowercase")
    .regex(new RegExp("(?=.*[)(!@#$&*]{1,})"), "character")
    .message("oldPassword Must have at least one character")
    .regex(new RegExp("(?=.*[0-9]{1,})"), "number")
    .message("oldPassword Must have at least one number")
    .regex(new RegExp(".{8,30}"), "min")
    .message("oldPassword Must be at least 8 character long")
    .required(),
  newPassword: Joi.string()
    .regex(new RegExp("(?=.*([A-Z]){1,})"), "uppercase")
    .message("Must have at least one uppercase")
    .regex(new RegExp("(?=.*[a-z]{1,})"), "lowercase")
    .message("Must have at least one lowercase")
    .regex(new RegExp("(?=.*[)(!@#$&*]{1,})"), "character")
    .message("Must have at least one character")
    .regex(new RegExp("(?=.*[0-9]{1,})"), "number")
    .message("Must have at least one number")
    .regex(new RegExp(".{8,30}"), "min")
    .message("Must be at least 8 character long")
    .required(),
  confirmedNewPassword: Joi.ref("newPassword"),
});

const profile = Joi.object({
  full_name: Joi.string().allow(""),
  sex: Joi.string().allow(""),
  birth_date: Joi.string().isoDate().allow(""),
  phone: Joi.string().allow(""),
  email: Joi.string().email({ minDomainSegments: 2 }),
  avatar_url: Joi.string().allow(""),
  biography: Joi.string().allow(""),
  location: Joi.string().allow(""),
});

const uname = Joi.object({
  username: Joi.string().min(3).max(30).required(),
});

export { register, login, passwords, profile, uname };

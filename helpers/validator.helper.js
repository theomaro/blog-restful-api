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

export { register, login };

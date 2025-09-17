import { body } from "express-validator";
import { getUser } from "./models/users.js";
import { pbkdf2Promisified } from "./utility.js";
import { timingSafeEqual } from "crypto";

const todoV = [
  body("title").isString().trim().notEmpty().withMessage("Заголовок не указан"),
  body("desc").isString().trim(),
];

const registerV = [
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Не указано имя пользователя")
    .custom((value) => {
      if (getUser(value))
        throw new Error("Пользователь с таким именем уже есть");
      return true;
    }),
  body("password").isString().trim().notEmpty().withMessage("Не указан пароль"),
  body("password2")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Не указан повторно пароль")
    .custom((value, { req }) => {
      if (req.body.password !== value)
        throw new Error("Введенные пароли не совпадают");
      return true;
    }),
];

const loginV = [
  body("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Не указано имя пользователя")
    .custom((value, { req }) => {
      const user = getUser(value);
      if (user) {
        req.__user = user;
        return true;
      } else {
        throw new Error("Пользовать с таким именем не найден");
      }
    }),

  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Не указан пароль")
    .custom(async (value, { req }) => {
      if (req.__user) {
        const savedPasswordHash = Buffer.from(req.__user.password);
        const salt = Buffer.from(req.__user.salt);
        const passwordHash = await pbkdf2Promisified(
          value,
          salt,
          100000,
          32,
          "sha256"
        );
        if (timingSafeEqual(savedPasswordHash, passwordHash)) return true;
        else throw new Error("Неправильный пароль");
      } else {
        return true;
      }
    }),
];

const removeAccountV = [
  body("password")
    .notEmpty()
    .isString()
    .trim()
    .withMessage("Не указан пароль")
    .custom(async (value, { req }) => {
      if (req.user) {
        const deleteInfo = getUser(req.user.username);

        const salt = Buffer.from(req.username.salt);
        const passwordHash = await pbkdf2Promisified(
          value,
          salt,
          100000,
          32,
          "sha256"
        );
        if (timingSafeEqual(savedPasswordHash, passwordHash)) return true;
        else throw new Error("Неправильный пароль");
      } else if (!username) {
        throw new Error("Не правильно");
      }
    }),
];

export { todoV, registerV, loginV, removeAccountV };

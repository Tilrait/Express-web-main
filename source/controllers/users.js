import { randomBytes } from "crypto";
import { pbkdf2Promisified } from "../utility.js";
import { addUser } from "../models/users.js";

export function registerPage(req, res) {
  res.render("register", { title: "Регистрация" });
}

export async function register(req, res) {
  const salt = randomBytes(16);
  const hash = await pbkdf2Promisified(
    req.body.password,
    salt,
    100000,
    32,
    "sha256"
  );

  const user = {
    username: req.body.username,
    password: hash,
    salt: salt,
  };
  await addUser(user);
  res.redirect("/");
}

export function loginPage(req, res) {
  res.render("login", { title: "Вход" });
}

export function login(req, res, next) {
  req.session.regenerate((err) => {
    if (err) 
        next(err);
    else {
      req.session.user = {
        id: req.__user._id,
        name: req.__user.username,
      };
      req.session.save((err) => {
        if (err) {
          next(err);
        } else {
          res.redirect("/");
        }
      });
    }
  });
}

export function logout(req, res, next) {
    delete req.session.user;
    req.session.save((err) => {
        if (err)
            next(err)
        else {
            req.session.regenerate((err) => {
                if (err)
                    next(err);
                else
                    res.redirect('/login')
            })
        }
    })
}

// Контроллер на удаление аккаунта
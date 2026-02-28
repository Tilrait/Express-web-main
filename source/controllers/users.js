import { randomBytes } from "crypto";
import { pbkdf2Promisified } from "../utility.js";
import { addUser, deleteUserModel } from "../models/users.js";
import { deleteAllUserTodos } from "../controllers/todos.js";

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

  // тут сохранить сессию по данным, которые выше получили в addUser
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

export function confirmDeletePage(req, res) {
  res.render("confDel", { title: "Подтверждение" });
}

export async function deleteUser(req, res, next) {
  try {
    await deleteUserModel(req.session.user.id);
    await deleteAllUserTodos(req, res, next);
    logout(req, res, next);
  } catch (err) {
    next(err);
  }
}


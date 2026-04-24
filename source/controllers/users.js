import { randomBytes } from 'crypto';
import { pbkdf2Promisified } from '../utility.js';
import { addUser, deleteUserModel } from '../models/users.js';
import { deleteAllUserTodosModel } from '../models/todos.js';

function createSessionAndLogin(req, res, next, user) {
  req.session.regenerate((err) => {
    if (err) next(err);
    else {
      req.session.user = {
        id: user._id,
        name: user.username,
      };
      req.session.save((err) => {
        if (err) {
          next(err);
        } else {
          res.status(200);
          res.end();
        }
      });
    }
  });
}

export function registerPage(req, res) {
  // res.render('register', { title: 'Регистрация' });
  res.status(200);
  res.end();
}

export async function register(req, res, next) {
  try {
    const salt = randomBytes(16);
    const hash = await pbkdf2Promisified(req.body.password, salt, 100000, 32, 'sha256');

    const user = {
      username: req.body.username,
      password: hash,
      salt: salt,
    };
    const createdUser = await addUser(user);

    createSessionAndLogin(req, res, next, createdUser);
  } catch (err) {
    next(err);
  }
  // тут сохранить сессию по данным, которые выше получили в addUser
}

export function loginPage(req, res) {
  // res.render('login', { title: 'Вход' });
}

export function login(req, res, next) {
  createSessionAndLogin(req, res, next, req.__user);
}

export function logout(req, res, next) {
  delete req.session.user;
  req.session.save((err) => {
    if (err) next(err);
    else {
      req.session.destroy((err) => {
        if (err) next(err);
        else res.redirect('/login');
      });
    }
  });
}

export function confirmDeletePage(req, res) {
  res.render('confDel', { title: 'Подтверждение' });
}

export async function deleteUser(req, res, next) {
  try {
    await deleteAllUserTodosModel(req.session.user.id);
    await deleteUserModel(req.session.user.id);
    logout(req, res, next);
  } catch (err) {
    next(err);
  }
}

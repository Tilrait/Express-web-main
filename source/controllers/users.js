import { randomBytes } from 'crypto';
import { pbkdf2Promisified, signPromisified } from '../utility.js';
import { addUser, deleteUserModel } from '../models/users.js';
import { deleteAllUserTodosModel } from '../models/todos.js';

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

    res.status(201);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function login(req, res) {
  const token = await signPromisified({ username: req.__user.username }, process.env.JWT_SECRET);
  res.json({ token: token });
}

export async function deleteUser(req, res, next) {
  try {
    await deleteAllUserTodosModel(req.user._id);
    await deleteUserModel(req.user._id);
    res.status(204);
    res.end();
  } catch (err) {
    next(err);
  }
}

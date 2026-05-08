import {
  getListTodos,
  getItem,
  addItem,
  setDoneItem,
  deleteItem,
  getMostActiveUsers,
} from '../models/todos.js';
import { getUsersCount } from '../models/users.js';
import createError from 'http-errors';
import { join } from 'path';
import { rm } from 'fs/promises';
import { currentDir } from '../utility.js';

export async function mainPage(req, res, next) {
  try {
    let list = await getListTodos(req.user.id, req.query.doneAtLast, req.query.search);

    // res.render('main', {
    //   todos: list,
    //   title: 'Главная',
    // });
    res.json({
      todos: list,
    });
  } catch (err) {
    next(err);
  }
}

export async function detailPage(req, res, next) {
  try {
    const toDoObject = await getItem(req.params.id, req.user.id);
    if (!toDoObject) {
      throw createError(404, 'Запрошенное дело не существует');
    }

    res.json({
      item: toDoObject.toJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// не понадобится
// export function addPage(req, res) {
//   res.render('add', {
//     title: 'Добавление дела',
//   });
// }

export async function add(req, res, next) {
  try {
    const todo = {
      title: req.body.title,
      desc: req.body.desc || '',
      user: req.user.id,
    };

    if (req.file) todo.addendum = req.file.filename;

    await addItem(todo);
    res.status(201);
    res.end();
  } catch (err) {
    next(err);
  }
}

export async function setDone(req, res, next) {
  try {
    if (await setDoneItem(req.params.id, req.user.id)) {
      res.status(202);
      res.end();
    } else {
      throw createError(404, 'Запрошенное дело не существует');
    }
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const t = await deleteItem(req.params.id, req.user.id);
    if (!t) throw createError(404, 'Запрошенное дело не существует');
    if (t.addendum) await rm(join(currentDir, 'storage', 'uploaded', t.addendum));
    res.status(204);
    res.end();
  } catch (err) {
    next(err);
  }
}

// Должны будем удалить его, окажется не нужным.
// export function setOrder(req, res) {
//   res.cookie('doneAtLast', req.body.done_at_last);
//   res.redirect('back');
// }

export async function mostActiveUsers(req, res) {
  const usersCount = await getUsersCount();
  const result = await getMostActiveUsers();
  // res.render('most-active', {
  //   title: 'Активные пользователи',
  //   mostActiveAll: result[0],
  //   mostActiveDone: result[1],
  //   todosCount: result[2],
  //   usersCount: usersCount,
  // });
  res.json({
    mostActiveAll: result[0],
    mostActiveDone: result[1],
    todosCount: result[2],
    usersCount: usersCount,
  });
  ƒ;
}

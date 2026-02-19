import {
  getListTodos,
  getItem,
  addItem,
  setDoneItem,
  deleteItem,
} from "../models/todos.js";
import createError from "http-errors";
import { join } from "path";
import { rm } from "fs/promises";
import { currentDir } from "../utility.js";

export function infoPage(req, res) {
  res.render("info", {
    title: "Информация",
  });
}

export async function mainPage(req, res, next) {
  try {
    let list = await getListTodos(
      req.user.id,
      req.cookies.doneAtLast,
      req.query.search
    );

    res.render("main", {
      todos: list,
      title: "Главная",
    });
  } catch (err) {
    next(err);
  }
}

export async function detailPage(req, res, next) {
  try {
    const toDoObject = await getItem(req.params.id, req.user.id);
    console.log(toDoObject);
    if (!toDoObject) {
      throw createError(404, "Запрошенное дело не существует");
    }

    res.render("detail", {
      title: toDoObject.title,
      item: toDoObject,
    });
  } catch (err) {
    next(err);
  }
}

export function addPage(req, res) {
  res.render("add", {
    title: "Добавление дела",
  });
}

export async function add(req, res, next) {
  try {
    const todo = {
      title: req.body.title,
      desc: req.body.desc || "",
      user: req.user.id,
    };

    if (req.file) todo.addendum = req.file.filename;

    await addItem(todo);
    res.redirect(req.baseUrl);
  } catch (err) {
    next(err);
  }
}

export async function setDone(req, res, next) {
  try {
    if (await setDoneItem(req.params.id, req.user.id)) {
      res.redirect(req.baseUrl);
    } else {
      throw createError(404, "Запрошенное дело не существует");
    }
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const t = await deleteItem(req.params.id, req.user.id);
    if (!t) throw createError(404, "Запрошенное дело не существует");
    if (t.addendum)
      await rm(join(currentDir, "storage", "uploaded", t.addendum));
    res.redirect(req.baseUrl);
  } catch (err) {
    next(err);
  }
}

export function setOrder(req, res) {
  res.cookie("doneAtLast", req.body.done_at_last);
  res.redirect("back");
}

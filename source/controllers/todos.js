import { getListTodos, getItem, addItem, setDoneItem, deleteItem } from "../models/todos.js";
import createError from "http-errors";
import { join } from "path";
import { rm } from "fs/promises";
import { currentDir } from "../utility.js";

export function infoPage(req, res) {
  res.render("info", {
    title: "Информация",
  });
}

export function mainPage(req, res) {
  let list = getListTodos(req.user.id);
  
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter((el) => {
      if (el.title.toLowerCase().includes(q)) return true
      return false
    })
  }

  if (req.cookies.doneAtLast == "1") {
    list = [...list];
    list.sort((a, b) => {
      const done1 = a.done || false;
      const done2 = b.done || false;
      if (done1 - done2 != 0) {
        return done1 - done2
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
    })
  }
  
  res.render("main", {
    todos: list,
    title: "Главная",
  });
}

export function detailPage(req, res) {
  const toDoObject = getItem(req.params.id, req.user.id);

  if (!toDoObject) {
    throw createError(404, "Запрошенное дело не существует")
  }

  res.render("detail", {
    title: toDoObject.title,
    item: toDoObject,
  });
}

export function addPage(req, res) {
  res.render("add", {
    title: "Добавление дела"
  })
}

export function add(req, res) {
  const todo = {
    title: req.body.title,
    desc: req.body.desc || "",
    createdAt: (new Date()).toString(),
    user: req.user.id
  };

  if (req.file)
    todo.addendum = req.file.filename;

  addItem(todo);
  res.redirect(req.baseUrl);
  
}

export function setDone(req, res) {
  if (setDoneItem(req.params.id, req.user.id)) {
    res.redirect(req.baseUrl);
  } else {
    throw createError(404, "Запрошенное дело не существует")
  }
}

export async function remove(req, res, next) {
  try {
    const t = getItem(req.params.id, req.user.id);
    if (!t) 
      throw createError(404, "Запрошенное дело не существует");
    deleteItem(t._id, req.user.id);
    if (t.addendum)
      await rm(join(currentDir, "storage", "uploaded", t.addendum));
    res.redirect(req.baseUrl);
  } catch (err) {
    next(err)
  }
}

export function setOrder(req, res) {
  res.cookie("doneAtLast", req.body.done_at_last);
  res.redirect("back");
}
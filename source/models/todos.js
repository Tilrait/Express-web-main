import { Todo } from "./__loaddatabase.js";
import { rm } from "fs/promises"
import { currentDir } from "../utility.js";
import { join } from "path";

export async function getListTodos(userId, doneAtLast, search) {
  const qTodos = Todo.find({ user: userId });
  if (doneAtLast === "1") {
    qTodos.sort("done createdAt");
  } else {
    qTodos.sort("createdAt");
  }

  if (search)
    qTodos.or([
      { title: new RegExp(search, "i") },
      { desc: new RegExp(search, "i") },
    ]);
  return await qTodos;
}

export async function getItem(id, user) {
  return await Todo.findOne({ _id: id, user: user });
}

export async function addItem(todo) {
  const oTodo = new Todo(todo);
  await oTodo.save();
}

export async function setDoneItem(id, user) {
  const oTodo = await getItem(id, user);
  if (oTodo) {
    oTodo.done = true;
    await oTodo.save();
    return true;
  } else {
    return false;
  }
}

export async function deleteItem(id, user) {
  return await Todo.findOneAndDelete({ _id: id, user: user });
}

export async function deleteAllUserTodosModel(userId) {
  const todos = await Todo.find({ user: userId });
  for (let todo of todos) {
    if (todo.addendum) {
      try {
        await rm(join(currentDir, "storage", "uploaded", todo.addendum));
      } catch (err) {
        console.error(err)
      }
    }
  }
  return await Todo.deleteMany({ user: userId });
}
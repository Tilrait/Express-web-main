import { Todo } from "./__loaddatabase.js";

export async function getListTodos(user, doneAtLast, search) {
    return await Todo.find({ user: user });
    // doneAtLast и search потом доделаем
}

export async function getItem(id, user) {
    return await Todo.findOne({_id: id, user: user, })
}

export async function addItem(todo) {
    const oTodo = new Todo(todo)
    await oTodo.save()
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


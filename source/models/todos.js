import { Todo } from './__loaddatabase.js';
import { rm } from 'fs/promises';
import { currentDir } from '../utility.js';
import { join } from 'path';

export async function getListTodos(userId, doneAtLast, search) {
  const qTodos = Todo.find({ user: userId });
  if (doneAtLast === '1') {
    qTodos.sort('done createdAt');
  } else {
    qTodos.sort('createdAt');
  }

  if (search) qTodos.contains(search);
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
  return await Todo.findOneAndSetDone(id, user);
}

export async function reopenItem(id) {
  return await Todo.findOneAndReopen(id);
}

export async function deleteItem(id, user) {
  return await Todo.findOneAndDelete({ _id: id, user: user });
}

export async function deleteAllUserTodosModel(userId) {
  const todos = await Todo.find({ user: userId });
  for (let todo of todos) {
    if (todo.addendum) {
      try {
        await rm(join(currentDir, 'storage', 'uploaded', todo.addendum));
      } catch (err) {
        console.error(err);
      }
    }
  }
  return await Todo.deleteMany({ user: userId });
}

export async function getMostActiveUsers() {
  const result = [];

  result.push(
    await Todo.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userObj',
        },
      },
      {
        $unwind: '$userObj',
      },
      {
        $group: { _id: '$userObj.username', cnt: { $count: {} } },
      },
      {
        $sort: { cnt: -1 },
      },
      {
        $limit: 3,
      },
    ]),
  );

  result.push(
    await Todo.aggregate([
      {
        $match: {
          done: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userObj',
        },
      },
      {
        $unwind: '$userObj',
      },
      {
        $group: { _id: '$userObj.username', cnt: { $count: {} } },
      },
      {
        $sort: { cnt: -1 },
      },
      {
        $limit: 3,
      },
    ]),
  );
  // await Todo.find().estimatedDocumentCount(); можно и так
  const count = await Todo.aggregate([
    {
      $group: { _id: null, cnt: { $count: {} } },
    },
  ]);
  result.push(count[0]?.cnt ?? 0);
  return result;
}
import { dataBase } from "./__loaddatabase.js";
import { ObjectId } from "mongodb";

const todos = dataBase.collection("todos");

export async function getList(user, doneAtLast, search) {
    const find = { user: new ObjectId(user) };
    if (search)
        find.$or = [
            { title: new RegExp(search, 'i') },
            { desc: new RegExp(search, 'i') }
        ];
    const sort = doneAtLast === '1' ? { done: 1 } : {};
    sort.createdAt = 1;
    return await todos.find(find, { sort: sort }).toArray();
}

export async function getItem(id, user) {
    return await todos.findOne({
        _id: new ObjectId(id),
        user: new ObjectId(user)
    });
}

export async function addItem(todo) {
    todo.user = new ObjectId(todo.user);
    await todos.insertOne(todo)
}

export async function setDoneItem(id, user) {
    const result = await todos.updateOne({
        _id: new ObjectId(id),
        user: new ObjectId(user)

    }, { $set: { done: true } }
    );
    return result.acknowledged && (result.modifiedCount == 1);
}

export async function deleteItem(id, user) {
    const result = await todos.deleteOne({
        _id: new ObjectId(id),
        user: new ObjectId(user)
    }
    );
    return result.acknowledged && (result.deletedCount == 1 );
}

export async function deleteAllItems(user) {
    todos.deleteMany({ user: new ObjectId(user) })
}
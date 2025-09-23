import { ObjectId } from "mongodb";
import { dataBase } from "./__loaddatabase.js";
import { deleteAllItems } from "./todos.js";

const users = dataBase.collection('users');

export async function getUser(name) {
    const user = await users.findOne({ username: name });
    return user
}

export async function addUser(user) {
    await users.insertOne(user);
}

// написать модель для удаления пользователя
export async function deleteUser(user) {
    await deleteAllItems(user);
    await users.deleteOne({ _id: new ObjectId(user) });
}
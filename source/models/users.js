import { dataBase, getObjectId, saveDatabase } from "./__loaddatabase.js";

const users = dataBase.users;

export function getUser(name) {
    return users.find((el) => el.username === name)
}

export function addUser(user) {
    user._id = getObjectId();
    users.push(user);
    saveDatabase();
}

// написать модель для удаления пользователя
import { User } from "./__loaddatabase.js";


export async function getUser(name) {
    return await User.findOne({username: name})
}

export async function addUser(user) {
    const oUser = new User(user)
    await oUser.save();
}
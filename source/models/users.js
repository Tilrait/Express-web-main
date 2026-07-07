import { User } from './__loaddatabase.js';

export async function getUser(name) {
  return await User.findOne({ username: name });
}

export async function addUser(user) {
  const oUser = new User(user);
  return await oUser.save();
}

export async function deleteUserModel(userId) {
  await User.findByIdAndDelete(userId);
}

export async function getUsersCount() {
  const result = await User.aggregate([
    {
      $group: { _id: null, cnt: { $count: {} } },
    },
  ]);
  return result[0]?.cnt ?? 0;
}

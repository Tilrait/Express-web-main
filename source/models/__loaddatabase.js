import { connect, Schema, model } from 'mongoose';

const uri = process.env.URI || 'mongodb://127.0.0.1:27017';
const dbname = process.env.DBNAME || 'todos';

const scTodo = new Schema(
  {
    title: String,
    desc: String,
    addendum: String,
    done: Boolean,
    createdAt: {
      type: Date,
      index: true,
      default: () => new Date(),
    },
    user: {
      type: Schema.Types.ObjectId,
    },
  },
  {
    versionKey: false,
    methods: {
      async setDone() {
        this.done = true;
        await this.save();
      },
      async reopen() {
        this.done = false;
        await this.save();
      },
    },
    statics: {
      async findOneAndSetDone(id, user) {
        const todo = await this.findOne({ _id: id, user: user });
        if (todo) await todo.setDone();
        return todo;
      },
    },
    query: {
      contains(val) {
        return this.or([{ title: new RegExp(val, 'i') }, { desc: new RegExp(val, 'i') }]);
      },
    },
  },
);

scTodo.index({ done: 1, createdAt: 1 });

const scUser = new Schema(
  {
    username: {
      type: String,
      index: true,
    },
    password: Buffer,
    salt: Buffer,
  },
  {
    versionKey: false,
  },
);

await connect(uri, { dbname: dbname });
export const Todo = model('Todo', scTodo);
export const User = model('User', scUser);

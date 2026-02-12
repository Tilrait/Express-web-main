import { connect, Schema, model } from "mongoose";

const uri = process.env.URI || 'mongodb://127.0.0.1:27017';
const dbname = process.env.DBNAME || 'todos';


const scTodo = new Schema({
    title: String,
    desc: String,
    addendum: String,
    done: Boolean,
    createdAt: {
        type: Date,
        index: true,
        default: () => new Date()
    },
    user: {
        type: Schema.Types.ObjectId
    },
    index: true
}, {
    versionKey: false
}
);

scTodo.index({ done: 1, createdAt: 1 })

const scUser = new Schema({
    username: {
        type: String,
        index: true
    },
    password: Buffer,
    salt: Buffer,
}, {
    versionKey: false
})
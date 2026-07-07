import { Router, static as staticMiddleware } from 'express';
import {
  detailPage,
  mainPage,
  setDone,
  remove,
  mostActiveUsers,
  add,
} from './controllers/todos.js';
import {
  handleErrors,
  loadCurrentUser,
  isGuest,
  isLoggedIn,
  addendumWrapper,
} from './middleware.js';
import { registerV, loginV, removeAccountV, todoV } from './validators.js';
import { login, register, deleteUser } from './controllers/users.js';
import cors from 'cors';

const routerMain = Router();
const routerTodos = Router();

routerMain.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// middlewares
routerMain.use('/uploaded', staticMiddleware('storage/uploaded'));

routerMain.use(loadCurrentUser);

routerMain.post('/register', isGuest, registerV, handleErrors, register);
routerMain.post('/login', isGuest, loginV, handleErrors, login);


routerMain.get('/mostactive', mostActiveUsers);


routerMain.use(isLoggedIn);

routerMain.use('/todos', routerTodos);

routerMain.post('/delete', removeAccountV, handleErrors, deleteUser);


// /todos routes
routerTodos.post('/', addendumWrapper, todoV, handleErrors, add);
routerTodos.get('/:id', detailPage);
routerTodos.put('/:id', setDone);
routerTodos.delete('/:id', remove);
routerTodos.get('/', mainPage);

export default routerMain;

import { Router, static as staticMiddleware } from "express";
import session from "express-session";
import _FileStore from "session-file-store";
import { flash } from "express-flash-message";

import { detailPage, mainPage, infoPage, addPage, add, setDone, remove, setOrder } from "./controllers/todos.js";
import { handleErrors, requestToContext, extendFlashAPI, getErrors, addendumWrapper, loadCurrentUser, isGuest, isLoggedIn } from "./middleware.js";
import { todoV, registerV, loginV, removeAccountV } from "./validators.js";
import { loginPage, login, register, registerPage, logout } from "./controllers/users.js";

const FileStore = _FileStore(session)

const routerMain = Router();
const routerTodos = Router();

// middlewares
routerMain.use('/uploaded', staticMiddleware("storage/uploaded"));
routerMain.use(staticMiddleware('public'));
routerMain.use(requestToContext);
routerMain.use(session({
    store: new FileStore({
        path: "./storage/sessions",
        reapAsync: true,
        reapSyncFallback: true,
        fallbackSessionFn: () => {
            return {}
        },
        logFn: () => {}
    }),
    secret: "abcdefgh",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}));
routerMain.use(flash({ sessionKeyName: "flash-message" }));
routerMain.use(extendFlashAPI);
routerMain.use(loadCurrentUser);

routerMain.get("/register", isGuest, getErrors, registerPage);
routerMain.post("/register", isGuest, registerV, handleErrors, register);
routerMain.get("/login", isGuest, getErrors, loginPage);
routerMain.post("/login", isGuest, loginV, handleErrors, login);
// get на форму удаления аккаунта

routerMain.delete("/delete", isLoggedIn, removeAccountV, handleErrors, deleteUser);
routerMain.get("/", infoPage);

routerMain.use(isLoggedIn);

routerMain.use("/todos", routerTodos);
routerMain.post("/logout", logout);

// /todos routes
routerTodos.get("/add", getErrors, addPage);
routerTodos.post("/add", addendumWrapper, todoV, handleErrors, add);
routerTodos.get("/:id", detailPage);
routerTodos.put("/:id", setDone);
routerTodos.delete("/:id", remove);
routerTodos.get("/", mainPage);
routerTodos.post("/", setOrder);

export default routerMain

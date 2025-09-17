import methodOverride from "method-override";
import express, { urlencoded } from "express";
import { config } from "dotenv";
import "./source/models/__loaddatabase.js";
import router from "./source/router.js";
import { error500Handler, mainErrorHandler } from "./source/error-handlers.js";
import cookieParser from "cookie-parser";

config();

const port = process.env.PORT || 8000;
const app = express();

app.use(cookieParser())
app.use(urlencoded({ extended: true}));
app.use(methodOverride("_method"));

app.locals.appTitle = process.env.APPTITLE || "Express";
app.set("view engine", "ejs");
app.set("views", "./source/templates");

app.use("/", router);

app.use(mainErrorHandler, error500Handler);

app.listen(port);

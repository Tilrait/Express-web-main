import express, { urlencoded } from 'express';
import { config } from 'dotenv';
import './source/models/__loaddatabase.js';
import router from './source/router.js';
import { error500Handler, mainErrorHandler } from './source/error-handlers.js';
import { adminRouter, rootPath } from './source/admin/admin.js';

config();

const port = process.env.PORT || 8000;
const app = express();

app.use(urlencoded({ extended: true }));

app.use(rootPath, adminRouter);

app.locals.appTitle = process.env.APPTITLE || 'Express';

app.use('/', router);

app.use(mainErrorHandler, error500Handler);

app.listen(port);

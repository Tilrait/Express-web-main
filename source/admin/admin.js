import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import { config } from 'dotenv';
import { Todo, User } from '../models/__loaddatabase.js';
import { currentDir, pbkdf2Promisified } from '../utility.js';
import { deleteAllUserTodosModel } from '../models/todos.js';
import { rm } from 'fs/promises';
import { join } from 'path';

config();

const rootPath = '/admin';

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const admin = new AdminJS({
  resources: [
    // объект ресурса для пользователя
    {
      resource: User,
      options: {
        properties: {
          password: {
            isVisible: {
              list: false, // не показывать пароль в списке пользователей
              filter: false, // не использовать пароль в фильтрах по пользователям
              show: false, // Не показывать в подробной информации о пользователе
              edit: true, // Показывать при создании
            },
          },
          salt: {
            isVisible: {
              list: false, // не показывать соль в списке пользователей
              filter: false, // не использовать соль в фильтрах по пользователям
              show: false, // Не показывать в подробной информации о пользователе
              edit: false, // не показывать при создании
            },
          },
        },
        actions: {
          edit: { isAccessible: false },
          new: {
            before: async (request) => {
              const rawPassword = request.payload.password;
              if (typeof rawPassword !== 'string' || rawPassword.trim().length === 0) {
                throw new Error('Пароль обязателен');
              }
              const salt = randomBytes(16);
              const hash = await pbkdf2Promisified(req.body.password, salt, 100000, 32, 'sha256');

              request.payload = {
                ...request.payload,
                password: hash,
                salt: salt,
              };
              return request;
            },
          },
          delete: {
            before: async (request) => {
              const userId = request.params.recordId;
              if (userId) await deleteAllUserTodosModel(userId);
              return request;
            },
          },
        },
      },
    },
    // ресурс для дел
    {
      resource: Todo,
      options: {
        properties: {
          user: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          title: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
            },
          },
          desc: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
            },
          },
          addendum: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
            },
          },
        },
        actions: {
          delete: {
            before: async (request, context) => {
              const addendum = context.record.params.addendum;
              if (addendum) await rm(join(currentDir, 'storage', 'uploaded', addendum));
              return request;
            },
          },
        },
        actions: {
          openCloseTask: {
            actionType: 'record',
            label: 'CheckCircle',
            handler: async (request, response, context) => {
              const { record, currentAdmin } = context;
              const tId = request.params.recordId;
              const todo = await Todo.findById(tId);
              todo.reopen();
              return {
                record: record.toJSON(currentAdmin),
                msg: 'Дело открыто',
              };
            },
          },
        },
      },
    },
  ],
  rootPath: rootPath,
  branding: {
    companyName: 'Админка megalast',
    logo: false,
  },
});

const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL || 'defaultAdmin@admin.com',
  password: process.env.ADMIN_PASSWORD || 'admin',
};

async function authenticate(email, password) {
  if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password)
    return Promise.resolve(DEFAULT_ADMIN);
  return false;
}
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    cookieName: process.env.ADMINJS_COOKIE_NAME || 'admingjs',
    cookiePassword: process.env.ADMINJS_COOKIE_PASSWORD || 'adminjs-cookie-password',
    authenticate: authenticate,
  },
  null,
  {
    secret: process.env.ADMINJS_SESSION_SECRET || 'adminjs-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 60 * 60 * 24,
    },
  },
);

export { admin, adminRouter, rootPath };

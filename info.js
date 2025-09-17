function middleware(req, res, next) {
  // Часть до передачи запроса контроллеру (или следующему посреднику)
  next();
  // Часть после получения ответа от контроллера
}

function logger(req, res, next) {
  next();
  console.log(`${req.url} ${res.statusCode} ${res.statusMessage}`);
}

function methodSender(req, res, next) {
  const method = req.method;
  res.append("X-Method", method);
  next();
}

app.get("/user-account", (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use(
  (req, res, next) => {
    console.log("Первый посредник");
    if (что - то) {
      next("router");
    } else {
      next();
    }
  },
  (req, res, next) => {
    console.log("Второй посредник");
    next();
  }
);

app.get("/", (req, res) => {
  console.log("Контроллер1");
});
app.get("/", (req, res) => {
  console.log("Контроллер2");
});

app.get(
  "/",
  // посредник
  (req, res, next) => {
    if (req.user) {
      next();
    } else {
      next("route");
    }
  },
  // контроллер, для авторизованных
  (req, res) => {
    res.render("main-logged-in");
  }
);

app.get(
  "/",
  // контроллер, для неавторизованных
  (req, res) => {
    res.render("main-not-logged-in");
  }
);

app.use(logger);
app.use(methodSender);

function getLogger(showStatusMessage = true) {
  if (showStatusMessage) {
    // верни одного посредника
    return (req, res, next) => {
      next();
      console.log(`${req.url} ${res.statusCode} ${res.statusMessage}`);
    };
  } else {
    // верни другого посредника
    return (req, res, next) => {
      next();
      console.log(`${req.url} ${res.statusCode}`);
    };
  }
}

// в этом случае вернётся посредниек с показыванием statusMessage
app.use(getLogger());
// а тут без
app.use(getLogger(false));

const stf1 = staticMiddleware("public", {
  dotfiles: "ignore",
  extensions: ["jpg", "jpeg"],
  fallthrough: false,
  setHeaders: (res, path, stat) => {
    res.set("X-LastAccessTime", stat.atime.getTime());
  },
  index: "index.html",
  redirect: true,
});

const stf2 = staticMiddleware("./files/static");

// /images/bg.jpg
app.use(stf1);

// /static/styles/main.css - /styles/main.css
app.use("/static", stf2);

app.use("/uploaded", staticMiddleware("./files/uploaded"));

export function detailPage(req, res) {
  const toDoObject = getItem(req.params.id);

  if (!toDoObject) {
    const err = new Error("ошибка");
    err.statusCode = 404;
    err.status = 404;
    err.headers = {
      // стандартные
      "Content-Type": "aplication/json",
      // общепринятые
      "X-CSRF-Token": "",
      // кастомные
      "X-App-Version": "123.0",

      "X-ReceivedId": req.params.id,
    };
    throw err;
  }

  res.render("detail", {
    title: toDoObject.title,
    item: toDoObject,
  });
}

async function mainPage(req, res, next) {
  try {
    const rawData = await readFile(datafileName, "utf8");
  } catch (err) {
    next(err);
  }
}

import createError from "http-errors";

// createError([<код ошибки>][,] [<текст ошибки>][,] [<параметры>])
const err1 = createError({
  statusCode: 404,
  message: "Запрошенное дело не существует",
  headers: {
    //
  },
});
throw err1;

function err404handler(err, req, res, next) {
  if (err.statusCode == 404) {
    res.render("404");
  } else {
    next(err);
  }
}

// про валидацию примеры
export function add(req, res) {
  if (req.body.title) {
    const todo = {
      title: req.body.title,
      desc: req.body.desc || "",
      createdAt: new Date().toString(),
    };
  } else {
    // ошибка
  }

  addItem(todo);
  res.redirect(req.baseUrl);
}


import { query, body } from "express-validator"

// query() - принимает GET-параметр, который будет валидироваться. Возвращает класс с методами
const searchValidator = query('search').isString().trim();
app.get('/', searchValidator, mainPage)

// body() - принимает POST-параметр, который будет валидироваться. Возвращает класс с методами
const toDoValidator = [
    body("title").isString().trim().notEmpty(),
    body("desc").isString().trim()
]
app.post('/add', toDoValidator, add)

// правила валидации
isInt()
isFloat()
isDecimal()
isBoolean()
isDate()
isTime()
isCurrency()
isEmail()
isURL()
isMobilePhone()
isStrongPassword({
    minLength: 12,
    minLowerCase: 4,
    minUpperCase: 4,
    minNumbers: 4,
    minSymbols: 1
})
isPostalCode()
isPassportNumber()
isCreditCard()
isHexadecimal()
isHexcolor()
equals("Мегаласт")
isIn([1,2,3])
exists()

// Задание очистителей
toBoolean()
toInt()
toFloat()
toDate()
// default("Мегаласт") - дать значение по умолчанию, если пустое
trim()
ltrim()
rtrim()
loLowerCase()
loUppercase()
customSanitizer((value) => Math.round(value))


// Задание модификаторов
withMessage()
const asdas = body("title").notEmpty().with("Заголов дела не введен")

not()
const kjhasd = body("asdasd").not().isIn([1,2,3])

optinal()
const asdasasd = body("title").optinal()

// if()

bail()



const asd = body("title").isStirng().trim().notEmpty();


// на уровне приложения или роутера
const searchValidator2 = query('search').isString().trim();
app.get('/', searchValidator, add)

// контроллер
import { validationResult, matchedData } from "express-validator"

export function add(req, res) {
    const r = validationResult(req);
    if (r.isEmpty()) {
        // если ошибок валидации не было
        const data = matchedData(req);
        const todo = {
          title: data.title,
          desc: data.desc || "",
          createdAt: (new Date()).toString()
        }
        addItem(todo);
        res.redirect("/todos")
    } else {
        // возникла ошибка валидации
        const объектПолейСОшибками = r.mapped();
        const сообщениеОбОшибкеПоляTitle = объектПолейСОшибками.title.msg;
        // что-то делаем в ошибкой
    }
}

// привязка URL-валидатора к приложению
app.param("id", idValidator);


const reId = /^\d{13}\$/
// сам валидатор (должна принимать ПЯТЬ параметров)
function idValidator(req, res, next, value, name) {
  if (reId.exec(value)) {
    next()
  } else {
    throw createError(404)
  }
}



// cookie
// cookie-parser
import cookieParser from "cookie-parser"

app.use(cookieParser())



function someController(req, res) {
  const doneAtLast = req.cookie.doneAtLast;
  const signedCookie = req.signedCookie

  // res.cookie("имя куки", "значение куки")
  res.cookie('doneAtLast', 'true', {
    path: '/todos',
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  })


  res.clearCookie("doneAtLast")
}


// req.params - параметры URL (/todos/12312, здесь 12312 - параметр id)
// req.body - тело POST запроса 
// req.query - параметры запроса (/todos/12312?id=123, здесь лежал бы объект {id: 123})



import session from "express-session"

// session(параметры)

// secret - секретный ключ - обязательный
// store - по умолчанию встроенный класс, который сохраняет в оперативу, но мы будем использовать другой класс
// resave - true/false - чаще используем false для производительности
// rolling - true/false - про создание куки сессии
// saveUninitialized - true/false - про автоматическое сохранение пустых новых сессий в хранилище
// unset - "destroy"/"keep" - про обработку устарешвих сессий
// name - имя сессии в куки ("connect.sid")
// cookie - параметры куки сессии

app.use(session({
  secret: "abcdefgh",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}))



// про file-store
import session from "express-session"
import _FileStore from "session-file-store"

// const FileStore = _FileStore(session)

// new FileStore(параметры)
// path - путь к папке в которой будут храниться файлы сессий
// ttl - время существования сессии в виде целого числа в секундах (3600)
// reapInterval - целое число положительное или -1 (про интервал удаления сессий)
// reapAsync - true/false (асинхронно ли удалять)
// reapSyncFallback - true/false (про дополнительное удаления синхроннной в случае неудачи асинхронной)
// retries - количество попыток обращения к файлу сессии (5)
// minTimeout - про задержку перед повторным обращением (50 мс)
// maxTimeout 
// factor - про степень увеличение промежутка
// fallbackSessionFn - ф-ция, которая вызовется, если не получилось в итоге обратиться, должна вернуть объект в качестве сессии
// logFn - ф-ция для вывода сообщений ошибок и оповещения удаления (console.log() - по умолчанию)
// fileExtension - ".json"

import session from "express-session"
import _FileStore from "session-file-store"

const FileStore = _FileStore(session);

app.use(session({
  store: new FileStore({
    path: './storage/sessions',
    ttl: 7200,
    reapInterval: 7200 * 1000,
    reapAsync: true,
    reapSyncFallback: true,
    fallbackSessionFn: () => {
      return {}
    },
    logFn: () => {}
  }),
  secret: "abcdefgh",
  resave: false,
  saveUninitialized: false
}))


// про примеры
function someController(req, res) {
  if (req.session.viewCount) {
    req.session.viewCount++
  } else {
    req.session.viewCount = 1
  }
  res.render("view", { viewCount: req.session.viewCount })
}


// про класс Session, объект которого хранится в req.session

// save(коллбэк-фция) 
function someController(req, res, next) {
  // ...
  req.session.save((err) => {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
}

// destroy(коллбэк-фция)
// regenerate(коллбэк-фция) - рекомендуется перед входом и после выхода пользователя в аккаунт
// reload(коллбэк-фция)


function add(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.body = req.body;
    req.session.errors = errors.mapped();
    req.session.save((err) => {
      if (err) {
        next(err)
      } else {
        res.redirect("back")
      }
    })
  } else {
    // всё ок, сохраняем дело в БД
  }
}

function addPage(req, res) {
  const body = req.session.body || {};
  const errors = req.session.errors || {};
  delete req.session.body;
  delete req.session.errors;
  res.render("add", {
    title: "",
    body: body,
    errors: errors
  })
}


// express-flash-message
import { flash } from "express-flash-message"

app.use(session());
app.use(flash({sessionKeyName: "flash-message"}))
// sessionKeyName - имя для набора всплывающих сообщений

// у объекта запроса теперь есть асинхронные методы:
// flash("имя", "сообщение") - сохраняет всплывающее сообщение под указанным именем

async function add(req, res) {
  // 
  await req.flash("message1", "Дело добавлено");
  res.redirect("/")
}

// consumeFlash("имя") - возвращает массив из всех всплывающих сообщений под этим именем

async function mainPage(req, res) {
  const message = await req.consumeFlash("egor")[0];
}


// ________________________________________________________________________________________________
// Выгрузка файлов
// Библиотека mutler - для данных закодированных multipart/form-data
import multer, { MulterError } from "multer";

multer(параметры)

// параметры - {}
// dest - путь к папке
// storage - объект, представляющий хранилище файлов
// limits - правила валидации файлов
// fileFilter - ф-ция для валидации файлов

const uploadHandler = multer({ dest: "./uploads" })


// ПОДРОБНЕЕ ПРО storage
// 1) DiskStorage
import multer, { diskStorage } from "multer";

// diskStorage(параметры)

// 1.1 destination - либо пусть к папке в виде строки, либо функция, которая генерирует этот путь
// если строка:
const uploadHandler2 = multer({
  storage: diskStorage({
    destination: "./uploads"
  })
})
// если функция, то она принимает 3 параметра - объект запроса, объект файла, колбэк для возврата пути или ошибки
// колбэк - если всё ок, то первый параметром передаём null, вторым - строку
// если не ок, то первым - ошибку, а второй необязательно, но можно null или undefined
import {mkdirSync} from "fs"
const uploadHandler3 = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      let path;
      if (file.size > 1000000) 
        path = "./uploads-big";
      else 
        path = "./uploads-small";
      try {
        mkdirSync("d:/uploads/" + path);
        cb(null, path)
      } catch(err) {
        cb(err)
      }
    }
  })
})

// 1.2 filename - ф-ция, которая формирует имя сохраняемого файла
// пример: время.рандом.расширение
import { extname } from "path";
const uploadHandler4 = multer({
  storage: diskStorage({
    filename: (req, file, cb) => {
      const name = Date.now() + "." + Math.round(Math.random() * 10000);
      const ext = extname(file.originalname);
      cb(null, name + ext)
    }
  })
})

// 2) MemoryStorage
import multer, { memoryStorage } from "multer";

const uploadHandler5 = multer({
  storage: memoryStorage()
})

// ПРО ВАЛИДАЦИЮ limits - объект с параметрами:
// fileSize - максимальный размер загружаемого ФАЙЛА в байтах (можно указать Infinity - оно же по умолчанию)
// files - максимальное количество ФАЙЛОВ
// fieldsSize - максимальный размер ЗНАЧЕНИЯ, а НЕ ФАЙЛА в байтах
// fields = максимальное количество ЗНАЧЕНИЙ, которые НЕ ФАЙЛЫ
// parts - совокупное максимальное значение любых ФАЙЛОВ + ПОЛЕЙ
// fieldNameSize - максимальная длина POST-параметра (по умолчанию 100 байт)
// headerParts - максимальное количество заголовков в получаемом ответе

const uploadHandler6 = multer({
  // ...
  limits: {
    fileSize: 1024 * 1024 * 2,
    files: 1,
    fields: 2,
  }
})

// Если превысит, то будет ошибка класса MulterError
// у объекта есть свойство code:
"LIMIT_FILE_SIZE"
"LIMIT_FILE_COUNT"
"LIMIT_FIELD_VALUE"
"LIMIT_FIELD_COUNT"
"LIMIT_PART_COUNT"
"LIMIT_FIELD_KEY"

// ПРО ФУНКЦИЮ ВАЛИДАЦИИ fileFilter
// функция должна принимать 3 параметра - запрос, файл, колбэк для сохранения или отклонения файла
// если ок - cb(null, true)
// если не ок:
    // либо cb(null, false) - просто отклоним файл
    // либо cb(err, null) - укажем причину и передадим ошибку
    MulterError("код ошибки", "имя POST-параметра") // err

function fileFilter(req, file, cb) {
  if (file.mimetype == "image/jpeg")
    cb(null, true);
  else
    cb(new MulterError("LIMIT_UNEXPECTED_FILE_FORMAT", file.fieldname));
}

const uploadHandler7 = multer({
  // ...
  fileFilter: fileFilter
})

// ПРО свойства объекта file
// originalname - изначальное имя файла
// size - размер файла в байтах
// mimetype - MIME-type файла https://ru.wikipedia.org/wiki/Список_MIME-типов
// fieldname - имя POST-параметра, который содержал наш файл
// encoding - кодировка файла

// ЕСЛИ используется DiskStorage, то ещё:
// filename - имя, под которым будет сохранён файл (генерируется параметром filename у DiskStorage)
// destination - путь к папке, в которой сохранится
// path - destination + filename (строка суммарная)

// ЕСЛИ используется MemoryStorage, то ещё:
// buffer - содержимое файла в виде объекта класса Buffer из JS


// ____________________________________________________________________________________________________
// Объект uploadHandler содержит 5 методов:
// 1) single("имя параметра") - возвращает посредник, сохраняющий ЕДИНСТВЕННЫЙ файл
`<form action="/add" method="post" enctype="multipart/form-data">
  ...
  <label>Иллюстрация</label>
  <input type="file" name="addendum">
  ...
</form>`

import multer from "multer";
const uploadHandler8 = multer({ dest: './uploads' });
const addendumUploader = uploadHandler8.single("addendum");

app.post("/add", addendumUploader, add);

// 2) array("имя параметра", ограничение) - возвращает посредник, который сохраняет любое количество файлов, которые содержатся в указанном параметре (можно ещё указать ограничение на количество файлов)
`<form action="/add" method="post" enctype="multipart/form-data">
  ...
  <label>Иллюстрации</label>
  <input type="file" name="addenda" multiple>
  ...
</form>`

import multer from "multer";
const uploadHandler9 = multer({ dest: './uploads' });
const addendumUploader2 = uploadHandler9.array("addenda", 10)

app.post("/add", addendumUploader2, add);

// 3) fields("описание POST-параметров") - сохраняет все файлы из POST-параметров из описания
// ОПИСАНИЕ - массив, каждый его элемент описывает один POST-параметр - объект, у которого есть свойства:
    // name - имя параметра
    // maxCount - максимальное количество файлов
`<form action="/add" method="post" enctype="multipart/form-data">
  ...
  <label>Иллюстрация</label>
  <input type="file" name="main_addendum">
  <label>Иллюстрации</label>
  <input type="file" name="other_addenda" multiple>
  ...
</form>`

const addendumUploader3 = uploadHandler9.fields(
  [
    { name: "main_addendum", maxCount: 1 },
    { name: "other_addenda" }
  ]
)
app.post('/add', addendumUploader3, add);

// 4) any() - возвращает посредник, который будет сохранять прям ВСЕ файлы 

// 5) none() - посредник, который не допускает никаких файлов, а разрешает только получение обычных значений.
`<form action="/login" method="post" enctype="multipart/form-data">
  <label>Логин</label>
  <input name="username">
  <label>Пароль</label>
  <input type="password" name="password">
  ...
</form>`

const loginHandler = uploadHandler9.none();

app.post('/login', loginHandler, loggingIn)


// ВТОРОЙ СПОСОБ ВЫЗВАТЬ такой посредник:
function add(req, res) {
  addendumUploader3(req, res, (err) => {
    if (err) {
      // выводим это сообщение
    } else {
      // создаём дело и сохраняем в бд вместе с иллюстрацией
    }
  })
}

// ______________________________________________________________________
// Если мы используем посредник созданный с помощью single(), то у объекта запроса мы используем свойство file, хранящее объект файла
function add(req, res) {
  const todo = {
    title: req.body.title,
    desc: req.body.desc,
    addendum: req.file.filename
  };
  addItem(todo);
  res.redirect(req.baseUrl);
}

// Если array() - у объекта запроса появится свойство files, хранящее массив объектов файлов
function add(req, res) {
  const fileNames = [];
  for (let file of req.files) {
    fileNames.push(file.filename);
  }
  const todo = {
    title: req.body.title,
    desc: req.body.desc,
    addenda: fileNames
  };
  addItem(todo);
  res.redirect(req.baseUrl);
}

// Если fields() или any() - свойство files, хранящее простой объект. Имена свойств совпадают с именами POST-параметров, а их значения - массив объектов файлов
`{
  main_addendum: [
    file
  ],
  other_addenda: [
    file,
    file,
    file
  ]
}`

function add(req, res) {
  const otherFileNames = [];
  for (let file of req.files.other_addenda) {
    otherFileNames.push(file.filename)
  }
  const todo = {
    title: req.body.title,
    desc: req.body.desc,
    otherAddenda: otherFileNames,
    mainAddendum: req.files.main_addendum[0].filename
  }
}


// Если вдруг мы захотели сохранить файл из MemoryStorage на диск:
import { writeFile } from "fs/promises";
import routerMain from "./source/router";

function getFileName(file) {
  // генерируем имя файла
}

async function add(req, res) {
  const fileName = getFileName(req.file)
  const path = `d://uploads/${fileName}`
  await writeFile(path, req.file.buffer)
}


// про получение таких файлов ОТ сервера

// 1) С помощью staticMiddleware
// Обеспечиваем обработку выгруженных файлов
routerMain.use('/uploaded', staticMiddleware("uploaded"))
// Обеспечиваем обработку обычных статических файлов
routerMain.use(staticMiddleware('public'));


// 2) Получить из контроллера
app.get("/uploaded/:filename", getFile);

// для отправки файлов из контроллера можно применить следующие методы ответа:
// 1) sendFile() - отправляет в составе ответа файл по указанному пути.
sendFile("путь к файлу", "параметры", "колбэк")

// параметры (необязательные)
// root - путь к папке от которой отсчитывать относительные пути
// acceptRanges = true/false - про заголовок Range
// headers - заголовки, добавляемые в ответ
// dotfiles - allow/deny/ignore - про файлы, которые начинаются с точки

// колбэк (необязательный) - функция после выдачи файла
function getFile(req, res) {
  res.sendFile(req.params.filename, (err) => {
    if (err) {
      res.statusCode(404);
      res.end();
    }
  })
}

// 2) attachment("имя файла") - добавляет в заголовки ответа сохранить файл на диске
function getFileToSave(req, res) {
  res.attachment(req.params.filename);
  res.sendFile(req.params.filename, { root: "./uploads" })
}

// 3) download("путь к файлу", "имя файла", параметры, колбэк) - объединение предыдущего в одно



// _____________________________________________________________________________________________________
// РЕГИСТРАЦИЯ -> Аутентификация (ВХОД) -> Авторизация -> ВЫХОД

// Аутентификация = Вход - ввели данные приложению, чтобы сказать, кто мы и что мы зарегистрированы
// Авторизация - перед каким-то действием происходит проверка, можно ли текущему пользователю это сделать

// Что происходит с паролем в моменте регистрации?
// Пароль хранится в БД не в исходном виде, а в виде хеша
// Хеш - последовательность, в которую превращается пароль с помощью шифрования

// Что происходит при входе?
// Передаём логин пароль, на основе пароля вычисляем хеш, сравниваем логин и хеш в БД
// Если нашли - вход успешен:
//    записать часть его данных (id, name) в серверную сессию -> перенаправить на страницу нужную
// Если не нашли - вход безуспешный:
//    обычно написать просто ошибку и перенаправить на страницу входа

// Что происходит при авторизации?
// Проверка на наличие сессии и данных в ней -> а есть ли в этих данных сведения о праве доступа?

// Что происходит при выходе? Понятно


// ХЕШИРОВАНИЕ
import { pbkdf2, randomBytes } from "crypto";
// import { pbkdf2Sync } from "crypto";

pbkdf2(хешируемый_пароль, соль, количество_итераций, длина_хеша, обозначение_алгоритма, колбэк)

// хешируемый_пароль - пароль, который ввели и пытаемся превратить в хеш
// соль - строка, которая дописывается к паролю для создания более сложного хеша
// количество_итераций - сколько раз цикл шифрования будет вычислять хеш
// длина_хеша - 32 или 64
// обозначение_алгоритма - sha256, sha384, sha512
// колбэк - функция, которая сработает после вычисления, принимает 2 параметра

import { pbkdf2 } from "crypto";

pbkdf2("password", "abcdefgh", 100000, 32, "sha256", (err, hash) => {
  if (err) {
    // обрабатываем
  }  else {
    // используем хеш
  }
})


// для соли
import { pbkdf2, randomBytes } from "crypto";

const salt = randomBytes(32);
pbkdf2("password", salt, "...")

// а если указать второй аргумент:
randomBytes(32, (err, salt) => {
  if (err) {}
  else {
    pbkdf2("password", salt, "...")
  }
})


// для сверки двух хешей пароля:
import { timingSafeEqual } from "crypto";

timingSafeEqual(хеш1, хеш2)



// ПРОМИСИФИКАЦИЯ
import { promisify } from "util";

const pbkdf2Promisified = promisify(pbkdf2);

async function register(req, res) {
  // ...
  const hash = await pbkdf2Promisified("password", salt, "...")
  // ...
}


// БАЗА JS
// у массивов есть функция find()
[].find()
// она перебирает все элементы и подставляет их в функцию, переданную аргументом функции find



// появится для пути - /login   /logout

// посредник isLoggedIn()


// форма входа:
// username - обязательное, должно присутствовать в списке пользователей
// password - обязательное, должен совпадать с паролем из объекта, полученного с помощью username


// контроллеры для входа\выхода:  
// loginPage() - для формы логина
// login() - сохраняет данные о пользователе в сессию
// logout() - удаляет из серверной сессии пользователя

// ___________________________________________________________________________________
// РАЗГРАНИЧЕНИЕ ДОСТУПА

// связать каждое дело с пользователем
// для этого к делу прикрепить id юзера (а именно с текущим пользователем)
// будем в дело добавлять атрибут user

// для пользователя доставать дела, у которых он указан, как юзер
// для одного конкретного дела (при изменении\удалении) проверяет, ТЫ ли создатель

/* ПРЕДЛАГАЮ УПРАЖНЕНИЯ
  1) вывести в панели навигации сайта username текущего
  2) добавить удаление текущего пользователя:
    2.1.) Удалить его дела все сразу
    2.2.) Удалить привязанные к ним картинки
    2.3.) удалить его самого из бд
    2.4.) выйти 
  3) Исправить невозможность удаления и отметки как выполненное у Романа
  4) Исправить невозможность удаления и отметки как выполненное при выполнении поиска
*/

// ____________________________________________________________________________________
/* MongoDB

База данных - понятно
Документ - базовая единица информации в БД. Хранит атрибуты (уникальные) со значениями
Коллекция - массив документов
Объектный идентификатор - уникальная неизменяемая метка документа. ObjectId

Первичный документ - ему подчиняются другие документы
Вторичный документ - он подчиняется другому документу

1) Встраивание - хранение совокупности вторичных документов в первичном документе в виде массива, сохраненного по атрибуту
[
  {
    "_id": "12321",
    "name": "Ivan",
    "todos": [
      {тут типа вторичный},
      {тут типа вторичный},
      {тут типа вторичный}
    ]
  },
  {}
]

2) Связывание - хранение вторичных документов в отдельной коллекции. Каждый вторичный связывается с первичным, которому он подчинен


Операции выполняемые над документами:
1) Добавление - даём обычный объект. Его поля становятся атрибутами, а _id генерируется самой СУБД
2) Поиск - извлечение ОДНОГО документа из коллекции, удовлетворяющего заданным условиям.
3) Фильтрация - извлечение произвольного количества документов по условию
4) Правка\изменение - поиск документа и его изменение
5) Удаление - удалить документ по какому-то условию

*/
import { FindCursor, MongoClient, ObjectId } from "mongodb";
import { FindCursor, MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://127.0.0.1:27017/";
const connection = new MongoClient(uri, { appname: "test" });

const dTodos = connection.db("todos");
const cTodos = dTodos.collection("todos");
// MongoClient("адрес сервера MongoDB", необязательные_параметры)
// mongodb://127.0.0.1:27017

// Добавление документов в коллекцию
// 1) Добавить один документ
const result = await cTodos.insertOne({
  title: "Изучить MongoDB",
  desc: "Важная инфа про базы данных",
  createdAt: new Date()
});

// acknowledged - true/false - удалось ли добавить
// insertedId - Объектный идентификатор - уникальная неизменяемая метка документа. Объект класса ObjectId, который находится в библиотеке MongoDB. Создаётся этот айдишник тоже самой MongoDB. _id

// объект, который хранится в result имеет два свойства:
if (result.acknowledged) {
  // документ добавлен успешно
  const dicId = result.insertedId
} else {
  // документ не был добавлен
}

// 2) Добавление нескольких документов
// cTodos.insertMany(массив_документов)
const dProducts = connection.db("products"); 
const cProducts = connection.collection("products");
const resultProdAdd = await cProducts.insertMany([
  {
    title: "Лопата",
    desc: "Новая крутая деревянная",
    price: 300
  },
  {
    title: "Дом",
    desc: "Новый крутой деревянный",
    price: 100000000
  },
  {
    title: "Холодильник",
    desc: "Яйца мои хотите кушац?",
    price: 5000
  }
])

if (resultProdAdd.acknowledged) {
  // все добавлены успешно
  const count = resultProdAdd.insertedCount; // количество добавленных документов
  const indexes = resultProdAdd.insertedIds; // набор объектных идентификаторов в виде объекта, где каждое свойство является порядковым номеров добавленного документа, а значения свойств = айдишники
}

// Поиск документа
// findOne(набор_условий_поиска, необязательные_параметры)

const todo = await cTodos.findOne({ title: "Изучить MongoDB" });
// Результат:
// {
//   _id: new ObjectId("12h3jg12h3g12hj312hj3g"),
//   title: "Изучить MongoDB",
//   desc: "Важная инфа про базы данных",
//   createdAt: 2025-31-08T17:20:25.123Z
// }

if (todo) {
  // дело найдено
} else {
  // дело не найдено
}

const product = await cProducts.findOne({ price: { $lt: 1000 } });
// Пример поиска первого продукта с ценой меньше 1000

// ПОДРОБНЕЕ ПРО УСЛОВИЯ ПОИСКА:

// Условие простого сравнения
// const todo = await cTodos.findOne({ title: "Изучить MongoDB" });
// в качестве сравниваемого значения можно использовать и регулярки

// Поиск документа по объектному идентификатору
import { ObjectId } from "mongodb";

const todo2 = await cTodos.findOne({
  _id: new ObjectId("12h3jg12h3g12hj312hj3g")
})

// Условия, использующие операторы сравнения
// атрибут: { оператор_сравнения: сравниваемое_значение }
// Операторы сравнения:
// 1) $eq - значение атрибута должно быть равно сравниваемому значению
const todo11 = await cTodos.findOne({ title: { $eq: "Изучить MongoDB" } });
// 2) $regex - значение атрибута должно совпадать с регуляркой
const todo12 = await cTodos.findOne({ desc: { $regex: /про/i } });
// 3) $ne - значение атрибута НЕ должно быть равно сравниваемому или указанный атрибут вообще отсутствует
const todo13 = await cTodos.findOne({ done: { $ne: true } });
// 4) $lt - значение атрибута должно быть МЕНЬШЕ сравниваемого значения <
const product14 = await cProducts.findOne({ price: { $lt: 1000 } });
// 5) $lte - значение атрибута должно быть МЕНЬШЕ ИЛИ РАВНО сравниваемого значения <=
// 6) $gt - значение атрибута должно быть БОЛЬШЕ сравниваемого значения >
// 7) $gte - значение атрибута должно быть БОЛЬШЕ ИЛИ РАВНО сравниваемого значения >=
// 8) $in - значение атрибута должно совпасть с каким-нибудь из массива сравниваемых
const todo15 = await cTodos.findOne({ title: { $in: ["Express", "MongoDB"] } });
// 9) $nin - значение атрибута НЕ должно совпасть с каким-нибудь из массива сравниваемых или указанный атрибут вообще отсутствует

// _____________________________________________________________________________________
// ЛОГИЧЕСКИЕ ОПЕРАТОРЫ ДЛЯ ОБЪЕДИНЕНИЯ НЕСКОЛЬКИХ УСЛОВИЙ
/* 
логический оператор: [
  условие1,
  условие2
]
*/

// 1) $and - И
const todo16_1 = await cTodos.findOne({
  $and: [
    { title: "Express" },
    { createdAt: "12.01.2024" }
  ]
});
const todo16_2 = await cTodos.findOne({ title: "Express", createdAt: "12.01.2024" });

// 2) $or - ИЛИ
const todo17 = await cTodos.findOne({
  $or: [
    { title: /Express/ },
    { decs: /Express/ }
  ]
});

// 3) $nor - исключающее ИЛИ (ТОЛЬКО одно из условий будет верно)

// 4) $not
/*
атрибут: { $not: значение }

атрибут: { $not: { оператор : значение } }
*/
const todo18 = await cTodos.findOne({ title: { $not: /Express/ } });
const todo19 = await cTodos.findOne({ price: { $not: { $gt: 500000 } } });

// найти первый документ у которого title - дом ИЛИ лопата при этом цена не меньше 1000000
const todo20 = await cTodos.findOne({ 
  $and: [
    { $or: [ {title: "Дом"}, {title: "Лопата"} ] },
    { price: { $gte: 1000000 } }
  ]
})

// _______________________________________________________________________________
// КАК ВЫВОДИТЬ ОПРЕДЕЛЕННЫЕ АТРИБУТЫ ДОКУМЕНТА
const todo21 = await cTodos.findOne(
  { title: "Изучить Express" },
  { projection: { title: 1, desc: 1 } }
)
/*
{
  _id: new ObjectId("sad67asd5as6d5as56d4a"),
  title: "Изучить Express",
  desc: "Это база"
}
*/

const todo22 = await cTodos.findOne(
  { title: "Изучить Express" },
  { projection: { title: 1, desc: 1, _id: 0 } }
)
/*
{
  title: "Изучить Express",
  desc: "Это база"
}
*/

const todo23 = await cTodos.findOne(
  { title: "Изучить Express" },
  { projection: { createdAt: 0, desc: 0 } }
)
/*
{
  "title": "Изучить Express",
  "user": "1755627586198",
  "_id": new ObjectId("sad67asd5as6d5as56d4a")
},
*/

// Как преобразовать сложный объект _id в строку
const id = todo23._id.toString();

// Как работать с паролями и всем, что хранится классом Buffer (на самом деле хранится в объекте класса Binary, у которого есть свойство .buffer, которое даст нам то, что надо)
const cUsers = dTodos.collection("users");
const user = await cUsers.findOne({ username: req.body.username });
const password = user.password.buffer;
const salt2 = user.salt.buffer;
const hashed = await pbkdf2Promisified(
  req.body.password, salt2, 100000, 32, "sha256"
);

if (!timingSafeEqual(hashed, password)) {
  // не совпали
  throw new Error("Неправильный пароль")
}

const title23 = todo23.title;

// __________________________________________________________________________________
// ФИЛЬТРАЦИЯ
find(набор_условий, параметры);
// этот метод возвращает объект класса FindCursor (СЛОЖНО, ДАЛЬШЕ БУДЕТ)

// Как получить ВСЕ документы?
const todos1_1 = cTodos.find({}, { projection: { title: 1, desc: 1 } });
const todos1_2 = cTodos.find();

// Как сортировать полученные документы в определенном порядке?
const todos2 = cTodos.find({ price: { $lt: 10000 }}, { sort: { price: -1 } });
// В sort указывает объект со свойствами, по которым будет происходить сортировка
// -1 - по убыванию, 1 - по возрастанию

// Как получить часть отфильтрованных документов?
const todos3 = cTodos.find({}, { skip: 2, limit: 5 })
// в этом случае мы выдаём 5 дел, начиная со второго (индексация с нуля)
// Если skip не указать, то с нулевого выдаст
// Если limit не указать, то до конца выдаст

// КУРСОР - 
for await (let todo of todos3) {
  // что-то делаем с todo
}

// Что он ещё умеет?
// у него есть методы:

todos3.hasNext()
// 1) асинхронный. возвращает true, если текущий документ не последний

// todos3.next()
while (await todos3.hasNext()) {
  const todo = await todos3.next();
}
// 2) асинхронный. перемещает указатель на следующий документ, делая его текущим. и возвращает этот текущий документ. если предыдущий был последним, то null

todos3.rewind() 
// 3) перемещает указатель курсора на первый документ в коллекции

todos3.toArray()
// 4) асинхронный. возвращает массив JS со всеми документами из текущего курсора
const todosArr = await todos3.toArray();

// Дальше пойдут методы, которые нужно вызывать ДО извлечения документов из курсора
// ИЗУЧУ ЗАЧЕМ ОНИ ВООБЩЕ НУЖНЫ ЕСЛИ ЕСТЬ ПАРАМЕТРЫ - для большей гибкости и удобства, когда хотим делать в зависимости от каких-то условий разные действия, и чтобы в разные моменты к курсору обращаться с разными методами (сначала получили все записи, потом начали не делать новые запросы к бд, а доставать по 10 записей скипом и лимитом)

const filtered = cTodos.find({ price: { $lt: 10000 }}).sort({ price: -1})
// Сортирует

todos3.skip()
// пропускает несколько

todos3.limit()
// ограничивает количество

todos3.filter()
// ещё одна фильтрация


// ИЗМЕНЕНИЕ\ИСПРАВЛЕНИЕ
updateOne(набор_условий, изменения)

// изменения - набор операций над какими-то атрибутами
// 1) $set
await cTodos.updateOne(
  { title: "Лопата" },
  { $set: { price: 20000000, desc: "Самая крутая лопата (с RTX)" } }
)

// 2) $inc
await cTodos.updateOne(
  { title: "Лопата" },
  { $inc: { price: 5000} }
)
// увеличили цену на 5000 (или создали равную 5к, если цены не было)

// 3) $min
await cTodos.updateOne(
  { title: "Лопата" },
  { $min: { price: 5000} }
)
// занесёт в цену значение 5000, если текущее значение БОЛЬШЕ, чем 5000

// 4) $max - понятно

// 5) $mul
await cTodos.updateOne(
  { title: "Лопата" },
  { $mul: { price: 2} }
)
// умножит цену на 2

// 6) $currentDate
await cTodos.updateOne(
  { title: "Лопата" },
  { $currentDate: { date: true} }
)
// занесёт в атрибут date текущую дату и время

// 7) $rename
await cTodos.updateOne(
  { title: "Лопата" },
  { $rename: { date: "Хе_хе"} }
)
// переименует атрибут date на Хе_хе

// 8) $unset
await cTodos.updateOne(
  { title: "Лопата" },
  { $unset: { date: ""} }
)

// КРОМЕ ТОГО, ЭТОТ МЕТОД updateOne ВОЗВРАЩАЕТ ОБЪЕКТ:
const result2 = await cTodos.updateOne({});
result2.acknowledged // true - если изменения успешны
result2.matchedCount // кол-во найденных документов
result2.modifiedCount // кол-во измененных документов
// ОТВЕТ: 
// acknowledged - это когда база получила запрос и всё ок
// matchedCount - в теории могли документы тупо не найтись и тогда бы там был просто 0
// modifiedCount - в теории мы могли найти документ, но его не изменить, к примеру, $min

// КАК ИЗМЕНИТЬ НЕСКОЛЬКО ДОКУМЕНТОВ?
cTodos.updateMany(параметры_поиска, исправления)

await cTodos.updateMany(
  { title: "Лопаты" },
  { $set: { price: 3000000 } }
)
// обновит все лопаты

// КАК УДАЛЯТЬ ИЗ КОЛЛЕКЦИИ ДОКУМЕНТЫ
// 1) удалить один:
cTodos.deleteOne(набор_условий)

// 2) удалить все по условию:
cTodos.deleteMany(набор_условий)
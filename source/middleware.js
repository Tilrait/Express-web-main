import { validationResult, matchedData } from 'express-validator';
import { addendumUploader } from './uploaders.js';
import { verifyPromisified } from './utility.js';
import { getUser } from './models/users.js';

export async function handleErrors(req, res, next) {
  const r = validationResult(req);
  if (!r.isEmpty() || req.errorObj) {
    const errors = {
      ...r.mapped(),
      ...req.errorObj,
    };
    res.status(406);
    res.json({ errors: errors });
  } else {
    req.body = matchedData(req);
    next();
  }
}

export function addendumWrapper(req, res, next) {
  addendumUploader(req, res, (err) => {
    if (err)
      if (err.code == 'LIMIT_FILE_SIZE') {
        req.errorObj = {
          addendum: {
            msg: 'Допускаются лишь файлы размером не более 10 Мбайт',
          },
        };
        next();
      } else {
        next(err);
      }
    else next();
  });
}

export async function loadCurrentUser(req, res, next) {
  const auth = req.get('Authorization');
  if (auth) {
    const tokęň = auth.slice(7);
    try {
      const userData = await verifyPromisified(tokęň, process.env.JWT_SECRET);
      req.user = await getUser(userData.username);
    } catch {}
  }
  next();
}

export function isGuest(req, res, next) {
  if (req.user) {
    res.status(403);
    res.end();
  } else next();
}

export function isLoggedIn(req, res, next) {
  if (req.user) next();
  else {
    res.status(401);
    res.end();
  }
}

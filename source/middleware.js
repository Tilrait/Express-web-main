import { validationResult, matchedData } from "express-validator";
import { addendumUploader } from "./uploaders.js";

export function requestToContext(req, res, next) {
  res.locals.req = req;
  next();
}

export async function handleErrors(req, res, next) {
  const r = validationResult(req);
  if (!r.isEmpty() || req.errorObj) {
    const errors = {
      ...r.mapped(),
      ...req.errorObj
    }
    await req.flash("errors", errors);
    await req.flash("body", req.body);
    // res.redirect('back');
    res.redirect(req.get("Referer"));
  } else {
    req.body = matchedData(req);
    next();
  }
}

export function extendFlashAPI(req, res, next) {
  req.getFlash = async function(name) {
    const d = await this.consumeFlash(name);
    return d.length > 0 ? d[0] : undefined;
  };
  next()
}

export async function getErrors(req, res, next) {
  res.locals.errors = await req.getFlash("errors") || {};
  res.locals.body = await req.getFlash("body") || {};
  next()
}

export function addendumWrapper(req, res, next) {
  addendumUploader(req, res, (err) => {
    if (err)
      if (err.code == "LIMIT_FILE_SIZE") {
        req.errorObj = {
          addendum: {
            msg: "Допускаются лишь файлы размером не более 10 Мбайт"
          }
        };
        next();
      } else {
        next(err);
      }
    else
      next();
  })
}

export function loadCurrentUser(req, res, next) {
  req.user = req.session.user;
  next()
}

export function isGuest(req, res, next) {
  if (req.user)
    res.redirect('/');
  else
    next()
}

export function isLoggedIn(req, res, next) {
  if (req.user)
    next()
  else
    res.redirect('/');
}


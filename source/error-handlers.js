export function mainErrorHandler(err, req, res, next) {
  if (err.statusCode == 404 || err.statusCode == 413) {
    let message;
    switch (err.statusCode) {
      case 404:
        message = err.message;
        break;
      case 413:
        message = 'Передано слишком много данных';
        break;
    }

    res.status(err.statusCode);
    res.json({ message: message });
  } else {
    next(err);
  }
}

export function error500Handler(err, req, res, next) {
  res.status(500);
  res.json({ err: err });
}

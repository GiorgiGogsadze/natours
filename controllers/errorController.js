const AppError = require('../utils/appError');

const sendErrorDev = (req, res, err) => {
  console.log('🎈', err);
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: `💥 ${err.message}`,
      stack: err.stack,
      error: err,
      operational: err.isOperational || false,
    });
  } else {
    res
      .status(err.statusCode)
      .render('error', { title: 'Something went wrong', msg: err.message });
  }
};
const sendErrorProd = (req, res, err) => {
  console.log('🎆', err);
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: `💥 ${err.message}`,
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: `💥 Something went wrong`,
      });
    }
  } else {
    //Render
    if (err.isOperational) {
      res
        .status(err.statusCode)
        .render('error', { title: 'Something went wrong', msg: err.message });
    } else {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again later',
      });
    }
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. please use another value!`;
  return new AppError(message, 404);
};

const handleValidationErrorDB = (err) => {
  let message = `Invalid input data. `;
  Object.values(err.errors).forEach((el) => {
    message += `${el.message}. `;
  });
  return new AppError(message.trimEnd(), 404);
};

const handleJWTError = () =>
  new AppError(`invalid token, please log in again`, 401);

const handleJWTExpireError = () =>
  new AppError(`expired token, please log in again`, 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(req, res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpireError();
    }
    sendErrorProd(req, res, error);
  }
};

const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAssync = require('../utils/catchAssync');
const factory = require('./handlerFactory');

// ------------image with multer
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, `../public/img/users`));
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}.${ext}`);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(`not an image, please upload only images`, 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAssync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(__dirname, `../public/img/users/${req.file.filename}`));
  next();
});
// ------------image with end
const filterObj = (obj, ...allowedFields) =>
  Object.keys(obj)
    .filter((el) => allowedFields.includes(el))
    .reduce((acc, el) => {
      acc[el] = obj[el];
      return acc;
    }, {});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAssync(async (req, res, next) => {
  // 1) Create error if user post password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        `This route is not for password updates, Please use /updateMyPassword`,
        400,
      ),
    );
  // 2) update user document
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAssync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addUser = (req, res) => {
  res.send(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup',
  });
};
// Do not update password with this
exports.updateUser = factory.updateOne(User);

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('UNHANDELED EXCEPTION 💣 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
// const address = '192.168.1.15';
// const address = '127.0.0.1';
const server = app.listen(port, () => {
  console.log(`App running on ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.message);
  console.log('UNHANDELED REJECTION! 💣 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

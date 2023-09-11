const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');

process.on('uncaughtException', (err, origin) => {
   console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
});

const router = require('./routes/users.js');
const {getUsersRouter, getUserByIdRrouter, createUserRouter, updateUserRouter, updateUserAvatarRouter, loginRouter} = require('./routes/users.js');
const {getCardsRouter, createCardRrouter, deleteCardByIdRouter, likeCardRouter, dislikeCardRouter} = require('./routes/cards.js');
const PageNotFoundError = require('./errors/page-not-found-err');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});


app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser());

app.post('/signin', loginRouter);

app.post('/signup', createUserRouter);

app.use(auth);

app.use('/', createUserRouter);
app.use('/', getUsersRouter);
app.use('/', updateUserRouter);
app.use('/', getUserByIdRrouter);
app.use('/', updateUserAvatarRouter);

app.use('/', getCardsRouter);
app.use('/', createCardRrouter);
app.use('/', deleteCardByIdRouter);
app.use('/', likeCardRouter);
app.use('/', dislikeCardRouter);

app.use('*', (req, res, next) => {
  return next(PageNotFoundError())
  //res.status(404).send({message:'Страница не найдена'})
});

app.use(errors());

app.use(errorHandler); 

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
}) 



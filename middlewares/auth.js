const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

module.exports = (req, res, next) => {
  console.log ('auth');
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    return next(AuthError())
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  const token = cookie.replace('jwt=', '');
  let payload;
  
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    return next(AuthError());
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};  
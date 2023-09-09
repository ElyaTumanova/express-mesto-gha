const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie || !cookie.startsWith('jwt=')) {
    const err = new Error('Необходима авторизация'); 
    err.statusCode = 401;
    next(err);

  }

  const token = cookie.replace('jwt=', '');
  let payload;
  
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new Error('Необходима авторизация'); 
    err.statusCode = 401;

    next(err);
    // return res
    //   .status(401)
    //   .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};  
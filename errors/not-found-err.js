class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = 'Такого ID не существует';
  }
}

module.exports = NotFoundError;

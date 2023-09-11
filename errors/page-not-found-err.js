class PageNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = 'Страница не найдена'
  }
}

module.exports = PageNotFoundError; 
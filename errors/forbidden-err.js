class ForbiddenRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = 'Нелья удалить чужую карточку'
  }
}

module.exports = ForbiddenRequestError; 
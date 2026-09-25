class UserError(Exception):
    status_code = 400

    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details


class ValidationError(UserError):
    status_code = 422


class UserAlreadyExistsError(UserError):
    status_code = 409


class InvalidCredentialsError(UserError):
    status_code = 401


class UserNotFoundError(UserError):
    status_code = 404

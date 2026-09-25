from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash

from src.database import get_connection
from src.useCase.user.errors import InvalidCredentialsError, ValidationError


def login_user(name, password):
    name = (name or "").strip()

    if not name or not password:
        raise ValidationError("Nome e senha são obrigatórios")

    with get_connection() as conn:
        user = conn.execute(
            "SELECT id, name, password_hash FROM users WHERE name = %s",
            (name,),
        ).fetchone()

    if not user or not check_password_hash(user["password_hash"], password):
        raise InvalidCredentialsError("Nome ou senha inválidos")

    token = create_access_token(identity=str(user["id"]), additional_claims={"name": user["name"]})

    return {
        "accessToken": token,
        "tokenType": "Bearer",
        "user": {"id": str(user["id"]), "name": user["name"]},
    }

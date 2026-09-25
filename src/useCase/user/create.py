from psycopg.errors import UniqueViolation
from werkzeug.security import generate_password_hash

from src.database import get_connection
from src.useCase.user.errors import UserAlreadyExistsError, ValidationError

MIN_PASSWORD_LENGTH = 6


def create_user(name, password, password_confirm):
    name = (name or "").strip()
    errors = {}

    if not name:
        errors["name"] = "Nome é obrigatório"
    if not password:
        errors["password"] = "Senha é obrigatória"
    elif len(password) < MIN_PASSWORD_LENGTH:
        errors["password"] = f"Senha deve ter no mínimo {MIN_PASSWORD_LENGTH} caracteres"
    if password != password_confirm:
        errors["passwordConfirm"] = "As senhas não conferem"

    if errors:
        raise ValidationError("Dados inválidos", errors)

    password_hash = generate_password_hash(password)

    try:
        with get_connection() as conn:
            user = conn.execute(
                """
                INSERT INTO users (name, password_hash)
                VALUES (%s, %s)
                RETURNING id, name, created_at
                """,
                (name, password_hash),
            ).fetchone()
    except UniqueViolation:
        raise UserAlreadyExistsError("Já existe um usuário com esse nome")

    return {
        "id": str(user["id"]),
        "name": user["name"],
        "createdAt": user["created_at"].isoformat(),
    }

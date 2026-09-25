from src.database import get_connection
from src.useCase.user.errors import UserNotFoundError


def get_user(user_id):
    with get_connection() as conn:
        user = conn.execute(
            "SELECT id, name, created_at FROM users WHERE id = %s",
            (user_id,),
        ).fetchone()

    if not user:
        raise UserNotFoundError("Usuário não encontrado")

    return {
        "id": str(user["id"]),
        "name": user["name"],
        "createdAt": user["created_at"].isoformat(),
    }

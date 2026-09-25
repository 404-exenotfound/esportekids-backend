from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from src.useCase.user.create import create_user
from src.useCase.user.errors import UserError
from src.useCase.user.login import login_user
from src.useCase.user.me import get_user

user_bp = Blueprint("user", __name__, url_prefix="/users")


@user_bp.errorhandler(UserError)
def handle_user_error(error):
    body = {"error": error.message}
    if error.details:
        body["details"] = error.details
    return jsonify(body), error.status_code


@user_bp.post("")
def create():
    data = request.get_json(silent=True) or {}
    user = create_user(
        name=data.get("name"),
        password=data.get("password"),
        password_confirm=data.get("passwordConfirm"),
    )
    return jsonify(user), 201


@user_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    result = login_user(name=data.get("name"), password=data.get("password"))
    return jsonify(result), 200


@user_bp.get("/me")
@jwt_required()
def me():
    user = get_user(get_jwt_identity())
    return jsonify(user), 200

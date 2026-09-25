from flask import Flask, jsonify
from flask_jwt_extended import JWTManager

from src.config import Config
from src.http.controller.user.route import user_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    register_jwt(app)
    register_routes(app)
    register_error_handlers(app)

    return app


def register_jwt(app):
    jwt = JWTManager(app)

    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({"error": "Token ausente", "detail": reason}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({"error": "Token inválido", "detail": reason}), 401

    @jwt.expired_token_loader
    def expired_token(_header, _payload):
        return jsonify({"error": "Token expirado"}), 401


def register_routes(app):
    app.register_blueprint(user_bp)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "Rota não encontrada"}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "Método não permitido"}), 405

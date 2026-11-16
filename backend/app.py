import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

load_dotenv()

# Database
db = SQLAlchemy()

# JWT Authentication
jwt = JWTManager()


def create_app():

    app = Flask(__name__)

    # Application Configuration
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY",
        "development-secret-change-before-deployment"
    )

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "development-jwt-secret-change-before-deployment"
    )

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        "sqlite:///mg_appstore.db"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize Extensions
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    # Health Check
    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "success": True,
            "message": "MG AppStore Backend is Running",
            "developer": "MG Shankar Tech"
        })

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "success": True,
            "status": "online"
        })

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )

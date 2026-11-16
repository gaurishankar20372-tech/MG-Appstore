import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv


# Environment Variables
load_dotenv()


# Database and JWT
db = SQLAlchemy()
jwt = JWTManager()


# Create Flask Application
def create_app():

    app = Flask(__name__)

    # Security Configuration
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY",
        "development-secret-change-before-deployment"
    )

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "development-jwt-secret-change-before-deployment"
    )

    # Database Configuration
    database_url = os.getenv(
        "DATABASE_URL",
        "sqlite:///mg_appstore.db"
    )

    # PostgreSQL URL Compatibility
    if database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql+psycopg://",
            1
        )

    elif database_url.startswith("postgresql://"):
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize Extensions
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    # Home API
    @app.route("/", methods=["GET"])
    def home():

        return jsonify({
            "success": True,
            "message": "MG AppStore Backend is Running",
            "developer": "MG Shankar Tech"
        }), 200

    # Health Check API
    @app.route("/api/health", methods=["GET"])
    def health():

        return jsonify({
            "success": True,
            "status": "online"
        }), 200

    return app


# Initialize Application
app = create_app()


# Import Database Models
from models import (
    User,
    StoreApp,
    DownloadRecord
)


# Import API Blueprints
from auth_routes import auth_bp
from store_routes import store_bp
from developer_routes import developer_bp
from download_routes import download_bp
from admin_routes import admin_bp


# Register Authentication API
app.register_blueprint(auth_bp)

# Register App Store API
app.register_blueprint(store_bp)

# Register Developer API
app.register_blueprint(developer_bp)

# Register Download API
app.register_blueprint(download_bp)

# Register Admin API
app.register_blueprint(admin_bp)


# Create Database Tables
with app.app_context():

    db.create_all()


# Run Server
if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )

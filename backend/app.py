import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv


# ==========================================
# ENVIRONMENT CONFIGURATION
# ==========================================

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()


# ==========================================
# CREATE FLASK APPLICATION
# ==========================================

def create_app():

    app = Flask(__name__)

    # Security
    app.config["SECRET_KEY"] = os.getenv(
        "SECRET_KEY",
        "development-secret-change-before-deployment"
    )

    app.config["JWT_SECRET_KEY"] = os.getenv(
        "JWT_SECRET_KEY",
        "development-jwt-secret-change-before-deployment"
    )

    # Database
    database_url = os.getenv(
        "DATABASE_URL",
        "sqlite:///mg_appstore.db"
    )

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

    # Maximum request size: 200 MB
    app.config["MAX_CONTENT_LENGTH"] = (
        200 * 1024 * 1024
    )

    # Initialize Extensions
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    # ======================================
    # HOME ROUTE
    # ======================================

    @app.route("/", methods=["GET"])
    def home():

        return jsonify({
            "success": True,
            "message": "MG AppStore Backend is Running",
            "developer": "MG Shankar Tech",
            "version": "1.0.0"
        }), 200

    # ======================================
    # HEALTH CHECK
    # ======================================

    @app.route("/api/health", methods=["GET"])
    def health():

        return jsonify({
            "success": True,
            "status": "online",
            "service": "MG AppStore API"
        }), 200

    # ======================================
    # ERROR HANDLERS
    # ======================================

    @app.errorhandler(404)
    def not_found(error):

        return jsonify({
            "success": False,
            "message": "API endpoint not found"
        }), 404

    @app.errorhandler(413)
    def file_too_large(error):

        return jsonify({
            "success": False,
            "message": "Uploaded file is too large"
        }), 413

    @app.errorhandler(500)
    def server_error(error):

        return jsonify({
            "success": False,
            "message": "Internal server error"
        }), 500

    return app


# ==========================================
# INITIALIZE APPLICATION
# ==========================================

app = create_app()


# ==========================================
# IMPORT DATABASE MODELS
# ==========================================

from models import (
    User,
    StoreApp,
    DownloadRecord
)


# ==========================================
# IMPORT API ROUTES
# ==========================================

from auth_routes import auth_bp
from store_routes import store_bp
from developer_routes import developer_bp
from download_routes import download_bp
from admin_routes import admin_bp
from upload_routes import upload_bp


# ==========================================
# REGISTER ALL BLUEPRINTS
# ==========================================

app.register_blueprint(auth_bp)

app.register_blueprint(store_bp)

app.register_blueprint(developer_bp)

app.register_blueprint(download_bp)

app.register_blueprint(admin_bp)

app.register_blueprint(upload_bp)


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

with app.app_context():

    db.create_all()


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=False
    )

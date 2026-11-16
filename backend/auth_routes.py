from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)

from app import db
from models import User


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters"
        }), 400

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409

    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role="user"
    )

    db.session.add(user)
    db.session.commit()

    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message": "Registration successful",
        "token": token,
        "user": user.to_dict()
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user or not check_password_hash(
        user.password_hash,
        password
    ):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({
        "success": True,
        "message": "Logout successful"
    }), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def current_user():
    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200

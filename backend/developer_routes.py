from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import User, StoreApp


developer_bp = Blueprint(
    "developer",
    __name__,
    url_prefix="/api/developer"
)


def get_current_user():
    user_id = get_jwt_identity()

    try:
        return db.session.get(User, int(user_id))
    except (ValueError, TypeError):
        return None


def check_developer_access(user):
    if not user:
        return jsonify({
            "success": False,
            "message": "User not found"
        }), 404

    if user.role not in ("developer", "admin"):
        return jsonify({
            "success": False,
            "message": "Developer access required"
        }), 403

    return None


# Developer Dashboard
@developer_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():

    user = get_current_user()

    access_error = check_developer_access(user)
    if access_error:
        return access_error

    apps = StoreApp.query.filter_by(
        developer_id=user.id
    ).order_by(
        StoreApp.created_at.desc()
    ).all()

    total_apps = len(apps)

    approved_apps = sum(
        1 for app in apps
        if app.status == "approved"
    )

    pending_apps = sum(
        1 for app in apps
        if app.status == "pending"
    )

    return jsonify({
        "success": True,
        "developer_name": user.name,
        "total_apps": total_apps,
        "approved_apps": approved_apps,
        "pending_apps": pending_apps,
        "apps": [
            app.to_dict() for app in apps
        ]
    }), 200


# नया App सबमिट करना
@developer_bp.route("/apps", methods=["POST"])
@jwt_required()
def upload_app():

    user = get_current_user()

    access_error = check_developer_access(user)
    if access_error:
        return access_error

    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    description = str(data.get("description", "")).strip()
    category = str(data.get("category", "")).strip()
    version = str(data.get("version", "")).strip()
    package_name = str(data.get("packageName", "")).strip()

    if not all([
        name,
        description,
        category,
        version,
        package_name
    ]):
        return jsonify({
            "success": False,
            "message": "All app details are required"
        }), 400

    existing_app = StoreApp.query.filter_by(
        package_name=package_name
    ).first()

    if existing_app:
        return jsonify({
            "success": False,
            "message": "This package name is already registered"
        }), 409

    new_app = StoreApp(
        name=name,
        description=description,
        category=category,
        version=version,
        package_name=package_name,
        developer_id=user.id,
        status="pending"
    )

    try:
        db.session.add(new_app)
        db.session.commit()

    except Exception:
        db.session.rollback()

        return jsonify({
            "success": False,
            "message": "Could not submit app"
        }), 500

    return jsonify({
        "success": True,
        "message": "App submitted for review",
        "app": new_app.to_dict()
    }), 201


# Developer के अपने App की जानकारी
@developer_bp.route(
    "/apps/<int:app_id>",
    methods=["GET"]
)
@jwt_required()
def developer_app_details(app_id):

    user = get_current_user()

    access_error = check_developer_access(user)
    if access_error:
        return access_error

    app = StoreApp.query.filter_by(
        id=app_id,
        developer_id=user.id
    ).first()

    if not app:
        return jsonify({
            "success": False,
            "message": "App not found"
        }), 404

    return jsonify({
        "success": True,
        "app": app.to_dict()
    }), 200

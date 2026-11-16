from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import User, StoreApp


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin"
)


def get_admin():
    user_id = get_jwt_identity()

    user = db.session.get(
        User,
        int(user_id)
    )

    if not user or user.role != "admin":
        return None

    return user


# Pending Apps की सूची
@admin_bp.route("/pending-apps", methods=["GET"])
@jwt_required()
def pending_apps():

    admin = get_admin()

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    apps = StoreApp.query.filter_by(
        status="pending"
    ).order_by(
        StoreApp.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "total": len(apps),
        "apps": [
            app.to_dict() for app in apps
        ]
    }), 200


# App Approve करना
@admin_bp.route(
    "/apps/<int:app_id>/approve",
    methods=["POST"]
)
@jwt_required()
def approve_app(app_id):

    admin = get_admin()

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    app = db.session.get(
        StoreApp,
        app_id
    )

    if not app:
        return jsonify({
            "success": False,
            "message": "App not found"
        }), 404

    app.status = "approved"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "App approved successfully",
        "app": app.to_dict()
    }), 200


# App Reject करना
@admin_bp.route(
    "/apps/<int:app_id>/reject",
    methods=["POST"]
)
@jwt_required()
def reject_app(app_id):

    admin = get_admin()

    if not admin:
        return jsonify({
            "success": False,
            "message": "Admin access required"
        }), 403

    app = db.session.get(
        StoreApp,
        app_id
    )

    if not app:
        return jsonify({
            "success": False,
            "message": "App not found"
        }), 404

    app.status = "rejected"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "App rejected",
        "app": app.to_dict()
    }), 200

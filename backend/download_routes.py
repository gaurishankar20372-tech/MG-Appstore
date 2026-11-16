from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from models import User, StoreApp, DownloadRecord


download_bp = Blueprint(
    "downloads",
    __name__,
    url_prefix="/api/downloads"
)


# यूज़र की Download History
@download_bp.route("/history", methods=["GET"])
@jwt_required()
def download_history():

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

    records = DownloadRecord.query.filter_by(
        user_id=user.id
    ).order_by(
        DownloadRecord.downloaded_at.desc()
    ).all()

    history = [
        record.to_dict()
        for record in records
    ]

    return jsonify({
        "success": True,
        "total": len(history),
        "history": history
    }), 200


# किसी ऐप का Download Record बनाना
@download_bp.route(
    "/record/<int:app_id>",
    methods=["POST"]
)
@jwt_required()
def record_download(app_id):

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

    store_app = StoreApp.query.filter_by(
        id=app_id,
        status="approved"
    ).first()

    if not store_app:
        return jsonify({
            "success": False,
            "message": "App not found"
        }), 404

    record = DownloadRecord(
        user_id=user.id,
        app_id=store_app.id
    )

    store_app.downloads += 1

    db.session.add(record)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Download recorded successfully",
        "download": record.to_dict()
    }), 201

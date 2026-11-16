import os
import uuid

from flask import (
    Blueprint,
    request,
    jsonify,
    current_app,
    send_from_directory
)

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from werkzeug.utils import secure_filename

from app import db
from models import User, StoreApp


upload_bp = Blueprint(
    "upload",
    __name__,
    url_prefix="/api/upload"
)

ALLOWED_EXTENSIONS = {"apk"}

MAX_FILE_SIZE = 200 * 1024 * 1024


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# APK Upload
@upload_bp.route("/app/<int:app_id>", methods=["POST"])
@jwt_required()
def upload_apk(app_id):

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
        developer_id=user.id
    ).first()

    if not store_app:
        return jsonify({
            "success": False,
            "message": "App not found or access denied"
        }), 404

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "APK file is required"
        }), 400

    file = request.files["file"]

    if not file.filename:
        return jsonify({
            "success": False,
            "message": "No file selected"
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "message": "Only APK files are allowed"
        }), 400

    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)

    if file_size <= 0 or file_size > MAX_FILE_SIZE:
        return jsonify({
            "success": False,
            "message": "File must be between 1 byte and 200 MB"
        }), 400

    original_name = secure_filename(file.filename)

    unique_name = (
        str(uuid.uuid4())
        + ".apk"
    )

    upload_folder = os.path.join(
        current_app.root_path,
        "uploads"
    )

    os.makedirs(
        upload_folder,
        exist_ok=True
    )

    file_path = os.path.join(
        upload_folder,
        unique_name
    )

    file.save(file_path)

    store_app.apk_url = (
        request.host_url.rstrip("/")
        + "/api/upload/files/"
        + unique_name
    )

    store_app.status = "pending"

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "APK uploaded successfully. Waiting for admin review.",
        "fileName": original_name,
        "apkUrl": store_app.apk_url,
        "status": store_app.status
    }), 201


# Download APK File
@upload_bp.route(
    "/files/<filename>",
    methods=["GET"]
)
def download_apk(filename):

    if not filename.endswith(".apk"):
        return jsonify({
            "success": False,
            "message": "Invalid file"
        }), 400

    upload_folder = os.path.join(
        current_app.root_path,
        "uploads"
    )

    return send_from_directory(
        upload_folder,
        filename,
        as_attachment=True
    )

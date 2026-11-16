from flask import Blueprint, request, jsonify

from models import StoreApp


store_bp = Blueprint(
    "store",
    __name__,
    url_prefix="/api"
)


# सभी Approved Apps की लिस्ट
@store_bp.route("/apps", methods=["GET"])
def get_apps():
    category = request.args.get("category", "").strip()

    query = StoreApp.query.filter_by(
        status="approved"
    )

    if category:
        query = query.filter(
            StoreApp.category.ilike(category)
        )

    apps = query.order_by(
        StoreApp.created_at.desc()
    ).all()

    return jsonify({
        "success": True,
        "total": len(apps),
        "apps": [app.to_dict() for app in apps]
    }), 200


# किसी एक App की पूरी जानकारी
@store_bp.route("/apps/<int:app_id>", methods=["GET"])
def get_app_details(app_id):
    app = StoreApp.query.filter_by(
        id=app_id,
        status="approved"
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


# सभी उपलब्ध Categories
@store_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = (
        StoreApp.query
        .with_entities(StoreApp.category)
        .filter_by(status="approved")
        .distinct()
        .order_by(StoreApp.category.asc())
        .all()
    )

    category_list = [
        item[0] for item in categories
    ]

    return jsonify({
        "success": True,
        "categories": category_list
    }), 200


# App Store का कुल आँकड़ा
@store_bp.route("/store/stats", methods=["GET"])
def get_store_stats():
    total_apps = StoreApp.query.filter_by(
        status="approved"
    ).count()

    total_downloads = sum(
        app.downloads
        for app in StoreApp.query.filter_by(
            status="approved"
        ).all()
    )

    return jsonify({
        "success": True,
        "totalApps": total_apps,
        "totalDownloads": total_downloads
    }), 200

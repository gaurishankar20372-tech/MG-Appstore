from datetime import datetime
from app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(
        db.String(120),
        nullable=False
    )

    email = db.Column(
        db.String(180),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    role = db.Column(
        db.String(30),
        default="user",
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    uploaded_apps = db.relationship(
        "StoreApp",
        backref="developer",
        lazy=True
    )

    downloads = db.relationship(
        "DownloadRecord",
        backref="user",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "createdAt": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }


class StoreApp(db.Model):
    __tablename__ = "store_apps"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    category = db.Column(
        db.String(100),
        nullable=False
    )

    version = db.Column(
        db.String(30),
        nullable=False
    )

    package_name = db.Column(
        db.String(200),
        nullable=False
    )

    apk_url = db.Column(
        db.Text,
        nullable=True
    )

    icon_url = db.Column(
        db.Text,
        nullable=True
    )

    developer_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    status = db.Column(
        db.String(30),
        default="pending",
        nullable=False
    )

    downloads = db.Column(
        db.Integer,
        default=0,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    download_records = db.relationship(
        "DownloadRecord",
        backref="store_app",
        lazy=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "version": self.version,
            "packageName": self.package_name,
            "apkUrl": self.apk_url,
            "iconUrl": self.icon_url,
            "developerId": self.developer_id,
            "developerName": (
                self.developer.name
                if self.developer else None
            ),
            "status": self.status,
            "downloads": self.downloads,
            "createdAt": (
                self.created_at.isoformat()
                if self.created_at else None
            )
        }


class DownloadRecord(db.Model):
    __tablename__ = "download_records"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    app_id = db.Column(
        db.Integer,
        db.ForeignKey("store_apps.id"),
        nullable=False
    )

    downloaded_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "appId": self.app_id,
            "appName": (
                self.store_app.name
                if self.store_app else None
            ),
            "downloadedAt": (
                self.downloaded_at.isoformat()
                if self.downloaded_at else None
            )
        }

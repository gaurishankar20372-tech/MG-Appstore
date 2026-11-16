import os

from werkzeug.security import generate_password_hash

from app import app, db
from models import User


def create_admin():

    admin_name = os.getenv("ADMIN_NAME")
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not all([
        admin_name,
        admin_email,
        admin_password
    ]):
        print("ERROR: Admin environment variables are missing.")
        return

    admin_email = admin_email.strip().lower()

    if len(admin_password) < 12:
        print("ERROR: Admin password must be at least 12 characters.")
        return

    with app.app_context():

        user = User.query.filter_by(
            email=admin_email
        ).first()

        if user:

            if user.role == "admin":
                print("Admin account already exists.")
                return

            print(
                "ERROR: This email already belongs to a normal user."
            )
            print(
                "Use a separate email address for the Admin account."
            )
            return

        admin = User(
            name=admin_name.strip(),
            email=admin_email,
            password_hash=generate_password_hash(
                admin_password
            ),
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin account created successfully.")
        print("Admin Email:", admin_email)


if __name__ == "__main__":
    create_admin()

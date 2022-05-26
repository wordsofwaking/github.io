"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

DEFAULT_IMAGE_URL = "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"

class User(db.Model):
    """Table User"""

    __tablename__ = "users"
    id = db.Column (db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column (db.Text, nullable=False, unique=False)
    last_name = db.Column (db.Text, nullable=False, unique=False)
    image_url = db.Column(db.Text, nullable=False, default=DEFAULT_IMAGE_URL)

    @property
    def full_name(self):
        """Return full name of user."""

        return f"{self.first_name} {self.last_name}"


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)
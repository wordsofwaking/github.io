"""Models for Blogly."""
from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()

DEFAULT_IMAGE_URL = "https://png.pngtree.com/png-clipart/20191120/original/pngtree-outline-user-icon-png-image_5045523.jpg"

class User(db.Model):
    """Table User"""

    __tablename__ = "users"
    id = db.Column (db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column (db.Text, nullable=False, unique=False)
    last_name = db.Column (db.Text, nullable=False, unique=False)
    image_url = db.Column(db.Text, nullable=False, default=DEFAULT_IMAGE_URL)

    posts = db.relationship("Post", backref="user", cascade="all, delete-orphan")
    
    @property
    def full_name(self):
        """Return full name of user."""

        return f"{self.first_name} {self.last_name}"


class Post(db.Model):
    """Table user posts"""

    __tablename__ = "posts"
    id = db.Column (db.Integer, primary_key=True, autoincrement=True)
    title = db.Column (db.Text, nullable=False, unique=False)
    content = db.Column (db.Text, nullable=False, unique=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now)
    user_id = db.Column (db.Integer, db.ForeignKey('users.id'), nullable=False)

    @property
    def friendly_date(self):
        """Return nicely-formatted date."""

        return self.created_at.strftime("%a %b %-d  %Y, %-I:%M %p") #explore this with Mentor as this is part of further study


class PostTag(db.Model):
    """Tag on a post."""

    __tablename__ = "posts_tags"

    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'), primary_key=True)


class Tag(db.Model):
    """Tag that can be added to posts."""

    __tablename__ = 'tags'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False, unique=True)

    posts = db.relationship(
        'Post',
        secondary="posts_tags",
        # cascade="all,delete",
        backref="tags",
    )


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)
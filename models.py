# Part 1: Create User Model
# First, create a User model for SQLAlchemy. Put this in a models.py file.
# It should have the following columns:
# username - a unique primary key that is no longer than 20 characters.
# password - a not-nullable column that is text
# email - a not-nullable column that is unique and no longer than 50 characters.
# first_name - a not-nullable column that is no longer than 30 characters.
# last_name - a not-nullable column that is no longer than 30 characters.

# Part 7: Give us some more feedback!
# It’s time to add another model.
# Create a Feedback model for SQLAlchemy. Put this in a models.py file.
# It should have the following columns:
# id - a unique primary key that is an auto incrementing integer
# title - a not-nullable column that is at most 100 characters
# content - a not-nullable column that is text
# username - a foreign key that references the username column in the users table


from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()

bcrypt = Bcrypt()


def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)


class User(db.Model):
    """Site user."""

    __tablename__ = "users"

    username = db.Column(db.String(20), nullable=False, unique=True, primary_key=True)
    password = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(50), nullable=False)
    first_name = db.Column(db.String(30), nullable=False)
    last_name = db.Column(db.String(30), nullable=False)

    feedback = db.relationship("Feedback", backref="user", cascade="all, delete")


    @classmethod
    def register(cls, username, password, first_name, last_name, email):
        """Register user, hash pwd."""

        hashed = bcrypt.generate_password_hash(password)
        hashed_utf8 = hashed.decode("utf8")
        user = cls(username=username, password=hashed_utf8, first_name=first_name, last_name=last_name, email=email)

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Validate user/pwd"""

        user = User.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False



class Feedback(db.Model):
    """Feedback."""

    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True,)
    title = db.Column(db.String(100), nullable=False,)
    content = db.Column(db.Text, nullable=False,)
    username = db.Column(db.String(20), db.ForeignKey('users.username'), nullable=False,)








# class User(db.Model):

#     __tablename__ = 'users'

#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)

#     username = db.Column(db.Text, nullable=False,  unique=True)

#     password = db.Column(db.Text, nullable=False)

#     @classmethod
#     def register(cls, username, pwd):
#         """Register user w/hashed password & return user."""

#         hashed = bcrypt.generate_password_hash(pwd)
#         # turn bytestring into normal (unicode utf8) string
#         hashed_utf8 = hashed.decode("utf8")

#         # return instance of user w/username and hashed pwd
#         return cls(username=username, password=hashed_utf8)

#     @classmethod
#     def authenticate(cls, username, pwd):
#         """Validate that user exists & password is correct.

#         Return user if valid; else return False.
#         """

#         u = User.query.filter_by(username=username).first()

#         if u and bcrypt.check_password_hash(u.password, pwd):
#             # return user instance
#             return u
#         else:
#             return False

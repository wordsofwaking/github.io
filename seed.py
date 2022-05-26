"""Seed file to make sample data for pets db."""

from models import User, db
from app import app

# Create all tables
db.drop_all()
db.create_all()

# If table isn't empty, empty it
User.query.delete()

# Add pets
tim = User(first_name='Tim', last_name="Blue")
bob = User(first_name='Bob', last_name="Black")
sue = User(first_name='Sue', last_name="Green")

# Add new objects to session, so they'll persist
db.session.add(tim)
db.session.add(bob)
db.session.add(sue)

# Commit--otherwise, this never gets saved!
db.session.commit()

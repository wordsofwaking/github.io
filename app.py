"""Blogly application."""

from flask import Flask, request, redirect, render_template
from models import User, db, connect_db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///blogly'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'secret'

from flask_debugtoolbar import DebugToolbarExtension
debug = DebugToolbarExtension(app)

connect_db(app)
db.create_all()

# @app.route("/")
# def list_users():
#     """List users and show add form."""

#     users = User.query.all()
#     return render_template("base.html", users=users)

# @app.route("/", methods=["POST"])
# def add_user():
#     """Add user and redirect to list."""

#     f_name = request.form['first_name']
#     l_name = request.form['last_name']
#     pic = request.form['image_url']
#     pic = int(pic) if pic else None

#     user = User(f_name=first_name, l_name=last_name, pic=image_url)
#     db.session.add(user)
#     db.session.commit()

#     return redirect(f"/{user.id}")

# @app.route('/users/new', methods=["GET"])
# def users_new_form():
#     """Show a form to create a new user"""

#     return render_template('users/new.html')


# @app.route("/<int:user_id>")
# def show_user(user_id):
#     """Show info on a single user."""

#     user = User.query.get_or_404(user_id)
#     return render_template("details.html", user=user)

@app.route('/')
def root():
    """Homepage and list of users"""

    return redirect("/users")


@app.route('/users')
def users_index():
    """All users page"""

    users = User.query.order_by(User.last_name, User.first_name).all()
    return render_template('/index.html', users=users)


@app.route('/users/new', methods=["GET"])
def users_new_form():
    """Form for new users"""

    return render_template('/new.html')


@app.route("/users/new", methods=["POST"])
def users_new():
    """Handle form submission"""

    new_user = User(
        first_name=request.form['first_name'],
        last_name=request.form['last_name'],
        image_url=request.form['image_url'] or None)

    db.session.add(new_user)
    db.session.commit()

    return redirect("/users")


@app.route('/users/<int:user_id>')
def users_details(user_id):
    """User info page"""

    user = User.query.get_or_404(user_id)
    return render_template('/details.html', user=user)


@app.route('/users/<int:user_id>/edit')
def users_edit(user_id):
    """Edit page for users"""

    user = User.query.get_or_404(user_id)
    return render_template('/edit.html', user=user)


@app.route('/users/<int:user_id>/edit', methods=["POST"])
def users_update(user_id):
    """Handle edit submission"""

    user = User.query.get_or_404(user_id)
    user.first_name = request.form['first_name']
    user.last_name = request.form['last_name']
    user.image_url = request.form['image_url']

    db.session.add(user)
    db.session.commit()

    return redirect("/users")


@app.route('/users/<int:user_id>/delete', methods=["POST"])
def users_destroy(user_id):
    """Submission to delete existing user"""

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return redirect("/users")
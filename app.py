# Part 3: Make Routes For Users
# Make routes for the following:
# GET /
# Redirect to /register.
# GET /register
# Show a form that when submitted will register/create a user. This form should accept a username, password, email, first_name, and last_name.
# Make sure you are using WTForms and that your password input hides the characters that the user is typing!
# POST /register
# Process the registration form by adding a new user. Then redirect to /secret
# GET /login
# Show a form that when submitted will login a user. This form should accept a username and a password.
# Make sure you are using WTForms and that your password input hides the characters that the user is typing!
# POST /login
# Process the login form, ensuring the user is authenticated and going to /secret if so.
# GET /secret
# Return the text “You made it!” (don’t worry, we’ll get rid of this soon)

# Part 4: Don’t let everyone go to /secret
# Despite all of this wonderful password hashing that you have been doing, anyone can navigate to /secret and see the text “You made it!”. Let’s protect this route and make sure that only users who have logged in can access this route!
# To do that, we’re going to make sure that when we log a user in (and after they register), we store just a little information in the session. When the user successfully registers or logs in, store the username in the session.

# Part 5: Log out users
# Make routes for the following:
# GET /logout
# Clear any information from the session and redirect to /

# Part 6: Let’s change /secret to /users/<username>
# Now that we have some logging in and and logging out working. Let’s add some authorization! When a user logs in, take them to the following route:
# GET /users/<username>
# Display a template the shows information about that user (everything except for their password)
# You should ensure that only logged in users can access this page.

# Part 8: Make/Modify Routes For Users and Feedback
# GET /users/<username>
# Show information about the given user.
# Show all of the feedback that the user has given.
# For each piece of feedback, display with a link to a form to edit the feedback and a button to delete the feedback.
# Have a link that sends you to a form to add more feedback and a button to delete the user Make sure that only the user who is logged in can successfully view this page.
# POST /users/<username>/delete
# Remove the user from the database and make sure to also delete all of their feedback. Clear any user information in the session and redirect to /. Make sure that only the user who is logged in can successfully delete their account
# GET /users/<username>/feedback/add
# Display a form to add feedback Make sure that only the user who is logged in can see this form
# POST /users/<username>/feedback/add
# Add a new piece of feedback and redirect to /users/<username> — Make sure that only the user who is logged in can successfully add feedback
# GET /feedback/<feedback-id>/update
# Display a form to edit feedback — **Make sure that only the user who has written that feedback can see this form **
# POST /feedback/<feedback-id>/update
# Update a specific piece of feedback and redirect to /users/<username> — Make sure that only the user who has written that feedback can update it
# POST /feedback/<feedback-id>/delete
# Delete a specific piece of feedback and redirect to /users/<username> — Make sure that only the user who has written that feedback can delete it


from flask import Flask, render_template, redirect, session, flash
from flask_debugtoolbar import DebugToolbarExtension
from models import connect_db, db, User, Feedback
from forms import RegisterForm, LoginForm, FeedbackForm, DeleteForm
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import Unauthorized

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///flask_feedback"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ECHO"] = True
app.config["SECRET_KEY"] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False


connect_db(app)

toolbar = DebugToolbarExtension(app)

@app.route("/")
def homepage():
    """Homepage"""

    return redirect("/register")


@app.route('/register', methods=['GET', 'POST'])
def register():
    """Register a user"""

    if "username" in session:
        return redirect(f"/users/{session['username']}")

    form = RegisterForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data
        first_name = form.first_name.data
        last_name = form.last_name.data
        email = form.email.data

        user = User.register(username, password, first_name, last_name, email)

        db.session.commit()
        session['username'] = user.username

        return redirect(f"/users/{user.username}")

    else:
        return render_template("users/register.html", form=form)


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login"""

    if "username" in session:
        return redirect(f"/users/{session['username']}")

    form = LoginForm()

    if form.validate_on_submit():
        username = form.username.data
        password = form.password.data

        user = User.authenticate(username, password)
        if user:
            session['username'] = user.username
            return redirect(f"/users/{user.username}")
        else:
            form.username.errors = ["Invalid username/password."]
            return render_template("users/login.html", form=form)

    return render_template("users/login.html", form=form)


@app.route("/logout")
def logout():
    """Logout"""

    session.pop("username")
    return redirect("/login")


@app.route("/users/<username>")
def show_user(username):
    """Example page for logged-in-users"""

    if "username" not in session or username != session['username']:
        raise Unauthorized()

    user = User.query.get(username)
    form = DeleteForm()

    return render_template("users/show.html", user=user, form=form)


@app.route("/users/<username>/delete", methods=["POST"])
def remove_user(username):
    """Remove user and redirect to login"""

    if "username" not in session or username != session['username']:
        raise Unauthorized()

    user = User.query.get(username)
    db.session.delete(user)
    db.session.commit()
    session.pop("username")

    return redirect("/login")


@app.route("/users/<username>/feedback/new", methods=["GET", "POST"])
def new_feedback(username):
    """Show add-feedback form and use"""

    if "username" not in session or username != session['username']:
        raise Unauthorized()

    form = FeedbackForm()

    if form.validate_on_submit():
        title = form.title.data
        content = form.content.data

        feedback = Feedback(title=title, content=content, username=username)

        db.session.add(feedback)
        db.session.commit()

        return redirect(f"/users/{feedback.username}")

    else:
        return render_template("feedback/new.html", form=form)


@app.route("/feedback/<int:feedback_id>/update", methods=["GET", "POST"])
def update_feedback(feedback_id):
    """Show update-feedback form and use"""

    feedback = Feedback.query.get(feedback_id)

    if "username" not in session or feedback.username != session['username']:
        raise Unauthorized()

    form = FeedbackForm(obj=feedback)

    if form.validate_on_submit():
        feedback.title = form.title.data
        feedback.content = form.content.data

        db.session.commit()

        return redirect(f"/users/{feedback.username}")

    return render_template("/feedback/edit.html", form=form, feedback=feedback)


@app.route("/feedback/<int:feedback_id>/delete", methods=["POST"])
def delete_feedback(feedback_id):
    """Delete feedback"""

    feedback = Feedback.query.get(feedback_id)
    if "username" not in session or feedback.username != session['username']:
        raise Unauthorized()

    form = DeleteForm()

    if form.validate_on_submit():
        db.session.delete(feedback)
        db.session.commit()

    return redirect(f"/users/{feedback.username}")



# @app.route('/')
# def home_page():
#     return render_template('index.html')


# @app.route('/tweets', methods=['GET', 'POST'])
# def show_tweets():
#     if "user_id" not in session:
#         flash("Please login first!", "danger")
#         return redirect('/')
#     form = TweetForm()
#     all_tweets = Tweet.query.all()
#     if form.validate_on_submit():
#         text = form.text.data
#         new_tweet = Tweet(text=text, user_id=session['user_id'])
#         db.session.add(new_tweet)
#         db.session.commit()
#         flash('Tweet Created!', 'success')
#         return redirect('/tweets')

#     return render_template("tweets.html", form=form, tweets=all_tweets)


# @app.route('/tweets/<int:id>', methods=["POST"])
# def delete_tweet(id):
#     """Delete tweet"""
#     if 'user_id' not in session:
#         flash("Please login first!", "danger")
#         return redirect('/login')
#     tweet = Tweet.query.get_or_404(id)
#     if tweet.user_id == session['user_id']:
#         db.session.delete(tweet)
#         db.session.commit()
#         flash("Tweet deleted!", "info")
#         return redirect('/tweets')
#     flash("You don't have permission to do that!", "danger")
#     return redirect('/tweets')


# @app.route('/register', methods=['GET', 'POST'])
# def register_user():
#     form = UserForm()
#     if form.validate_on_submit():
#         username = form.username.data
#         password = form.password.data
#         new_user = User.register(username, password)

#         db.session.add(new_user)
#         try:
#             db.session.commit()
#         except IntegrityError:
#             form.username.errors.append('Username taken.  Please pick another')
#             return render_template('register.html', form=form)
#         session['user_id'] = new_user.id
#         flash('Welcome! Successfully Created Your Account!', "success")
#         return redirect('/tweets')

#     return render_template('register.html', form=form)


# @app.route('/login', methods=['GET', 'POST'])
# def login_user():
#     form = UserForm()
#     if form.validate_on_submit():
#         username = form.username.data
#         password = form.password.data

#         user = User.authenticate(username, password)
#         if user:
#             flash(f"Welcome Back, {user.username}!", "primary")
#             session['user_id'] = user.id
#             return redirect('/tweets')
#         else:
#             form.username.errors = ['Invalid username/password.']

#     return render_template('login.html', form=form)


# @app.route('/logout')
# def logout_user():
#     session.pop('user_id')
#     flash("Goodbye!", "info")
#     return redirect('/')

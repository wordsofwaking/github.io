from flask import Flask, render_template, request, redirect, flash, session
from flask_debugtoolbar import DebugToolbarExtension
from markupsafe import escape

RESPONSES = "response"

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)



@app.route('/')
def start_survey():
    """Explains and starts the survey"""
    
    session[RESPONSES] = []

    return render_template("base.html")


@app.route('/responses', methods=["POST"])
def add_answer():
    """Record survey answers"""
    cust_answer = request.form['answer']
    
    response = session[RESPONSES]
    response.append(cust_answer)
    session[RESPONSES] = response

    if (len(response) == 3):
        return redirect('/thank_you')
    
    else:
        return redirect(f"/question_{len(response)}/")


@app.route('/question/0')
def first_question():
    """Ask the first question of the survey"""

    return render_template("question_0.html")


@app.route('/question/1')
def second_question():
    """Ask the second question of the survey"""

    return render_template("question_1.html")


@app.route('/question/2')
def third_question():
    """Ask the third question of the survey"""

    return render_template("question_2.html")


@app.route('/question/3')
def last_question():
    """Ask the last question of the survey"""

    return render_template("question_3.html")


@app.route('/thank_you')
def redirect_to_home():
    """Redirects to home page with flash message"""
    flash('Thank you for taking our survey!')
    return redirect("/")

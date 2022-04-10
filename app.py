from flask import Flask, render_template, request
from flask_debugtoolbar import DebugToolbarExtension
from stories import story
from markupsafe import escape

app = Flask(__name__)
app.config['SECRET_KEY'] = "secret"

debug = DebugToolbarExtension(app)

@app.route("/")
def ask_questions():
    """Create prompts based on response to correlate with Stories Object"""

    prompts = story.prompts

    return render_template("base.html", prompts=prompts)


@app.route("/madlib")
def show_story():
    """Display the story"""

    text = story.generate(request.args)

    return render_template("madlib.html", text=text)




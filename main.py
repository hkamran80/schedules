"""
Schedules
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 2.0.3
Last Updated: 2020-01-10, @hkamran80
"""

from flask import Flask, render_template, request, redirect, url_for
from flask_compress import Compress
import times
import json
import sys
import os

def force_https(protocol: str, url: str):
	if protocol.lower() == "http":
		return False, url.replace("http", "https")
	else:
		return True, None

app = Flask(__name__)
Compress(app)

@app.errorhandler(404)
def page_not_found(error):
	print(error)
	return render_template("404.html")

@app.route("/", methods=["GET"])
def index():
	f_https = force_https(request.headers["X-Forwarded-Proto"], request.url)
	if f_https[0]:
		schedules = {
			"ca-auhsd-ahs": "Acalanes High School",
			"ca-auhsd-chs": "Campolindo High School"
		}
		
		if request.method == "GET":
			return render_template("index.html", schedule_valid=False, schedules=schedules)
	else:
		return redirect(f_https[1])

@app.route("/schedule/<schedule_id>", methods=["GET"])
def schedule(schedule_id):	
	f_https = force_https(request.headers["X-Forwarded-Proto"], request.url)
	if f_https[0]:
		schedules = {
			"ca-auhsd-ahs": "Acalanes High School",
			"ca-auhsd-chs": "Campolindo High School"
		}
		
		if request.method == "GET":
			try:
				schedule_name = schedules[schedule_id]

				if not schedule_id:
					return redirect("/")

				return render_template("index.html", schedule_valid=True, schedule_id=schedule_id, schedule_name=schedule_name, schedules=schedules, schedule_color=schedule_id, raw_schedule_json=json.dumps(times.times))
			except KeyError:
				return redirect(url_for("index"))
	else:
		return redirect(f_https[1])

@app.route("/changelog", methods=["GET"])
def view_changelog():
	changelog = json.loads(open("changelog.json").read())
	
	return render_template("changelog.html", versions=list(changelog.keys()), changelog=changelog)

if __name__ == "__main__":
	if len(sys.argv) > 1 and sys.argv[1] == "--ci":
		print("CI pass-through")
	else:
		# Repl.it - 8080, Heroku - use the environment variable "PORT"
		app_port = 3000

		app.run(host="0.0.0.0", port=os.environ["PORT"] or app_port, debug=True)

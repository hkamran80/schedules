"""
Schedules
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 2.0.3
Last Updated: 2019-11-18, @hkamran80
"""

from flask import Flask, render_template, request, redirect, url_for
import json
import sys
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
	if request.method == "GET":
		return render_template("index.html", schedule_valid=False, schedules=schedules)

@app.route("/school", methods=["GET"])
def school():
	_id = request.args.get("schoolid") or None
	return redirect(url_for("schedule", schedule_id=_id))

@app.route("/schedule/<schedule_id>", methods=["GET"])
def schedule(schedule_id):
	if request.method == "GET":
		if schedule_id == "auhsd-ahs":
			return redirect(url_for("schedule", schedule_id="ca-auhsd-ahs"))
		elif schedule_id == "auhsd-chs":
			return redirect(url_for("schedule", schedule_id="ca-auhsd-chs"))
		elif schedule_id == "average-work-day":
			return redirect(url_for("schedule", schedule_id="un-average-workday"))
			
		schedule_name = schedules[schedule_id]

		if not schedule_id:
			return redirect("/")

		if request.args.get("mode") == "dev":
		    mode = "dev"
		else:
		    mode = None

		return render_template("index.html", schedule_valid=True, schedule_id=schedule_id, schedule_name=schedule_name, schedule_color=schedule_id, raw_schedule_json=open("times.json").read())

@app.route("/changelog", methods=["GET"])
def view_changelog():
    return render_template("changelog.html", versions=list(changelog.keys()), changelog=changelog)

if __name__ == "__main__":
	if len(sys.argv) > 1 and sys.argv[1] == "--ci":
		print("Successful execution....")
	else:
		schedules = {
			"ca-auhsd-ahs": "Acalanes High School",
			"ca-auhsd-chs": "Campolindo High School",
			"un-average-workday": "Average Work Day"
		}
		
		changelog = json.loads(open("changelog.json").read())

		# Repl.it - 8080, Heroku - 3000
		app_port = 3000

		app.run(host="0.0.0.0", port=os.environ["PORT"] or app_port)

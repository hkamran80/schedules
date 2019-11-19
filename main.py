"""
Schedules
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 2.0.3
Last Updated: 2019-11-18, @hkamran80
"""

from flask import Flask, render_template, request, redirect, url_for
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

@app.route("/", methods=["GET"])
def index():
	f_https = force_https(request.headers["X-Forwarded-Proto"], request.url)
	if f_https[0]:
		if request.method == "GET":
			return render_template("index.html", schedule_valid=False, schedules=schedules)
	else:
		return redirect(f_https[1])

@app.route("/schedule/<schedule_id>", methods=["GET"])
def schedule(schedule_id):
	f_https = force_https(request.headers["X-Forwarded-Proto"], request.url)
	if f_https[0]:
		if request.method == "GET":			
			schedule_name = schedules[schedule_id]

			if not schedule_id:
				return redirect("/")

			if request.args.get("mode") == "dev":
			    mode = "dev"
			else:
			    mode = None

			return render_template("index.html", schedule_valid=True, schedule_id=schedule_id, schedule_name=schedule_name, schedules=schedules, schedule_color=schedule_id, raw_schedule_json=json.dumps(times.times))
	else:
		return redirect(f_https[1])

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

		app.run(host="0.0.0.0", port=os.environ["PORT"] or app_port, debug=True)

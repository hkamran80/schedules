"""
Schedules
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 1.1.5
Last Updated: 2019-11-05, @hkamran80
"""

from flask import Flask, render_template, request, redirect, url_for
import period_calculator
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
		schedule_name = schedules[schedule_id]

		if not schedule_id:
			return redirect("/")

		if request.args.get("mode") == "dev":
		    mode = "dev"
		else:
		    mode = None

		#return render_template("index.html", schedule_valid=True, schedules=schedules, schedule_id=schedule_id, schedule_name=schedule_name, schedule_color=schedule_id, period=period, day=full_day, time=f"{hours}:{minutes}", get_time_date=False, time_data=time_data, time_diff_raw=time_difference, time_diff=compiled_time_diff, raw=mode)
		return render_template("index.html", schedule_valid=True, schedule_id=schedule_id, schedule_name=schedule_name, schedule_color=schedule_id, raw_schedule_json=json.dumps(period_calculator.times))

@app.route("/timecalc", methods=["GET"])
def timecalc():
	time1 = request.args.get("time1")
	time2 = request.args.get("time2")

	return str(pt_extensions.calculate_time(str(time1), str(time2)))

if __name__ == "__main__":
	if len(sys.argv) > 1 and sys.argv[1] == "--ci":
		print("Successful execution....")
	else:
		schedules = {"auhsd-ahs": "Acalanes High School"}

		# Repl.it - 8080, Heroku - 3000
		app_port = 3000

		app.run(host="0.0.0.0", port=os.environ["PORT"] or app_port, debug=True)

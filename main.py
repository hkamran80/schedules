"""
Schedules
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 1.1.5
Last Updated: 2019-11-04, @hkamran80
"""

from flask import Flask, render_template, request, redirect
import period_calculator
import pt_extensions
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
	return redirect(urL_for("schedule", schedule_id=_id))

@app.route("/schedule/<scheduleid>", methods=["GET"])
def schedule():
	schedule_id = scheduleid
	if request.method == "GET":
		#schoolid = request.args.get("schoolid") or None
		schoolname = schedules[schedule_id]

		if not schedule_id:
			return redirect("/")

		days = {"MON": "Monday", "TUE": "Tuesday", "WED": "Wednesday", "THU": "Thursday", "FRI": "Friday", "SAT": "Saturday", "SUN": "Sunday"}

		if request.args.get("time") and request.args.get("day"):
			if request.args.get("mode") == "dev":
				mode = "dev"
			else:
				mode = None

			day = request.args.get("day")
			full_day = days[request.args.get("day")]

			string_time = str(request.args.get("time"))

			hours, minutes = [int(t) for t in string_time.split("-")]
			time = int(pt_extensions.zero_time(hours) + pt_extensions.zero_time(minutes))

			period, time_data = period_calculator.get_current_period(schedule_id, day, time)
			print(period, "//", time_data)

			if time_data == "No Time":
				time_difference = "NT"
				compiled_time_diff = ""
			else:
				print(time_data[1], "//", int(str(time_data[1])[:2]) in range(1, 24), "//", str(time_data[1])[:2])
				if int(str(time_data[1])[:2]) not in range(1, 24):
					print(int(str(time_data[1])[0]), int(str(time_data[1])[1:]))
					scheduled_end = f"{int(str(time_data[1])[0])}-{int(str(time_data[1])[1:])}"
				else:
					print(int(str(time_data[1])[:2]), int(str(time_data[1])[2:]))
					scheduled_end = f"{int(str(time_data[1])[:2])}-{int(str(time_data[1])[2:])}"

				time_difference = pt_extensions.calculate_time(str(string_time), str(scheduled_end))
				# (time_data[1] = 920) =(ct)=> 92:0 ≠ 9:20
				# time_data[1] (920) ==> (9-20)
				print(period, "//", time_data, "//", time_difference)

				if time_difference[0] != 0:
					compiled_time_diff = f"{time_difference[0]}h{time_difference[1]}m"
				else:
					compiled_time_diff = f"{time_difference[1]}m"

			if len(string_time.split("-")[0]) == 1:
				hours = "0" + str(string_time.split("-")[0])
			else:
				hours = str(string_time.split("-")[0])

			if len(string_time.split("-")[1]) == 1:
				minutes = "0" + str(string_time.split("-")[1])
			else:
				minutes = str(string_time.split("-")[1])

			print(hours, "//", minutes)

			return render_template("index.html", schedule_valid=True, schedules=schedules, schedule_id=schedule_id, schedule_name=schoolname, schedule_color=schedule_id, period=period, day=full_day, time=f"{hours}:{minutes}", get_time_date=False, time_data=time_data, time_diff_raw=time_difference, time_diff=compiled_time_diff, raw=mode)
		else:
			return render_template("index.html", schedule_valid=True, schedule_id=schedule_id, schoolname=schoolname, get_time_date=True)

@app.route("/timecalc", methods=["GET"])
def timecalc():
	time1 = request.args.get("time1")
	time2 = request.args.get("time2")

	return str(pt_extensions.calculate_time(str(time1), str(time2)))

if __name__ == "__main__":
	if len(sys.argv) > 1 and sys.argv[1] == "ci":
		print("Successful execution....")
	else:
		schedules = {"auhsd-ahs": "Acalanes High School"}

		# Repl.it - 8080, Heroku - 3000
		app_port = 3000

		app.run(host="0.0.0.0", port=os.environ["PORT"] or app_port, debug=True)

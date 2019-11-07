"""
Period Time Calculator
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 1.0.1
Last Updated: 2019-09-28, @hkamran80
"""

import time

times = {
	"auhsd-ahs": {
		"MON": {
			"1st Period": (835, 920),
			"Passing: 1/2": (920, 925),
			"2nd Period": (925, 1010),
			"Passing: 2/3": (1010, 1015),
			"3rd Period": (1015,1100),
			"Brunch": (1100, 1110),
			"Passing: Brunch/4": (1110, 1115),
			"4th Period": (1115, 1200),
			"Passing: 4/5": (1200, 1205),
			"5th Period": (1205, 1250),
			"Lunch": (1250, 1325),
			"Passing: Lunch/6": (1325, 1330),
			"6th Period": (1330, 1415),
			"Passing: 6/7": (1415, 1420),
			"7th Period": (1420, 1505)
		},
		"TUE": {
			"1st Period": (800, 930),
			"Passing: 1/2": (930, 940),
			"2nd Period": (940, 1110),
			"Brunch": (1100, 1115),
			"Passing: Brunch/3": (1115, 1125),
			"3rd Period": (1125, 1255),
			"Lunch": (1255, 1325),
			"Passing: Lunch/7": (1325, 1335),
			"7th Period": (1335, 1505)
		},
		"WED": {
			"4th Period": (800, 1005),
			"Passing: 4/Academy": (1005, 1015),
			"Academy": (1015, 1110),
			"Brunch": (1110, 1115),
			"Passing: Brunch/5": (1115, 1125),
			"5th Period": (1125, 1255),
			"Lunch": (1255, 1325),
			"Passing: Lunch/6": (1325, 1335),
			"6th Period": (1335, 1505)
		},
		"THU": {
			"1st Period": (800, 930),
			"Passing: 1/2": (930, 940),
			"2nd Period": (940, 1110),
			"Brunch": (1100, 1115),
			"Passing: Brunch/3": (1115, 1125),
			"3rd Period": (1125, 1255),
			"Lunch": (1255, 1325),
			"Passing: Lunch/7": (1325, 1335),
			"7th Period": (1335, 1505)
		},
		"FRI": {
			"4th Period": (800, 1005),
			"Passing: 4/Academy": (1005, 1015),
			"Academy": (1015, 1110),
			"Brunch": (1110, 1115),
			"Passing: Brunch/5": (1115, 1125),
			"5th Period": (1125, 1255),
			"Lunch": (1255, 1325),
			"Passing: Lunch/6": (1325, 1335),
			"6th Period": (1335, 1505)
		}
	},
    "average-work-day": {
        "MON": {
            "Work": (900, 1700)
        },
        "TUE": {
            "Work": (900, 1700)
        },
        "WED": {
            "Work": (900, 1700)
        },
        "THU": {
            "Work": (900, 1700)
        },
        "FRI": {
            "Work": (900, 1700)
        },
    }
}
def pt_check(expected_value, variable_to_check):
	if variable_to_check[1] > current_time < variable_to_check[0]:
		return True

def get_current_period(school: str, current_day: str, current_time: int):
	try:
		days_period_times = list(times[school][current_day].values())
		for pt in days_period_times:
			if pt[1] > current_time > pt[0]:
				return list(times[school][current_day].keys())[days_period_times.index(pt)], pt

		return "Out of School", "No Time"
	except KeyError:
		return "Out of School", "No Time"

if __name__ == "__main__":
	current_day = time.strftime("%a").upper()
	current_time = int(time.strftime("%H%m"))
	
	#current_day = "THU"
	#current_time = 1119

	for school_key in list(times.keys()):
		print(f"[*] {school_key}")

	school_id = input("Enter school ID: ")
	while school_id not in list(times.keys()):
		for school_key in list(times.keys()):
			print(f"[*] {school_key}")
		school_id = input("Enter school ID: ")

	get_current_period(school_id, current_day, current_time)

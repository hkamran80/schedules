"""
Period Times - Extensions
Contributors:
	:: H. Kamran [@hkamran80] (author)
Version: 1.0.0
Last Updated: 2019-08-26, @hkamran80
"""

import time

def calculate_time(start_time: str, end_time: str):
	print(start_time.split(":"), end_time.split(":"))

	if "-" in start_time:
		st_hr = int(start_time.split("-")[0])
		st_min = int(start_time.split("-")[1])
	elif ":" not in start_time:
		st_hr = int(start_time[:2])
		st_min = int(start_time[2:])
	else:
		st_hr = int(start_time.split(":")[0])
		st_min = int(start_time.split(":")[1])

	if "-" in end_time:
		et_hr = int(end_time.split("-")[0])
		et_min = int(end_time.split("-")[1])
	elif ":" not in end_time:
		et_hr = int(end_time[:2])
		et_min = int(end_time[2:])
	else:
		et_hr = int(end_time.split(":")[0])
		et_min = int(end_time.split(":")[1])

	hour_difference = et_hr - st_hr
	minute_difference = et_min - st_min

	if minute_difference < 0:
		hour_difference = hour_difference - 1
		minute_difference = minute_difference + 60

	return hour_difference, minute_difference

def zero_time(time_zero: str):
	if time_zero < 10:
		return "0" + str(time_zero)
	else:
		return str(time_zero)

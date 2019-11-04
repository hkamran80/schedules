# Schedules ![Build Status](https://img.shields.io/travis/com/hkamran80/schedules?style=for-the-badge) ![Version](https://img.shields.io/badge/version-1.1.5-green?style=for-the-badge)
The app of all schedules

## [Feature Requests](https://github.com/hkamran80/schedules/issues?q=is%3Aissue+is%3Aopen+label%3A%22Feature+Request%22)

## Changelog
* Version 1.1.5 (2019-11-04):
  * Remove the `apple-touch-icon` meta attributes (didn't work when implemented) from `index.html`
  * Rename all instances of `school` to `schedule` in both `index.html` and `main.py`
  * Created new endpoint (`/schedule/<schedule_id/`) to replace `/school?schoolid=...`
  * Removed snackbar, `snackbar.min.js`, and `snackbar.min.css` from `index.html`
  * Added temporary redirect to `/schedule` if someone visits `/school`
  * Preparation for Version 1.2.0 (estimated release: late December 2019)
* Version 1.1.4 (2019-09-04):
  * Add the `apple-touch-icon` meta attributes
    * Spoiler Alert: It doesn't work (tested on an iPhone 7+ running iOS 12)
* Version 1.1.3 (2019-09-03):
  * Temporary fix for [issue #2](https://github.com/hkamran80/schedules/issues/2)
  * Add this changelog to the `README.md`
* Version 1.1.2 (2019-09-02):
  * Add the snackbar

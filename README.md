# [Schedules](https://schedulesapp.herokuapp.com/)
![Build Status](https://img.shields.io/travis/com/hkamran80/schedules?style=for-the-badge)
![Version](https://img.shields.io/badge/version-3.0.0-green?style=for-the-badge)

The app for all schedules

## [Feature Requests](https://github.com/hkamran80/schedules/issues?q=is%3Aissue+is%3Aopen+label%3A%22Feature+Request%22)

## Changelog
* Version 3.0.0 (January 13, 2020):
  * Add `hh:mm:ss` countdown
  * Add generic 404 page
  * Change the schedule background to a dark gray, instead of the previous light blue
  * Add schedule colors to the schedule selection on schedule pages (`/schedule/`)
  * Remove the `un-average-workday` (Average Work Day) schedule
  * Add more notifications
    * Thirty second
    * Thirty minute
  * GitHub Repository Updates
    * Create projects
      * [Version 3](https://github.com/hkamran80/schedules/projects/1)
      * [New Schedules](https://github.com/hkamran80/schedules/projects/4)
    * Improve issue templates
      * Add `New Schedule` template
      * Refactor `Bug Report` and `Feature Request` templates
    * New issue labels
      * [`Architecture Enhancement`](https://github.com/hkamran80/schedules/issues?utf8=✓&q=is%3Aissue+label%3A%22Architecture+Enhancement%22)
* Version 2.0.5 (November 20, 2019):
  * Add notification support
  * Prevent notifications from running when the hour is not equal to zero
  * Update a bunch of stuff (see [PR #28](https://github.com/hkamran80/schedules/pull/28)) to improve the Lighthouse audit scores
* Version 2.0.4 (November 19, 2019):
  * Add schedule selection dropdown to schedule page
  * Force HTTPS
  * Remove legacy support for the ID system
  * The `/school` endpoint has been removed
* Version 2.0.3 (November 18, 2019):
  * Update ID system
  * Update `average-work-day` to `un-average-workday`
  * Update `schedules-colors.css` and `index.html`
* Version 2.0.2 (November 14, 2019):
  * Added changelog to Schedules ([`/changelog`](https://schedulesapp.herokuapp.com/changelog))
  * Created `changelog.json`
* Version 2.0.1 (November 11, 2019):
  * Removed unnecessary files
    * `snackbar*`
    * `period_calculator.py`
    * `pt_extensions.py`
  * Add `apple-touch-icon` meta attributes back
  * Add new icons (`favicon.ico`, `apple-touch-icon-*.png`) in the `/static/img/` folder
* Version 2.0.0 (November 7, 2019):
  * Move **all** calculation code client-side
  * Remove the seperator and the "Refresh" button
  * Remove the `?day=XXX&time=XX-XX` and replace it with client-side JavaScript
  * Don't spam the browser's history by reloading every minute
    * Instead, use the new client-side JS to dynamically reload the *code* (not the page!) every second!
  * Fix bug shown in [issue #6](https://github.com/hkamran80/schedules/issues/6)
  * Removed `/timecalc` endpoint
  * Remove the JavaScript functions: `get_cookie()` and `set_cookie()`
  * Create new **beta** site [schedulesapp-beta.herokuapp.com](https://schedulesapp-beta.herokuapp.com/)
* Version 1.1.5 (November 4, 2019):
  * Remove the `apple-touch-icon` meta attributes (didn't work when implemented) from `index.html`
  * Rename all instances of `school` to `schedule` in both `index.html` and `main.py`
  * Created new endpoint (`/schedule/<schedule_id/`) to replace `/school?schoolid=...`
  * Removed snackbar, `snackbar.min.js`, and `snackbar.min.css` from `index.html`
  * Added temporary redirect to `/schedule` if someone visits `/school`
  * Created new file `runtime.txt` for Heroku, which declares the **exact** Python version to use
    * 1.1.5 is using Python 3.7.5 (`python-3.7.5`)
  * Preparation for Version ~~1.2.0~~ 2.0.0 (estimated release: ~~late December 2019~~ November 7, 2019)
* Version 1.1.4 (September 4, 2019):
  * Add the `apple-touch-icon` meta attributes
    * Spoiler Alert: It doesn't work (tested on an iPhone 7+ running iOS 12)
* Version 1.1.3 (September 3, 2019):
  * Temporary fix for [issue #2](https://github.com/hkamran80/schedules/issues/2)
  * Add this changelog to the `README.md`
* Version 1.1.2 (September 2, 2019):
  * Add the snackbar

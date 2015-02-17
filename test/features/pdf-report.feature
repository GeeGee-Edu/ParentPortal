@libraries=pdf-report
Feature: Download a PDF report

Scenario: Should download a pdf

  Given a week of grades from a cohort of users
  When the manager clicks print
  Then should download a pdf report

Scenario: Each Student starts on an odd page

  Given students with different length reports
  When the report is downloaded
  Then each report should start on a new page

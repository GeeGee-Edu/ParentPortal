@libraries=pdf-report
Feature: Download a PDF report

Scenario: An invalid cohort

  Given cohort doesn't exist
  Then invalid cohort 400 error

Scenario: An unpopulated cohort

  Given cohort has no members
  Then no members 400 error

Scenario: A populated cohort without grades

  Given cohort has members without grades
  Then no grades 400 error

Scenario: A populated cohort with grades

  Given cohort has members with grades
  Then grades should be sorted
  Then a PDF is downloaded

Scenario: A populated cohort with grades and a time frame

  Given cohort has members with grades in timeframe
  Then grades should be sorted and only in timeframe
  Then a timeframed PDF is downloaded




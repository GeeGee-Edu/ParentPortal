@libraries=pdf-report
Feature: Download a PDF report

Scenario: Download the PDF of a populated cohort

  Given cohort has members
  When an authorised user clicks generate report
  Then a PDF is downloaded

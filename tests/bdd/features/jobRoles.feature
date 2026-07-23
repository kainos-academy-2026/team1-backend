Feature: Job Roles
  As an authenticated user
  I want to browse and view job role listings
  So that I can find and apply for roles

  Background:
    Given I am authenticated as a user

  Scenario: Authenticated user can retrieve all job roles
    When I send a GET request to "/job-roles"
    Then the response status should be 200
    And the response body should be a paginated list

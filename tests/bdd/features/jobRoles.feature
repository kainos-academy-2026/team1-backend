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

  Scenario: Authenticated user can retrieve a job role by ID
    When I send a GET request to "/job-roles/1"
    Then the response status should be 200
    And the response body should contain a "roleName"

  Scenario: Request for a non-existent job role returns 404
    When I send a GET request to "/job-roles/999999"
    Then the response status should be 404

  Scenario: Unauthenticated request to job roles is rejected
    Given I clear my authentication token
    When I send a GET request to "/job-roles"
    Then the response status should be 401

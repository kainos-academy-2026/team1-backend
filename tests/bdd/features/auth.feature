Feature: Authentication
  As a new user
  I want to register and log in to the careers portal
  So that I can access job role listings

  Scenario: User can sign up with valid credentials
    When I sign up with a unique email and password "Password1!"
    Then the response status should be 201

  Scenario: User cannot sign up with an invalid password
    When I sign up with a unique email and password "weak"
    Then the response status should be 400

  Scenario: User cannot sign up with a duplicate email
    Given a user already exists with email "bdd_duplicate@example.com" and password "Password1!"
    When I sign up with email "bdd_duplicate@example.com" and password "Password1!"
    Then the response status should be 409

  Scenario: User can log in with valid credentials
    Given a user already exists with email "bdd_login@example.com" and password "Password1!"
    When I log in with email "bdd_login@example.com" and password "Password1!"
    Then the response status should be 200
    And the response body should contain a "token"

  Scenario: User cannot log in with incorrect password
    When I log in with email "bdd_login@example.com" and password "WrongPass1!"
    Then the response status should be 401

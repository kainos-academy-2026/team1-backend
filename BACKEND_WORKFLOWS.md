# Backend API Workflows

This diagram shows the main API workflows in the team1-backend. Use this as a reference when selecting API endpoints to test with Playwright.

```mermaid
graph TD
    A["🌐 API Request"] --> B{Endpoint Type?}
    
    B -->|Auth| C["🔐 Authentication"]
    C --> C1["POST /auth/signup"]
    C1 --> C1A["Validate Input<br/>Schema Check"]
    C1A --> C1B{Valid?}
    C1B -->|Yes| C1C["✅ Create User<br/>Hash Password<br/>Save to DB"]
    C1B -->|No| C1D["❌ Return 400<br/>Validation Error"]
    
    C --> C2["POST /auth/login"]
    C2 --> C2A["Validate Credentials<br/>Schema Check"]
    C2A --> C2B{Credentials Valid?}
    C2B -->|Yes| C2C["✅ Generate JWT<br/>Return Token"]
    C2B -->|No| C2D["❌ Return 401<br/>Invalid Credentials"]
    
    B -->|Job Roles| D["💼 Job Roles"]
    D --> D1["GET /job-roles"]
    D1 --> D1A["Authorize Token<br/>Check User Role"]
    D1A --> D1B{Role Valid?}
    D1B -->|Yes| D1C["✅ Query Database<br/>Return All Roles"]
    D1B -->|No| D1D["❌ Return 403<br/>Unauthorized"]
    
    D --> D2["GET /job-roles/:id"]
    D2 --> D2A["Authorize Token<br/>Validate ID"]
    D2A --> D2B{Valid?}
    D2B -->|Yes| D2C["✅ Query Database<br/>Return Details"]
    D2B -->|No| D2D["❌ Return 404<br/>Not Found"]
    
    D --> D3["POST /job-roles/:id/apply"]
    D3 --> D3A["Authorize Token<br/>Validate Payload"]
    D3A --> D3B{Valid?}
    D3B -->|Yes| D3C["✅ Save Application<br/>Return 201 Created"]
    D3B -->|No| D3D["❌ Return 400<br/>Invalid Data"]
    
    C1C --> A
    C2C --> A
    D1C --> A
    D2C --> A
    D3C --> A
    C1D --> A
    C2D --> A
    D1D --> A
    D2D --> A
    D3D --> A
    
    style A fill:#e1f5ff
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style C1C fill:#c8e6c9
    style C2C fill:#c8e6c9
    style D1C fill:#c8e6c9
    style D2C fill:#c8e6c9
    style D3C fill:#c8e6c9
    style C1D fill:#ffcdd2
    style C2D fill:#ffcdd2
    style D1D fill:#ffcdd2
    style D2D fill:#ffcdd2
    style D3D fill:#ffcdd2
```

## API Endpoints

### Authentication
- **POST /auth/signup** - Create new user account
  - Validates: email, password, name
  - Returns: User ID, created timestamp
  - Error: 400 (validation), 409 (duplicate email)

- **POST /auth/login** - Authenticate user and generate JWT
  - Validates: email, password
  - Returns: JWT token
  - Error: 401 (invalid credentials)

### Job Roles
- **GET /job-roles** - Retrieve all job roles (paginated)
  - Authorization: Admin, User
  - Returns: Array of job role objects
  - Error: 401 (missing token), 403 (invalid role)

- **GET /job-roles/:jobRoleId** - Get specific job role details
  - Authorization: Admin, User
  - Returns: Single job role object
  - Error: 401 (missing token), 403 (invalid role), 404 (not found)

- **POST /job-roles/:jobRoleId/apply** - Submit application for a job role
  - Authorization: Admin, User
  - Validates: application payload
  - Returns: Application ID, confirmation
  - Error: 400 (invalid payload), 401 (missing token), 403 (invalid role), 404 (not found)

## Test Coverage Recommendations

| Endpoint | Test Scenario | Priority |
|----------|---------------|----------|
| POST /auth/signup | Valid signup - user created | High |
| POST /auth/signup | Invalid input - validation error | High |
| POST /auth/signup | Duplicate email - conflict error | High |
| POST /auth/login | Valid credentials - JWT token returned | High |
| POST /auth/login | Invalid credentials - 401 error | High |
| GET /job-roles | Authenticated request - list returned | High |
| GET /job-roles | Missing auth token - 401 error | Medium |
| GET /job-roles/:id | Valid ID - details returned | High |
| GET /job-roles/:id | Invalid ID - 404 error | Medium |
| POST /job-roles/:id/apply | Valid application - 201 created | High |
| POST /job-roles/:id/apply | Invalid payload - 400 error | High |
| POST /job-roles/:id/apply | Unauthorized user - 403 error | Medium |

## Key Testing Points

### Authentication
- JWT token generation
- Token validation in requests
- Password hashing
- Duplicate email handling
- Invalid credential responses

### Authorization
- Role-based access control
- Token expiration
- Missing/invalid token handling
- Admin vs User permissions
- Protected route access

## Response Codes Reference

| Status Code | Meaning | Common Scenarios |
|------------|---------|-----------------|
| 200 | OK - Request successful | GET requests return data |
| 201 | Created - Resource created | POST /auth/signup, POST /apply |
| 400 | Bad Request - Invalid input | Failed validation, malformed payload |
| 401 | Unauthorized - Auth failed | Invalid credentials, missing token |
| 403 | Forbidden - No permission | Insufficient user role |
| 404 | Not Found - Resource missing | Invalid job role ID |
| 500 | Server Error - Internal error | Database connection issues |

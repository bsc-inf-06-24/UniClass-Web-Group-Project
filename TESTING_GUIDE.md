# UniClass Backend - Testing Guide

This guide explains how to test all endpoints in the UniClass backend application using **Postman** or a **browser**. The app is a group management system for Google Classroom that runs on `http://localhost:3000`.

---

## Table of Contents
1. [Setup](#setup)
2. [Authentication Flow](#authentication-flow)
3. [API Endpoints](#api-endpoints)
4. [Testing Workflows](#testing-workflows)

---

## Setup

### Prerequisites
- Backend running: `npm start` in `/uniclass-backend` (runs on `http://localhost:3000`)
- **Postman** (for API testing) or a modern browser
- Valid Google credentials (Google OAuth2 setup required)
- Valid JWT token for authenticated requests

### Key Information
- **Base URL:** `http://localhost:3000`
- **API Version:** `/api/v1/`
- **CORS:** Enabled
- **Auth Method:** JWT Bearer token

---

## Authentication Flow

### 1. Login via Google (Browser or Postman)

#### Endpoint: `GET /api/v1/auth/google`

**Purpose:** Initiates Google OAuth2 login flow

**Method:** GET
**URL:** `http://localhost:3000/api/v1/auth/google`

**Expected Behavior:**
- ✅ Redirects to Google login page
- ✅ User logs in with Google account
- ✅ After consent, redirects to Google callback endpoint
- ✅ User is created in database if doesn't exist
- ✅ JWT token is generated

**Testing:**
- Open in browser: `http://localhost:3000/api/v1/auth/google`
- Complete Google login
- Get redirected to: `http://localhost:3000/auth/success?token=YOUR_JWT_TOKEN`
- **Copy the JWT token** from the URL (you'll need it for authenticated requests)

---

### 2. Get Current User (`/api/v1/auth/me`)

#### Endpoint: `GET /api/v1/auth/me`

**Purpose:** Retrieve currently authenticated user details

**Method:** GET
**URL:** `http://localhost:3000/api/v1/auth/me`
**Auth Required:** ✅ Yes (JWT Bearer token)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "googleId": "123456789",
  "email": "user@gmail.com",
  "name": "John Doe",
  "photo": "https://...",
  "role": "lecturer",
  "googleAccessToken": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Testing in Postman:**
1. Create new request
2. Set method to `GET`
3. Set URL to `http://localhost:3000/api/v1/auth/me`
4. Go to `Headers` tab
5. Add: `Authorization: Bearer YOUR_JWT_TOKEN`
6. Send

**Expected Behavior:**
- ✅ Returns 200 with user details
- ❌ Returns 401 if token is invalid/missing

---

### 3. Logout (`/api/v1/auth/logout`)

#### Endpoint: `POST /api/v1/auth/logout`

**Purpose:** Logout user (invalidates session)

**Method:** POST
**URL:** `http://localhost:3000/api/v1/auth/logout`
**Auth Required:** ✅ Yes (JWT Bearer token)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "message": "Logged out"
}
```

**Testing in Postman:**
1. Create new request
2. Set method to `POST`
3. Set URL to `http://localhost:3000/api/v1/auth/logout`
4. Add JWT token in `Authorization` header
5. Send

**Expected Behavior:**
- ✅ Returns 200 with logout message
- ❌ Returns 401 if token is invalid

---

## API Endpoints

### COURSES ENDPOINTS

All course endpoints require JWT authentication.

---

#### 1. Link a Course (`POST /api/v1/courses`)

**Purpose:** Link a Google Classroom course to the system

**Method:** POST
**URL:** `http://localhost:3000/api/v1/courses`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "classroomCourseId": "123456789"
}
```

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Expected Response (201 Created):**
```json
{
  "id": 1,
  "classroomCourseId": "123456789",
  "name": "Advanced JavaScript",
  "section": "Period 3",
  "lecturer": {
    "id": 1,
    "email": "lecturer@gmail.com",
    "name": "Prof. Smith"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Testing in Postman:**
1. Create new POST request
2. URL: `http://localhost:3000/api/v1/courses`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`, `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "classroomCourseId": "123456789"
}
```
5. Send

**Expected Behavior:**
- ✅ Returns 201 with created course details
- ✅ Course is now linked to the lecturer
- ✅ Uses Google Classroom API to fetch course info
- ❌ Returns 400 if classroomCourseId is invalid
- ❌ Returns 401 if token is invalid

---

#### 2. Get All Courses (`GET /api/v1/courses`)

**Purpose:** Retrieve all courses linked by the authenticated lecturer

**Method:** GET
**URL:** `http://localhost:3000/api/v1/courses`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "classroomCourseId": "123456789",
    "name": "Advanced JavaScript",
    "section": "Period 3",
    "lecturer": { "id": 1, "email": "lecturer@gmail.com", "name": "Prof. Smith" },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "classroomCourseId": "987654321",
    "name": "Python Basics",
    "section": "Period 5",
    "lecturer": { "id": 1, "email": "lecturer@gmail.com", "name": "Prof. Smith" },
    "createdAt": "2024-01-02T00:00:00.000Z"
  }
]
```

**Testing in Postman:**
1. Create new GET request
2. URL: `http://localhost:3000/api/v1/courses`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with array of courses
- ✅ Only shows courses linked by this lecturer
- ✅ Empty array if no courses linked
- ❌ Returns 401 if token invalid

---

#### 3. Get Single Course (`GET /api/v1/courses/:id`)

**Purpose:** Retrieve details of a specific course

**Method:** GET
**URL:** `http://localhost:3000/api/v1/courses/1`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "classroomCourseId": "123456789",
  "name": "Advanced JavaScript",
  "section": "Period 3",
  "lecturer": { "id": 1, "email": "lecturer@gmail.com", "name": "Prof. Smith" },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Testing in Postman:**
1. Create new GET request
2. URL: `http://localhost:3000/api/v1/courses/1` (replace 1 with actual course ID)
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with course details
- ❌ Returns 404 if course ID not found
- ❌ Returns 401 if token invalid

---

#### 4. Sync Students (`GET /api/v1/courses/:id/students` or `POST /api/v1/courses/:id/sync`)

**Purpose:** Fetch and sync all students from Google Classroom course to the database

**Method:** GET or POST
**URL:** `http://localhost:3000/api/v1/courses/1/students` or `http://localhost:3000/api/v1/courses/1/sync`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "synced": 25,
  "students": [
    {
      "id": 2,
      "googleId": "student1@gmail.com",
      "email": "student1@gmail.com",
      "name": "Alice Johnson",
      "photo": "https://...",
      "role": "student",
      "createdAt": "2024-01-01T10:00:00.000Z"
    },
    {
      "id": 3,
      "googleId": "student2@gmail.com",
      "email": "student2@gmail.com",
      "name": "Bob Smith",
      "photo": "https://...",
      "role": "student",
      "createdAt": "2024-01-01T10:05:00.000Z"
    }
  ]
}
```

**Testing in Postman:**
1. Create new GET request
2. URL: `http://localhost:3000/api/v1/courses/1/students`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with synced count and student list
- ✅ Creates new student users in database if not exist
- ✅ Fetches from Google Classroom API using lecturer's access token
- ✅ Students array length matches synced count
- ❌ Returns 404 if course not found
- ❌ Returns 401 if token invalid

---

#### 5. Delete/Unlink Course (`DELETE /api/v1/courses/:id`)

**Purpose:** Remove a course from the system

**Method:** DELETE
**URL:** `http://localhost:3000/api/v1/courses/1`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "classroomCourseId": "123456789",
  "name": "Advanced JavaScript",
  "section": "Period 3",
  "lecturer": { "id": 1, "email": "lecturer@gmail.com", "name": "Prof. Smith" },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Testing in Postman:**
1. Create new DELETE request
2. URL: `http://localhost:3000/api/v1/courses/1` (replace 1 with course ID)
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with deleted course data
- ✅ Course is removed from database
- ❌ Returns 404 if course not found
- ❌ Returns 401 if token invalid

---

### GROUPS ENDPOINTS

All group endpoints require JWT authentication. Groups are always tied to a course.

---

#### 1. Generate Groups (`POST /api/v1/courses/:id/groups/generate`)

**Purpose:** Automatically generate groups from course students. Supports two options:
- `groupSize`: Number of students per group (e.g., 4 students per group)
- `groupCount`: Number of groups to create (e.g., 5 groups total)

If both are provided, `groupSize` takes priority. If neither provided, creates 1 group with all students.

**Method:** POST
**URL:** `http://localhost:3000/api/v1/courses/1/groups/generate`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body - Option 1 (by group size):**
```json
{
  "groupSize": 4
}
```

**Request Body - Option 2 (by group count):**
```json
{
  "groupCount": 5
}
```

**Request Body - Option 3 (by both - groupSize takes priority):**
```json
{
  "groupSize": 3,
  "groupCount": 10
}
```

**Expected Response (201 Created):**
```json
[
  {
    "id": 1,
    "name": "Group 1",
    "published": false,
    "course": {
      "id": 1,
      "classroomCourseId": "123456789",
      "name": "Advanced JavaScript"
    },
    "members": [
      { "id": 5, "email": "student1@gmail.com", "name": "Alice Johnson", "role": "student" },
      { "id": 8, "email": "student4@gmail.com", "name": "David Lee", "role": "student" },
      { "id": 12, "email": "student3@gmail.com", "name": "Carol Williams", "role": "student" },
      { "id": 3, "email": "student2@gmail.com", "name": "Bob Smith", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Group 2",
    "published": false,
    "course": { "id": 1, "classroomCourseId": "123456789", "name": "Advanced JavaScript" },
    "members": [
      { "id": 7, "email": "student6@gmail.com", "name": "Frank Davis", "role": "student" },
      { "id": 9, "email": "student5@gmail.com", "name": "Eve Martin", "role": "student" },
      { "id": 11, "email": "student7@gmail.com", "name": "Grace Brown", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  }
]
```

**Testing in Postman:**
1. Create new POST request
2. URL: `http://localhost:3000/api/v1/courses/1/groups/generate` (use actual course ID)
3. Headers:
   - `Authorization: Bearer YOUR_JWT_TOKEN`
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "groupSize": 4
}
```
5. Send

**Expected Behavior:**
- ✅ Returns 201 with array of generated groups
- ✅ Students are randomly shuffled and distributed
- ✅ Each group has ~equal number of members
- ✅ Groups are unpublished (`published: false`)
- ✅ Deletes any old unpublished groups first
- ✅ Syncs students from Google Classroom before grouping
- ❌ Returns 404 if course not found
- ❌ Returns 401 if token invalid
- ❌ Returns 400 if invalid parameters

---

#### 2. Get Groups for Course (`GET /api/v1/courses/:id/groups`)

**Purpose:** Retrieve all groups for a specific course

**Method:** GET
**URL:** `http://localhost:3000/api/v1/courses/1/groups`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Group 1",
    "published": false,
    "course": { "id": 1, "classroomCourseId": "123456789", "name": "Advanced JavaScript" },
    "members": [
      { "id": 5, "email": "student1@gmail.com", "name": "Alice Johnson", "role": "student" },
      { "id": 8, "email": "student4@gmail.com", "name": "David Lee", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Group 2",
    "published": false,
    "course": { "id": 1, "classroomCourseId": "123456789", "name": "Advanced JavaScript" },
    "members": [
      { "id": 7, "email": "student6@gmail.com", "name": "Frank Davis", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  }
]
```

**Testing in Postman:**
1. Create new GET request
2. URL: `http://localhost:3000/api/v1/courses/1/groups`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with array of groups
- ✅ Empty array if no groups exist
- ✅ Includes published and unpublished groups
- ✅ Each group shows all members
- ❌ Returns 404 if course not found
- ❌ Returns 401 if token invalid

---

#### 3. Get Single Group (`GET /api/v1/groups/:id`)

**Purpose:** Retrieve details of a specific group

**Method:** GET
**URL:** `http://localhost:3000/api/v1/groups/1`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response (200 OK):**
```json
{
  "id": 1,
  "name": "Group 1",
  "published": false,
  "course": {
    "id": 1,
    "classroomCourseId": "123456789",
    "name": "Advanced JavaScript",
    "section": "Period 3"
  },
  "members": [
    { "id": 5, "email": "student1@gmail.com", "name": "Alice Johnson", "role": "student" },
    { "id": 8, "email": "student4@gmail.com", "name": "David Lee", "role": "student" },
    { "id": 12, "email": "student3@gmail.com", "name": "Carol Williams", "role": "student" }
  ],
  "createdAt": "2024-01-01T11:00:00.000Z"
}
```

**Testing in Postman:**
1. Create new GET request
2. URL: `http://localhost:3000/api/v1/groups/1` (use actual group ID)
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Send

**Expected Behavior:**
- ✅ Returns 200 with group details
- ✅ Includes all group members
- ❌ Returns 404 if group not found
- ❌ Returns 401 if token invalid

---

#### 4. Publish Groups (`POST /api/v1/courses/:id/groups/publish`)

**Purpose:** Publish all groups for a course (sets `published: true` for all groups)

**Method:** POST
**URL:** `http://localhost:3000/api/v1/courses/1/groups/publish`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:** (empty)

**Expected Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Group 1",
    "published": true,
    "course": { "id": 1, "classroomCourseId": "123456789", "name": "Advanced JavaScript" },
    "members": [
      { "id": 5, "email": "student1@gmail.com", "name": "Alice Johnson", "role": "student" },
      { "id": 8, "email": "student4@gmail.com", "name": "David Lee", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  },
  {
    "id": 2,
    "name": "Group 2",
    "published": true,
    "course": { "id": 1, "classroomCourseId": "123456789", "name": "Advanced JavaScript" },
    "members": [
      { "id": 7, "email": "student6@gmail.com", "name": "Frank Davis", "role": "student" }
    ],
    "createdAt": "2024-01-01T11:00:00.000Z"
  }
]
```

**Testing in Postman:**
1. Create new POST request
2. URL: `http://localhost:3000/api/v1/courses/1/groups/publish`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body: Leave empty or send `{}`
5. Send

**Expected Behavior:**
- ✅ Returns 200 with updated groups (all `published: true`)
- ✅ All groups for the course are now published
- ✅ Once published, new grouping will create new groups (old unpublished ones are deleted)
- ❌ Returns 404 if course not found
- ❌ Returns 401 if token invalid

---

#### 5. Move Student (`PATCH /api/v1/groups/:id/move-student`)

**Purpose:** Move a student from one group to another

**Method:** PATCH
**URL:** `http://localhost:3000/api/v1/groups/1/move-student`
**Auth Required:** ✅ Yes

**Request Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "studentId": 5,
  "targetGroupId": 2
}
```

**Expected Response (200 OK):**
```json
{
  "source": {
    "id": 1,
    "name": "Group 1",
    "published": false,
    "members": [
      { "id": 8, "email": "student4@gmail.com", "name": "David Lee", "role": "student" },
      { "id": 12, "email": "student3@gmail.com", "name": "Carol Williams", "role": "student" }
    ]
  },
  "target": {
    "id": 2,
    "name": "Group 2",
    "published": false,
    "members": [
      { "id": 7, "email": "student6@gmail.com", "name": "Frank Davis", "role": "student" },
      { "id": 5, "email": "student1@gmail.com", "name": "Alice Johnson", "role": "student" }
    ]
  }
}
```

**Testing in Postman:**
1. Create new PATCH request
2. URL: `http://localhost:3000/api/v1/groups/1/move-student` (use actual group ID)
3. Headers:
   - `Authorization: Bearer YOUR_JWT_TOKEN`
   - `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "studentId": 5,
  "targetGroupId": 2
}
```
5. Send

**Expected Behavior:**
- ✅ Returns 200 with both source and target group details
- ✅ Student is removed from source group
- ✅ Student is added to target group
- ✅ Returns updated member lists
- ❌ Returns 404 if source group not found
- ❌ Returns 404 if target group not found
- ❌ Returns 404 if student not found
- ❌ Returns 401 if token invalid

---

## Testing Workflows

### Workflow 1: Complete Group Management Flow

This is a typical use case for a lecturer managing groups.

**Steps:**
1. ✅ Login via Google (`GET /api/v1/auth/google`)
2. ✅ Verify login (`GET /api/v1/auth/me`) - save JWT token
3. ✅ Link a course (`POST /api/v1/courses`)
   - Use a valid Google Classroom course ID
4. ✅ View all courses (`GET /api/v1/courses`)
   - Verify course appears in list
5. ✅ Sync students from course (`GET /api/v1/courses/:id/students`)
   - Verify student count matches Classroom
6. ✅ Generate groups (`POST /api/v1/courses/:id/groups/generate`)
   - Try with `groupSize: 4`
7. ✅ View generated groups (`GET /api/v1/courses/:id/groups`)
   - Verify groups and member distribution
8. ✅ View single group details (`GET /api/v1/groups/:id`)
9. ✅ Move a student between groups (`PATCH /api/v1/groups/:id/move-student`)
   - Move student from Group 1 to Group 2
10. ✅ Publish groups (`POST /api/v1/courses/:id/groups/publish`)
    - Mark all groups as final
11. ✅ Verify published groups (`GET /api/v1/groups/:id`)
    - Check that `published: true`
12. ✅ Logout (`POST /api/v1/auth/logout`)

---

### Workflow 2: Error Testing

Test error cases to ensure proper error handling.

**Invalid Token:**
- Any endpoint without token → 401 Unauthorized
- Any endpoint with invalid token → 401 Unauthorized

**Non-existent Resources:**
- `GET /api/v1/courses/999` → 404 Not Found
- `GET /api/v1/groups/999` → 404 Not Found

**Invalid Requests:**
- `POST /api/v1/courses` without body → 400 Bad Request
- `PATCH /api/v1/groups/1/move-student` with invalid studentId → 404 Not Found

---

### Workflow 3: Group Generation Testing

Test different group generation strategies.

**Test 1: By Group Size**
```json
{
  "groupSize": 3
}
```
Expected: If 12 students, creates 4 groups of 3 students each

**Test 2: By Group Count**
```json
{
  "groupCount": 5
}
```
Expected: If 20 students, creates 5 groups of 4 students each

**Test 3: Uneven Distribution**
```json
{
  "groupSize": 4
}
```
Expected: If 15 students, creates 3 groups (3 of size 4, 1 of size 3) or distributed evenly

**Test 4: Generate Again**
1. Generate groups once
2. Generate again with different parameters
Expected: Previous unpublished groups are deleted, new groups created

**Test 5: Publish, Then Generate**
1. Generate groups
2. Publish groups
3. Generate new groups
Expected: New groups are created (old published groups remain)

---

## Postman Collection Setup (Quick Reference)

### Environment Variables
Create a Postman Environment with these variables:
```
base_url: http://localhost:3000
jwt_token: YOUR_JWT_TOKEN_FROM_GOOGLE_LOGIN
course_id: 1
group_id: 1
student_id: 5
```

### Example Requests

**Auth - Get Current User**
```
GET {{base_url}}/api/v1/auth/me
Header: Authorization: Bearer {{jwt_token}}
```

**Courses - Get All**
```
GET {{base_url}}/api/v1/courses
Header: Authorization: Bearer {{jwt_token}}
```

**Groups - Generate**
```
POST {{base_url}}/api/v1/courses/{{course_id}}/groups/generate
Header: Authorization: Bearer {{jwt_token}}
Header: Content-Type: application/json
Body: {
  "groupSize": 4
}
```

**Groups - Move Student**
```
PATCH {{base_url}}/api/v1/groups/{{group_id}}/move-student
Header: Authorization: Bearer {{jwt_token}}
Header: Content-Type: application/json
Body: {
  "studentId": {{student_id}},
  "targetGroupId": 2
}
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized on all requests | Missing/invalid JWT token | Re-login via Google OAuth |
| 404 on course endpoints | Course ID doesn't exist | Verify course ID in database |
| Groups not generating | No students in course | Run sync students first |
| CORS errors | Backend CORS not enabled | Backend has CORS enabled by default |
| Google API errors | Invalid classroom course ID | Use valid ID from Google Classroom |
| No students synced | Access token expired | Re-login to refresh token |

---

## API Response Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource successfully created |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Missing/invalid JWT token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server error |

---

## Notes

- All endpoints return JSON responses
- All authenticated endpoints require `Authorization: Bearer {token}` header
- Request/response bodies use JSON format
- Timestamps are in ISO 8601 format
- Student lists in groups are eagerly loaded (included in response)
- Groups can only be published once (status: `published: true`)

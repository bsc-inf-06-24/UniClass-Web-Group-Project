# UniClass Web Group Project

UniClass is a group-management API for university classes. It helps lecturers view a course roster, generate student groups automatically, move students between groups, and publish the final group list.

For this submission we removed Google authentication and Google Classroom dependency. The app now seeds Oracle with local course and student data on startup, so the lecturers can run and test every endpoint immediately without external access or OAuth verification.

## What Problem This Solves

The original idea depended on Google Classroom and Google login. That makes grading harder because the app needs verified Google access and the lecturer would need to sign in before testing anything.

This version avoids that problem by:
- using local Oracle seed data for students and courses
- keeping the same group-generation flow
- exposing public endpoints that work right after startup

## Backend Setup

### 1. Go to the backend folder

```bash
cd uniclass-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the app

```bash
npm run start
```

The app seeds the database automatically on startup.

## Environment Variables

Create `uniclass-backend/.env` and add:

- `JWT_SECRET`: used by the app for JWT setup. Keep it long and random.
- `DB_HOST`: Oracle host, usually `localhost`.
- `DB_PORT`: Oracle listener port, usually `1521`.
- `DB_USER`: Oracle username for the app.
- `DB_PASS`: Oracle password for that user.
- `DB_SERVICE_NAME`: Oracle PDB service name. In this project it is `medispdb`.

## API Overview

Base URL: `http://localhost:3000`

Swagger: `http://localhost:3000/api/docs`

The most useful endpoints to start with are:

### 1. List seeded students

`GET /api/v1/users`

Returns the seeded student roster with registration numbers.

Expected output: an array of students such as `BSC/48/24`, `COM221`, and `COM2` cohort data.

### 2. List seeded courses

`GET /api/v1/courses`

Returns the seeded courses.

Expected output: courses like `COM221`, `COM222`, `INF221`, `INF222`, and `MAT222`.

### 3. View a single course

`GET /api/v1/courses/:id`

Shows the course details and the seeded students assigned to it.

Expected output: course code, name, credits, course type, and student list.

### 4. Generate groups

`POST /api/v1/courses/:id/groups/generate`

Body:

```json
{
  "groupSize": 4
}
```

Expected output: a list of groups named `Group 1`, `Group 2`, etc., with students distributed across them.

### 5. View groups

`GET /api/v1/courses/:id/groups`

Shows all groups created for that course.

### 6. Move a student

`PATCH /api/v1/groups/:id/move-student`

Body:

```json
{
  "studentRegNumber": "BSC/48/24",
  "targetGroupId": 2
}
```

Expected output: the student moves from one group to another.

### 7. Publish groups

`POST /api/v1/courses/:id/groups/publish`

Marks the groups as final.

## Suggested Testing Order

1. Open Swagger and call `GET /api/v1/users`.
2. Call `GET /api/v1/courses`.
3. Pick one course ID and call `GET /api/v1/courses/:id`.
4. Generate groups with `POST /api/v1/courses/:id/groups/generate`.
5. Check the results with `GET /api/v1/courses/:id/groups`.
6. Move a student with `PATCH /api/v1/groups/:id/move-student`.
7. Publish the groups when done.

## Notes for Lecturers

- No Google login is needed.
- No token copy-paste is needed.
- Restarting the backend resets the demo data because the seed runs on startup.
- If Oracle is not running or `.env` values are wrong, the app will not start.

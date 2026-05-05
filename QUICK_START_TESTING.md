# UniClass API - Quick Start Testing Guide

Get testing quickly with this step-by-step guide.

---

## 5-Minute Setup

### Prerequisites
- Backend running: `npm start` in `uniclass-backend/` (port 3000)
- Postman installed (optional, but recommended)
- Google OAuth configured in `.env`

### Step 1: Import Postman Collection
1. Open Postman
2. Click **Import** (top-left)
3. Select **Upload Files**
4. Choose `UniClass-API.postman_collection.json`
5. Click **Import**

### Step 2: Set Environment Variables
In Postman, at the top right, click the **Environment** dropdown:
```
base_url: http://localhost:3000
jwt_token: (will fill after login)
course_id: (will fill after creating course)
group_id: (will fill after generating groups)
student_id: (will fill from sync)
```

---

## Testing Without Postman (Using Browser)

### 1. Login
Open in browser:
```
http://localhost:3000/api/v1/auth/google
```
- Complete Google login
- **SAVE the JWT token** from redirect URL: `http://localhost:3000/auth/success?token=YOUR_TOKEN`

### 2. Verify Login (Browser or curl)
Replace `YOUR_TOKEN` with actual token:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/v1/auth/me
```

### 3. Link Course (curl)
Replace values:
```bash
curl -X POST http://localhost:3000/api/v1/courses \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classroomCourseId": "123456789"}'
```

---

## Complete Testing Workflow

### Phase 1: Authentication ✅
**[1 min]**

- [ ] `GET /api/v1/auth/google` - Open in browser, complete login
- [ ] `GET /api/v1/auth/me` - Verify login works
- [ ] Copy JWT token and save for next requests

**Expected:** User details with email, name, role

---

### Phase 2: Course Management ✅
**[3 mins]**

- [ ] `POST /api/v1/courses` - Link a Google Classroom course
  - Use real course ID from Google Classroom
  - Body: `{"classroomCourseId": "xxx"}`
- [ ] `GET /api/v1/courses` - List all your courses
- [ ] `GET /api/v1/courses/:id` - View single course
- [ ] `GET /api/v1/courses/:id/students` - Sync students from Classroom
  - Save returned course_id and student_id for next phase

**Expected:** 
- Course appears with name and section
- Students from Google Classroom are listed
- Student count > 0

---

### Phase 3: Group Generation ✅
**[3 mins]**

- [ ] `POST /api/v1/courses/:id/groups/generate` - Generate groups
  - Body: `{"groupSize": 4}` (adjust based on student count)
- [ ] `GET /api/v1/courses/:id/groups` - View all generated groups
- [ ] `GET /api/v1/groups/:id` - View single group details

**Expected:**
- Groups created with name "Group 1", "Group 2", etc.
- Members distributed across groups
- `published: false` (not yet finalized)

---

### Phase 4: Group Management ✅
**[2 mins]**

- [ ] `PATCH /api/v1/groups/:id/move-student` - Move student to different group
  - Body: `{"studentId": 5, "targetGroupId": 2}`
- [ ] `GET /api/v1/groups/:id` - Verify student moved
- [ ] `POST /api/v1/courses/:id/groups/publish` - Finalize groups
- [ ] `GET /api/v1/groups/:id` - Verify `published: true`

**Expected:**
- Student appears in target group
- Student removed from source group
- Published groups cannot be re-generated (creates new ones)

---

### Phase 5: Cleanup ✅
**[1 min]**

- [ ] `DELETE /api/v1/courses/:id` - Remove course
- [ ] `POST /api/v1/auth/logout` - Logout

**Expected:** Course removed from database

---

## API Response Examples

### 200 OK Response
```json
{
  "id": 1,
  "name": "Group 1",
  "published": false,
  "members": [
    {"id": 2, "name": "Alice", "email": "alice@gmail.com"},
    {"id": 3, "name": "Bob", "email": "bob@gmail.com"}
  ]
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Course not found"
}
```

---

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Missing JWT token | Copy token from Google login redirect |
| `401 Unauthorized` | Invalid token | Re-login via Google OAuth |
| `404 Course not found` | Wrong course ID | Check course ID in `GET /api/v1/courses` |
| `404 Group not found` | Wrong group ID | Check group ID in `GET /api/v1/courses/:id/groups` |
| `400 Bad Request` | Missing required fields | Check request body matches DTO |
| `CORS error` | N/A - CORS enabled | Verify backend is running |
| `Connection refused` | Backend not running | Start backend: `npm start` |

---

## Testing Checklist

### Authentication
- [ ] Google login successful
- [ ] JWT token obtained
- [ ] `/auth/me` returns user data
- [ ] Logout works

### Courses
- [ ] Can link course from Google Classroom
- [ ] Course appears in list
- [ ] Can view course details
- [ ] Can sync students
- [ ] Can delete course

### Groups
- [ ] Can generate groups by size
- [ ] Can generate groups by count
- [ ] Groups have correct member count
- [ ] Can move students between groups
- [ ] Can publish groups
- [ ] Cannot generate published groups

### Error Handling
- [ ] Missing token returns 401
- [ ] Invalid course ID returns 404
- [ ] Invalid group ID returns 404
- [ ] Invalid student ID returns 404

---

## Postman Tips

### Save Environment Variables Dynamically
Add this as a test in any request that returns data you need:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
  const body = pm.response.json();
  
  // Save IDs for future requests
  if (body.id) pm.environment.set("course_id", body.id);
  if (body.students && body.students[0]) {
    pm.environment.set("student_id", body.students[0].id);
  }
}
```

### Pre-request Authentication
Add this as pre-request script to auto-add token to all requests:

```javascript
// This is already in collection - just reference saved jwt_token variable
pm.request.headers.add({
  key: "Authorization",
  value: `Bearer ${pm.environment.get("jwt_token")}`
});
```

---

## Testing Different Scenarios

### Scenario 1: Generate Different Group Sizes
```
Request 1: {"groupSize": 2}  → All groups have 2 students
Request 2: {"groupSize": 5}  → All groups have ~5 students
Request 3: {"groupCount": 3} → Create exactly 3 groups
```

### Scenario 2: Regenerate Groups
```
1. Generate groups (published: false)
2. Generate again with different size
   → Old groups deleted, new groups created
3. Publish groups
4. Generate new groups again
   → New groups created (published groups kept)
```

### Scenario 3: Move Multiple Students
```
1. Move student 1 from Group A to Group B
2. Move student 2 from Group B to Group A
3. Verify both students swapped correctly
```

---

## Performance Testing Ideas

### Load Test
- Generate large number of groups (1000+ students)
- Measure response time
- Expected: < 5 seconds

### Stress Test
- Rapid successive requests
- Concurrent group generations
- Expected: No data corruption

### Data Integrity
- Generate groups
- Move students
- Verify no duplicate members
- Verify all students accounted for

---

## Next Steps

- Review [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed endpoint documentation

- Review source code in [uniclass-backend/src](uniclass-backend/src)

# LMS API Endpoints

## 🔐 Auth

| Method | Endpoint                    | Description                    | Done |
| ------ | --------------------------- | ------------------------------ | ---- |
| POST   | `/api/auth/register`        | Register a new user            | ✅   |
| POST   | `/api/auth/login`           | Login and receive token        | ✅   |
| GET    | `/api/auth/me`              | Get current authenticated user | ✅   |
| PUT    | `/api/auth/change-password` | Change user password           | ✅   |

## 👤 Users

| Method | Endpoint         | Description             | Done |
| ------ | ---------------- | ----------------------- | ---- |
| GET    | `/api/users`     | Get all users _(admin)_ | ✅   |
| GET    | `/api/users/:id` | Get user by ID          | ✅   |
| PUT    | `/api/users/:id` | Update user profile     | ✅   |
| DELETE | `/api/users/:id` | Delete user _(admin)_   | ✅   |

## 🗂️ Categories

| Method | Endpoint                      | Description                  | Done |
| ------ | ----------------------------- | ---------------------------- | ---- |
| GET    | `/api/categories`             | Get all categories           | ✅   |
| GET    | `/api/categories/:id/courses` | Get courses under a category | ✅   |
| POST   | `/api/categories`             | Create a category _(admin)_  | ✅   |
| PUT    | `/api/categories/:id`         | Update a category _(admin)_  | ✅   |
| DELETE | `/api/categories/:id`         | Delete a category _(admin)_  | ✅   |

## 📚 Courses

| Method | Endpoint                       | Description                                 | Done |
| ------ | ------------------------------ | ------------------------------------------- | ---- |
| GET    | `/api/courses`                 | Browse / search / filter courses            | ✅   |
| GET    | `/api/courses/my`              | Get Instructor Courses _(instructor)_       | ✅   |
| GET    | `/api/courses/instructor/:id`  | Get Instructor Courses                      | ✅   |
| GET    | `/api/courses/:id`             | Get course details                          | ✅   |
| POST   | `/api/courses`                 | Create a new course _(instructor)_          | ✅   |
| PUT    | `/api/courses/:id`             | Update a course _(instructor)_              | ✅   |
| DELETE | `/api/courses/:id`             | Delete a course _(instructor / admin)_      | ✅   |
| GET    | `/api/courses/:id/content`     | Get data used in side panel                 | ✅   |
| GET    | `/api/courses/:id/sections`    | Get all sections of a course                | ✅   |
| GET    | `/api/courses/:id/reviews`     | Get reviews for a course                    |
| GET    | `/api/courses/:id/enrollments` | Get enrollments for a course _(instructor)_ | ✅   |

## 📦 Sections

| Method | Endpoint                          | Description                     | Done |
| ------ | --------------------------------- | ------------------------------- | ---- |
| POST   | `/api/sections`                   | Create a section under a course | ✅   |
| PUT    | `/api/sections/:course_id/:order` | Update a section                | ✅   |
| DELETE | `/api/sections/:course_id/:order` | Delete a section                | ✅   |

## 🎬 Lessons

| Method | Endpoint                                 | Description                     | Done |
| ------ | ---------------------------------------- | ------------------------------- | ---- |
| POST   | `/api/lessons`                           | Create a lesson under a section | ✅   |
| GET    | `/api/lessons/:course_id/:sec_o/:les_o`  | Get lesson details              | ✅   |
| PUT    | `/api/lessons/:course_id/:sec_o/:les_o`  | Update a lesson                 | ✅   |
| DELETE | `/api/lessons/:course_id/:sec_o/:les_o`  | Delete a lesson                 | ✅   |
| POST   | `/api/lessons/:course_id/:s_o/:l_o/comp` | Mark a lesson as complete       | ✅   |

## 🎓 Enrollments

| Method | Endpoint               | Description                       | Done |
| ------ | ---------------------- | --------------------------------- | ---- |
| POST   | `/api/enrollments`     | Enroll in a course                | ✅   |
| GET    | `/api/enrollments/my`  | Get current student's enrollments | ✅   |
| GET    | `/api/enrollments/:id` | Get enrollment details            | ✅   |
| DELETE | `/api/enrollments/:id` | Unenroll from a course            | ✅   |

## 📈 Progress

| Method | Endpoint                        | Description                    | Done |
| ------ | ------------------------------- | ------------------------------ | ---- |
| GET    | `/api/enrollments/:id/progress` | Get progress for an enrollment | ✅   |
| POST   | `/api/progress`                 | Mark a lesson as complete      | ✅   |

## ⭐ Reviews

| Method | Endpoint           | Description                            | Done |
| ------ | ------------------ | -------------------------------------- | ---- |
| POST   | `/api/reviews`     | Create a review _(tied to enrollment)_ |
| GET    | `/api/reviews/:id` | Get review by ID                       |
| PUT    | `/api/reviews/:id` | Update a review                        |
| DELETE | `/api/reviews/:id` | Delete a review                        |

## 🏆 Certificates

| Method | Endpoint                | Description                     | Done |
| ------ | ----------------------- | ------------------------------- | ---- |
| GET    | `/api/certificates/`    | Get current user's certificates | ✅   |
| GET    | `/api/certificates/:id` | Get certificate by ID           | ✅   |

## 💰 Earnings

| Method | Endpoint           | Description                | Done |
| ------ | ------------------ | -------------------------- | ---- |
| GET    | `/api/earnings/my` | Get instructor's earnings  |
| GET    | `/api/earnings`    | Get all earnings _(admin)_ |

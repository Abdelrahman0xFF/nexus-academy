# LMS API Endpoints

## 🔐 Auth

| Method | Endpoint                    | Description                    | Done |
| ------ | --------------------------- | ------------------------------ | ---- |
| POST   | `/api/auth/register`        | Register a new user            | ✅   |
| POST   | `/api/auth/verify-otp`      | Verify email with OTP          | ✅   |
| POST   | `/api/auth/login`           | Login and receive token        | ✅   |
| GET    | `/api/auth/me`              | Get current authenticated user | ✅   |
| PUT    | `/api/auth/change-password` | Change user password           | ✅   |

## 👤 Users

| Method | Endpoint              | Description                      | Done |
| ------ | --------------------- | -------------------------------- | ---- |
| GET    | `/api/users`          | Get all users _(admin)_          | ✅   |
| GET    | `/api/users/:user_id` | Get user by ID _(admin / owner)_ | ✅   |
| PUT    | `/api/users/:user_id` | Update user profile              | ✅   |
| DELETE | `/api/users/:user_id` | Delete user _(admin)_            | ✅   |

## 🗂️ Categories

| Method | Endpoint                               | Description                  | Done |
| ------ | -------------------------------------- | ---------------------------- | ---- |
| GET    | `/api/categories`                      | Get all categories           | ✅   |
| GET    | `/api/categories/:category_id`         | Get category by ID           | ✅   |
| GET    | `/api/categories/:category_id/courses` | Get courses under a category | ✅   |
| POST   | `/api/categories`                      | Create a category _(admin)_  | ✅   |
| PUT    | `/api/categories/:category_id`         | Update a category _(admin)_  | ✅   |
| DELETE | `/api/categories/:category_id`         | Delete a category _(admin)_  | ✅   |

## 📚 Courses

| Method | Endpoint                                 | Description                                  | Done |
| ------ | ---------------------------------------- | -------------------------------------------- | ---- |
| GET    | `/api/courses`                           | Browse (supports search/filter query params) | ✅   |
| GET    | `/api/courses/my`                        | Get Instructor Courses _(instructor)_        | ✅   |
| GET    | `/api/courses/instructor/:instructor_id` | Get Instructor Courses                       | ✅   |
| GET    | `/api/courses/:course_id`                | Get course details                           | ✅   |
| POST   | `/api/courses`                           | Create a new course _(instructor)_           | ✅   |
| PUT    | `/api/courses/:course_id`                | Update a course _(instructor)_               | ✅   |
| DELETE | `/api/courses/:course_id`                | Delete a course _(instructor / admin)_       | ✅   |
| GET    | `/api/courses/:course_id/content`        | Get data used in side panel                  | ✅   |
| GET    | `/api/courses/:course_id/sections`       | Get all sections of a course                 | ✅   |
| GET    | `/api/courses/:course_id/reviews`        | Get reviews for a course                     | ✅   |
| GET    | `/api/courses/:course_id/enrollments`    | Get enrollments for a course _(instructor)_  | ✅   |
| GET    | `/api/courses/:course_id/stats`          | Get course analytics/stats _(instructor)_    | ✅   |

## 📦 Sections

| Method | Endpoint                                  | Description                     | Done |
| ------ | ----------------------------------------- | ------------------------------- | ---- |
| POST   | `/api/sections`                           | Create a section under a course | ✅   |
| PUT    | `/api/sections/:course_id/:section_order` | Update a section                | ✅   |
| DELETE | `/api/sections/:course_id/:section_order` | Delete a section                | ✅   |

## 🎬 Lessons

| Method | Endpoint                                                        | Description                     | Done |
| ------ | --------------------------------------------------------------- | ------------------------------- | ---- |
| POST   | `/api/lessons`                                                  | Create a lesson under a section | ✅   |
| GET    | `/api/lessons/:course_id/:section_order/:lesson_order`          | Get lesson details              | ✅   |
| PUT    | `/api/lessons/:course_id/:section_order/:lesson_order`          | Update a lesson                 | ✅   |
| DELETE | `/api/lessons/:course_id/:section_order/:lesson_order`          | Delete a lesson                 | ✅   |
| POST   | `/api/lessons/:course_id/:section_order/:lesson_order/complete` | Mark a lesson as complete       | ✅   |

## 🎓 Enrollments

| Method | Endpoint                               | Description                       | Done |
| ------ | -------------------------------------- | --------------------------------- | ---- |
| POST   | `/api/enrollments`                     | Enroll in a course                | ✅   |
| GET    | `/api/enrollments/my`                  | Get current student's enrollments | ✅   |
| GET    | `/api/enrollments/progress/:course_id` | Get progress for an enrollment    | ✅   |
| DELETE | `/api/enrollments/:course_id`          | Unenroll from a course            | ✅   |

## ⭐ Reviews

| Method | Endpoint           | Description                            | Done |
| ------ | ------------------ | -------------------------------------- | ---- |
| GET    | `/api/reviews/:id` | Get review by ID                       | ✅   |
| POST   | `/api/reviews`     | Create a review _(tied to enrollment)_ | ✅   |
| PUT    | `/api/reviews/:id` | Update a review                        | ✅   |
| DELETE | `/api/reviews/:id` | Delete a review                        | ✅   |

## 🏆 Certificates

| Method | Endpoint                | Description                     | Done |
| ------ | ----------------------- | ------------------------------- | ---- |
| GET    | `/api/certificates/`    | Get current user's certificates | ✅   |
| GET    | `/api/certificates/:id` | Get certificate by ID           | ✅   |

## 💰 Earnings

| Method | Endpoint                  | Description                      | Done |
| ------ | ------------------------- | -------------------------------- | ---- |
| GET    | `/api/earnings`           | Get earnings and revenue summary | ✅   |
| GET    | `/api/earnings/analytics` | Get historical earnings data     | ✅   |

## 📁 Media

| Method | Endpoint             | Description                | Done |
| ------ | -------------------- | -------------------------- | ---- |
| POST   | `/api/media`         | Upload media (Admin/Instr) | ✅   |
| GET    | `/api/media/:fileId` | Stream/Get media file      | ✅   |
| DELETE | `/api/media/:fileId` | Delete media file          | ✅   |

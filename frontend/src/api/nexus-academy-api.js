/**
 * Nexus Academy API Client
 * Complete API integration for the Nexus Academy backend
 */

const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to get JWT token from cookies
const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authAPI = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Verify OTP
   * POST /auth/verify-otp
   */
  verifyOTP: async (email, otp) => {
    return apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  /**
   * Resend OTP
   * POST /auth/resend-otp
   */
  resendOTP: async (email) => {
    return apiRequest('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Login
   * POST /auth/login
   */
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get current user profile
   * GET /auth/me
   */
  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  /**
   * Change password
   * PUT /auth/change-password
   */
  changePassword: async (passwords) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  },
};

// ============================================
// USERS ENDPOINTS
// ============================================

export const usersAPI = {
  /**
   * Get all users (Admin)
   * GET /users
   */
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/users?${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Get user by ID
   * GET /users/{user_id}
   */
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'GET',
    });
  },

  /**
   * Update user
   * PUT /users/{user_id}
   */
  updateUser: async (userId, userData) => {
    return apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Delete user (Admin)
   * DELETE /users/{user_id}
   */
  deleteUser: async (userId) => {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// CATEGORIES ENDPOINTS
// ============================================

export const categoriesAPI = {
  /**
   * Get all categories
   * GET /categories
   */
  getAllCategories: async () => {
    return apiRequest('/categories', {
      method: 'GET',
    });
  },

  /**
   * Create category (Admin)
   * POST /categories
   */
  createCategory: async (categoryData) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Get category by ID
   * GET /categories/{category_id}
   */
  getCategoryById: async (categoryId) => {
    return apiRequest(`/categories/${categoryId}`, {
      method: 'GET',
    });
  },

  /**
   * Update category (Admin)
   * PUT /categories/{category_id}
   */
  updateCategory: async (categoryId, categoryData) => {
    return apiRequest(`/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  /**
   * Delete category (Admin)
   * DELETE /categories/{category_id}
   */
  deleteCategory: async (categoryId) => {
    return apiRequest(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// COURSES ENDPOINTS
// ============================================

export const coursesAPI = {
  /**
   * Get all courses
   * GET /courses
   */
  getAllCourses: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses?${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Create course (Instructor)
   * POST /courses
   */
  createCourse: async (courseData) => {
    return apiRequest('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  /**
   * Get course by ID
   * GET /courses/{course_id}
   */
  getCourseById: async (courseId) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'GET',
    });
  },

  /**
   * Update course
   * PUT /courses/{course_id}
   */
  updateCourse: async (courseId, courseData) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  /**
   * Delete course
   * DELETE /courses/{course_id}
   */
  deleteCourse: async (courseId) => {
    return apiRequest(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get course content (curriculum)
   * GET /courses/{course_id}/content
   */
  getCourseContent: async (courseId) => {
    return apiRequest(`/courses/${courseId}/content`, {
      method: 'GET',
    });
  },

  /**
   * Get course enrollments (Instructor/Admin)
   * GET /courses/{course_id}/enrollments
   */
  getCourseEnrollments: async (courseId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses/${courseId}/enrollments?${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Get course reviews
   * GET /courses/{course_id}/reviews
   */
  getCourseReviews: async (courseId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/courses/${courseId}/reviews?${queryString}`, {
      method: 'GET',
    });
  },
};

// ============================================
// SECTIONS ENDPOINTS
// ============================================

export const sectionsAPI = {
  /**
   * Create section
   * POST /sections
   */
  createSection: async (sectionData) => {
    return apiRequest('/sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  },

  /**
   * Update section
   * PUT /sections/{course_id}/{section_order}
   */
  updateSection: async (courseId, sectionOrder, sectionData) => {
    return apiRequest(`/sections/${courseId}/${sectionOrder}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  },

  /**
   * Delete section
   * DELETE /sections/{course_id}/{section_order}
   */
  deleteSection: async (courseId, sectionOrder) => {
    return apiRequest(`/sections/${courseId}/${sectionOrder}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// LESSONS ENDPOINTS
// ============================================

export const lessonsAPI = {
  /**
   * Create lesson
   * POST /lessons
   */
  createLesson: async (lessonData) => {
    return apiRequest('/lessons', {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  },

  /**
   * Get lesson
   * GET /lessons/{course_id}/{section_order}/{lesson_order}
   */
  getLesson: async (courseId, sectionOrder, lessonOrder) => {
    return apiRequest(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}`, {
      method: 'GET',
    });
  },

  /**
   * Update lesson
   * PUT /lessons/{course_id}/{section_order}/{lesson_order}
   */
  updateLesson: async (courseId, sectionOrder, lessonOrder, lessonData) => {
    return apiRequest(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
  },

  /**
   * Delete lesson
   * DELETE /lessons/{course_id}/{section_order}/{lesson_order}
   */
  deleteLesson: async (courseId, sectionOrder, lessonOrder) => {
    return apiRequest(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}`, {
      method: 'DELETE',
    });
  },

  /**
   * Mark lesson as complete
   * POST /lessons/{course_id}/{section_order}/{lesson_order}/complete
   */
  markLessonComplete: async (courseId, sectionOrder, lessonOrder) => {
    return apiRequest(`/lessons/${courseId}/${sectionOrder}/${lessonOrder}/complete`, {
      method: 'POST',
    });
  },
};

// ============================================
// ENROLLMENTS ENDPOINTS
// ============================================

export const enrollmentsAPI = {
  /**
   * Enroll in course
   * POST /enrollments
   */
  enrollInCourse: async (enrollmentData) => {
    return apiRequest('/enrollments', {
      method: 'POST',
      body: JSON.stringify(enrollmentData),
    });
  },

  /**
   * Get my enrollments
   * GET /enrollments/my
   */
  getMyEnrollments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/enrollments/my?${queryString}`, {
      method: 'GET',
    });
  },

  /**
   * Get enrollment progress
   * GET /enrollments/progress/{course_id}
   */
  getEnrollmentProgress: async (courseId) => {
    return apiRequest(`/enrollments/progress/${courseId}`, {
      method: 'GET',
    });
  },
};

// ============================================
// REVIEWS ENDPOINTS
// ============================================

export const reviewsAPI = {
  /**
   * Get my review for a course
   * GET /reviews/{course_id}
   */
  getMyReview: async (courseId) => {
    return apiRequest(`/reviews/${courseId}`, {
      method: 'GET',
    });
  },

  /**
   * Create review
   * POST /reviews/{course_id}
   */
  createReview: async (courseId, reviewData) => {
    return apiRequest(`/reviews/${courseId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Update review
   * PUT /reviews/{course_id}
   */
  updateReview: async (courseId, reviewData) => {
    return apiRequest(`/reviews/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Delete review
   * DELETE /reviews/{course_id}
   */
  deleteReview: async (courseId) => {
    return apiRequest(`/reviews/${courseId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// CERTIFICATES ENDPOINTS
// ============================================

export const certificatesAPI = {
  /**
   * Get my certificates
   * GET /certificates
   */
  getMyCertificates: async () => {
    return apiRequest('/certificates', {
      method: 'GET',
    });
  },

  /**
   * Verify certificate
   * GET /certificates/verify/{certificate_id}
   */
  verifyCertificate: async (certificateId) => {
    return apiRequest(`/certificates/verify/${certificateId}`, {
      method: 'GET',
    });
  },

  /**
   * Download certificate
   * GET /certificates/download/{course_id}
   */
  downloadCertificate: async (courseId) => {
    const token = getAuthToken();
    
    // For file downloads, we need to handle it differently
    const url = `${API_BASE_URL}/certificates/download/${courseId}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }

    // Return blob for PDF download
    return response.blob();
  },
};

// ============================================
// EARNINGS ENDPOINTS (Instructor)
// ============================================

export const earningsAPI = {
  /**
   * Get earnings
   * GET /earnings
   */
  getEarnings: async () => {
    return apiRequest('/earnings', {
      method: 'GET',
    });
  },

  /**
   * Get analytics
   * GET /earnings/analytics
   */
  getAnalytics: async () => {
    return apiRequest('/earnings/analytics', {
      method: 'GET',
    });
  },
};

// ============================================
// MEDIA ENDPOINTS
// ============================================

export const mediaAPI = {
  /**
   * Upload media file
   * POST /media
   */
  uploadMedia: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();

    return fetch(`${API_BASE_URL}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type, let browser set it with boundary
      },
      body: formData,
    }).then(response => response.json());
  },

  /**
   * Stream media file
   * GET /media/{fileId}
   */
  getMediaStream: (fileId) => {
    const token = getAuthToken();
    return `${API_BASE_URL}/media/${fileId}?token=${token}`;
  },

  /**
   * Delete media file
   * DELETE /media/{fileId}
   */
  deleteMedia: async (fileId) => {
    return apiRequest(`/media/${fileId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Set authentication token in cookie
 */
export const setAuthToken = (token) => {
  document.cookie = `token=${token}; path=/; max-age=604800`; // 7 days
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  document.cookie = 'token=; path=/; max-age=0';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Default export with all APIs
export default {
  auth: authAPI,
  users: usersAPI,
  categories: categoriesAPI,
  courses: coursesAPI,
  sections: sectionsAPI,
  lessons: lessonsAPI,
  enrollments: enrollmentsAPI,
  reviews: reviewsAPI,
  certificates: certificatesAPI,
  earnings: earningsAPI,
  media: mediaAPI,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
};
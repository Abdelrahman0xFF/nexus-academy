/**
 * Nexus Academy API Hooks
 * React hooks for easy integration with the API
 */

import { useState, useEffect, useCallback } from 'react';
import api from '../components/api/nexus-academy-api';

// ============================================
// AUTH HOOKS
// ============================================

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.auth.getCurrentUser();
      setUser(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await api.auth.login(credentials);
      api.setAuthToken(response.data.token);
      await fetchCurrentUser();
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      const response = await api.auth.register(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    api.removeAuthToken();
    setUser(null);
  }, []);

  useEffect(() => {
    if (api.isAuthenticated()) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    refetch: fetchCurrentUser,
  };
};

// ============================================
// COURSES HOOKS
// ============================================

export const useCourses = (params = {}) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.courses.getAllCourses(params);
      setCourses(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, error, refetch: fetchCourses };
};

export const useCourse = (courseId) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await api.courses.getCourseById(courseId);
      setCourse(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return { course, loading, error, refetch: fetchCourse };
};

export const useCourseContent = (courseId) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await api.courses.getCourseContent(courseId);
      setContent(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
};

// ============================================
// CATEGORIES HOOKS
// ============================================

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.categories.getAllCategories();
      setCategories(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

// ============================================
// ENROLLMENTS HOOKS
// ============================================

export const useMyEnrollments = (params = {}) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.enrollments.getMyEnrollments(params);
      setEnrollments(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enrollInCourse = useCallback(async (courseId, paymentMethod) => {
    try {
      const response = await api.enrollments.enrollInCourse({
        course_id: courseId,
        payment_method: paymentMethod,
      });
      await fetchEnrollments();
      return response;
    } catch (err) {
      throw err;
    }
  }, [fetchEnrollments]);

  return { 
    enrollments, 
    loading, 
    error, 
    refetch: fetchEnrollments,
    enrollInCourse,
  };
};

export const useEnrollmentProgress = (courseId) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await api.enrollments.getEnrollmentProgress(courseId);
      setProgress(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, loading, error, refetch: fetchProgress };
};

// ============================================
// REVIEWS HOOKS
// ============================================

export const useCourseReviews = (courseId, params = {}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const data = await api.courses.getCourseReviews(courseId, params);
      setReviews(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId, JSON.stringify(params)]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
};

// ============================================
// CERTIFICATES HOOKS
// ============================================

export const useMyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCertificates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.certificates.getMyCertificates();
      setCertificates(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, refetch: fetchCertificates };
};

// ============================================
// EARNINGS HOOKS (Instructor)
// ============================================

export const useEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.earnings.getEarnings();
      setEarnings(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  return { earnings, loading, error, refetch: fetchEarnings };
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.earnings.getAnalytics();
      setAnalytics(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

// ============================================
// GENERIC API HOOK
// ============================================

export const useAPI = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      const response = await apiFunction(...args);
      setData(response.data);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return { data, loading, error, execute };
};
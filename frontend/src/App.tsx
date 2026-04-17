import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentProgress from "./pages/student/StudentProgress";
import StudentCertificates from "./pages/student/StudentCertificates";
import StudentSettings from "./pages/student/StudentSettings";
import LessonPlayer from "./pages/student/LessonPlayer";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import UploadCourse from "./pages/instructor/UploadCourse";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import InstructorRevenue from "./pages/instructor/InstructorRevenue";
import InstructorSettings from "./pages/instructor/InstructorSettings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminReviews from "./pages/admin/AdminReviews";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import HelpCenter from "./pages/HelpCenter";
import ScrollToTopOnNavigation from "./components/ScrollToTopOnNavigation";
import PageTransition from "./components/PageTransition";
import MainLayout from "./layouts/MainLayout";
import VerifyOTP from "./pages/VerifyOTP";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTopOnNavigation />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="/signup"
            element={
              <PageTransition>
                <Signup />
              </PageTransition>
            }
          />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route
            path="/help"
            element={
              <MainLayout>
                <HelpCenter />
              </MainLayout>
            }
          />
          {/* Student Dashboard */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard/courses" element={<StudentCourses />} />
          <Route path="/dashboard/progress" element={<StudentProgress />} />
          <Route
            path="/dashboard/certificates"
            element={<StudentCertificates />}
          />
          <Route path="/dashboard/settings" element={<StudentSettings />} />
          <Route
            path="/learn/:id"
            element={
              <PageTransition>
                <LessonPlayer />
              </PageTransition>
            }
          />
          {/* Instructor Dashboard */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorCourses />} />
          <Route path="/instructor/upload" element={<UploadCourse />} />
          <Route
            path="/instructor/analytics"
            element={<InstructorAnalytics />}
          />
          <Route path="/instructor/students" element={<InstructorStudents />} />
          <Route path="/instructor/revenue" element={<InstructorRevenue />} />
          <Route path="/instructor/settings" element={<InstructorSettings />} />
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

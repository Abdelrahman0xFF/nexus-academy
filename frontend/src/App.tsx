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
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import UploadCourse from "./pages/instructor/UploadCourse";
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import InstructorRevenue from "./pages/instructor/InstructorRevenue";
import InstructorSettings from "./pages/instructor/InstructorSettings";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ScrollToTopOnNavigation from "./components/ScrollToTopOnNavigation";

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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          {/* Student Dashboard */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard/courses" element={<StudentCourses />} />
          <Route path="/dashboard/progress" element={<StudentProgress />} />
          <Route path="/dashboard/certificates" element={<StudentCertificates />} />
          <Route path="/dashboard/settings" element={<StudentSettings />} />
          {/* Instructor Dashboard */}
          <Route path="/instructor" element={<InstructorDashboard />} />
          <Route path="/instructor/courses" element={<InstructorCourses />} />
          <Route path="/instructor/upload" element={<UploadCourse />} />
          <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
          <Route path="/instructor/students" element={<InstructorStudents />} />
          <Route path="/instructor/revenue" element={<InstructorRevenue />} />
          <Route path="/instructor/settings" element={<InstructorSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

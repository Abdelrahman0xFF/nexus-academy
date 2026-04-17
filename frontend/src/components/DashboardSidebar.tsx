import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Award,
  Settings,
  LogOut,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Upload,
  Users,
  DollarSign,
  MessageSquare,
} from "lucide-react";

interface DashboardSidebarProps {
  type: "student" | "instructor" | "admin";
}

const studentLinks = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", path: "/dashboard/courses", icon: BookOpen },
  { label: "Progress", path: "/dashboard/progress", icon: Trophy },
  { label: "Certificates", path: "/dashboard/certificates", icon: Award },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const instructorLinks = [
  { label: "Overview", path: "/instructor", icon: LayoutDashboard },
  { label: "My Courses", path: "/instructor/courses", icon: BookOpen },
  { label: "Upload Course", path: "/instructor/upload", icon: Upload },
  { label: "Analytics", path: "/instructor/analytics", icon: BarChart3 },
  { label: "Students", path: "/instructor/students", icon: Users },
  { label: "Revenue", path: "/instructor/revenue", icon: DollarSign },
  { label: "Settings", path: "/instructor/settings", icon: Settings },
];

const adminLinks = [
  { label: "Overview", path: "/admin", icon: LayoutDashboard },
  { label: "Courses", path: "/admin/courses", icon: BookOpen },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Categories", path: "/admin/categories", icon: LayoutDashboard },
  { label: "Payments", path: "/admin/payments", icon: DollarSign },
  { label: "Reviews", path: "/admin/reviews", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const DashboardSidebar = ({ type }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  let links = studentLinks;
  if (type === "instructor") links = instructorLinks;
  if (type === "admin") links = adminLinks;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300 h-screen sticky top-0 overflow-hidden ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap size={16} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">
              Nexus<span className="text-primary">Academy</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-small font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? link.label : undefined}
            >
              <link.icon size={20} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <button
          className={`flex items-center gap-3 px-3 py-2.5 rounded-button text-small font-medium text-[#F24848] hover:text-destructive hover:bg-destructive/10 transition-colors w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span> Log Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

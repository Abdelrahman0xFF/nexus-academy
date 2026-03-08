import { ReactNode } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ScrollToTop from "@/components/ScrollToTop";

interface DashboardLayoutProps {
  children: ReactNode;
  type: "student" | "instructor";
}

const DashboardLayout = ({ children, type }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar type={type} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        <ScrollToTop />
      </main>
    </div>
  );
};

export default DashboardLayout;

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const location = useLocation();

  return (
    <div
      key={location.key}
      className={`animate-fade-in w-full overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Courses", path: "/courses" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Teach", path: "/instructor" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap size={20} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:block">
              Nexus<span className="text-primary">Academy</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-small font-medium rounded-button transition-colors ${
                  location.pathname === link.path
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth - Desktop */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-small rounded-button">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-small rounded-button gradient-primary border-0 text-primary-foreground hover:opacity-90 transition-opacity">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-muted-foreground">
              <Search size={20} />
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-muted-foreground">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-3 animate-fade-in">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 text-small font-medium rounded-button transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 mt-2 px-4">
                <Link to="/login" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full rounded-button">Log In</Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button size="sm" className="w-full rounded-button gradient-primary border-0 text-primary-foreground">Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

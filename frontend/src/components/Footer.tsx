import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap size={18} className="text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">Nexus<span className="text-primary">Academy</span></span>
            </Link>
            <p className="text-small text-muted-foreground leading-relaxed">
              Empowering learners worldwide with world-class education and cutting-edge courses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-small text-muted-foreground">
              <li><Link to="/courses" className="hover:text-primary transition-colors">Browse Courses</Link></li>
              <li><Link to="/instructor" className="hover:text-primary transition-colors">Become an Instructor</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-small text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Webinars</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-small text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 text-center text-small text-muted-foreground">
          © {new Date().getFullYear()} NexusAcademy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

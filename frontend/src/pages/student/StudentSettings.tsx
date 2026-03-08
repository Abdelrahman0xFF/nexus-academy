import { Save, Camera, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";

const StudentSettings = () => {
  return (
    <DashboardLayout type="student">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-5">Profile</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center relative">
              <span className="text-xl font-bold text-primary-foreground">AJ</span>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                <Camera size={14} className="text-muted-foreground" />
              </button>
            </div>
            <div>
              <div className="text-body font-semibold text-foreground">Alex Johnson</div>
              <div className="text-small text-muted-foreground">Student</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">First Name</label>
                <input type="text" defaultValue="Alex" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">Last Name</label>
                <input type="text" defaultValue="Johnson" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Email</label>
              <input type="email" defaultValue="alex@example.com" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-card card-shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={20} className="text-primary" />
            <h2 className="text-h3 text-card-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 text-small bg-muted rounded-button border-0 outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-card card-shadow p-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell size={20} className="text-primary" />
            <h2 className="text-h3 text-card-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Course updates", description: "When courses you're enrolled in are updated", checked: true },
              { label: "Progress reminders", description: "Daily reminders to continue learning", checked: true },
              { label: "New course recommendations", description: "Personalized course suggestions", checked: false },
              { label: "Promotional emails", description: "Sales and special offers", checked: false },
            ].map((n) => (
              <label key={n.label} className="flex items-center justify-between py-2 cursor-pointer">
                <div>
                  <div className="text-small font-medium text-foreground">{n.label}</div>
                  <div className="text-xs text-muted-foreground">{n.description}</div>
                </div>
                <input type="checkbox" defaultChecked={n.checked} className="w-5 h-5 rounded accent-[hsl(var(--primary))]" />
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="gradient-primary border-0 text-primary-foreground rounded-button hover:opacity-90 px-8">
            <Save size={16} className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;

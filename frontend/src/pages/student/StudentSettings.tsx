import { Save, Camera, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";

const StudentSettings = () => {
<<<<<<< Updated upstream
    return (
        <DashboardLayout type="student">
            <div className="mb-8">
                <h1 className="text-h1 text-foreground">Settings</h1>
                <p className="text-body text-muted-foreground mt-1">
                    Manage your account and preferences
                </p>
=======
  const [formData, setFormData] = useState({
    firstName: "Mazen",
    lastName: "Fawzy",
    email: "mazen@example.com",
    avatar: "",
    title: "Retired Student",
    bio: "Full-stack developer with 1+ years of experience building scalable web applications.",
  });

  const [displayedProfile, setDisplayedProfile] = useState({ ...formData });

  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const passwordCriteria = {
    length: passwords.new.length >= 6,
    hasUpper: /[A-Z]/.test(passwords.new),
    hasLower: /[a-z]/.test(passwords.new),
    hasNumber: /[0-9]/.test(passwords.new),
    hasSymbol: /[@%*]/.test(passwords.new),
    match: passwords.new === passwords.confirm && passwords.new !== "",
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const canSave = passwords.new === "" ? true : isPasswordValid;

  const handleSave = () => {
    setDisplayedProfile({ ...formData });
    setPasswords({ old: "", new: "", confirm: "" });
  };

  return (
    <DashboardLayout type="student">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-8 flex items-center gap-2">
              Personal Information
              <User size={20} className="text-muted-foreground" />
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gradient-to-br from-[#2D7A85] to-[#5BA4AD]">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold tracking-tighter">
                      {formData.firstName[0]}
                      {formData.lastName[0]}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-1 right-1 p-2 bg-white text-slate-500 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <Camera size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-small font-medium text-foreground block mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-small font-medium text-foreground block mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                  <div className="w-full">
                    <label className="text-small font-medium text-foreground block mb-1.5 flex items-center gap-2">
                      <Briefcase size={14} className="text-primary" />{" "}
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-small font-medium text-foreground block mb-1.5 flex items-center gap-2">
                    <Mail size={14} className="text-primary" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none bg-muted/30 cursor-not-allowed opacity-70"
                  />
                </div>
              </div>
>>>>>>> Stashed changes
            </div>

<<<<<<< Updated upstream
            <div className="max-w-3xl space-y-6">
                {/* Profile */}
                <div className="bg-card rounded-card card-shadow p-6">
                    <h2 className="text-h3 text-card-foreground mb-5">
                        Profile
                    </h2>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center relative">
                            <span className="text-xl font-bold text-primary-foreground">
                                AJ
                            </span>
                            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                                <Camera
                                    size={14}
                                    className="text-muted-foreground"
                                />
                            </button>
                        </div>
                        <div>
                            <div className="text-body font-semibold text-foreground">
                                Alex Johnson
                            </div>
                            <div className="text-small text-muted-foreground">
                                Student
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-small font-medium text-foreground block mb-1.5">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Alex"
                                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20 resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-small font-medium text-foreground block mb-1.5">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Johnson"
                                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-small font-medium text-foreground block mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                defaultValue="alex@example.com"
                                className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
=======
          <div className="bg-card rounded-card card-shadow p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield size={20} className="text-primary" />
              <h2 className="text-h3 text-card-foreground">
                Security & Password
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.old}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
>>>>>>> Stashed changes
                </div>

                {/* Security */}
                <div className="bg-card rounded-card card-shadow p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Shield size={20} className="text-primary" />
                        <h2 className="text-h3 text-card-foreground">
                            Security
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-small font-medium text-foreground block mb-1.5">
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-small font-medium text-foreground block mb-1.5">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="text-small font-medium text-foreground block mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card rounded-card card-shadow p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Bell size={20} className="text-primary" />
                        <h2 className="text-h3 text-card-foreground">
                            Notifications
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                label: "Course updates",
                                description:
                                    "When courses you're enrolled in are updated",
                                checked: true,
                            },
                            {
                                label: "Progress reminders",
                                description:
                                    "Daily reminders to continue learning",
                                checked: true,
                            },
                            {
                                label: "New course recommendations",
                                description: "Personalized course suggestions",
                                checked: false,
                            },
                            {
                                label: "Promotional emails",
                                description: "Sales and special offers",
                                checked: false,
                            },
                        ].map((n) => (
                            <label
                                key={n.label}
                                className="flex items-center justify-between py-2 cursor-pointer"
                            >
                                <div>
                                    <div className="text-small font-medium text-foreground">
                                        {n.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {n.description}
                                    </div>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked={n.checked}
                                    className="w-5 h-5 rounded accent-[hsl(var(--primary))]"
                                />
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

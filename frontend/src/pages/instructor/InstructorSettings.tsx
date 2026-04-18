import { Save, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";
import { AppSelect } from "@/components/ui/app-select";

const InstructorSettings = () => {
<<<<<<< Updated upstream
=======
  const [formData, setFormData] = useState({
    firstName: "Mohamed",
    lastName: "Ehab",
    email: "ehab@nexusacademy.com",
    bio: "Senior Full-Stack Developer with 5- years of experience building scalable web applications.",
    title: "Senior Full-Stack Developer",
    website: "https://mohamedehab.dev",
    avatar: "",
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

>>>>>>> Stashed changes
  return (
    <DashboardLayout type="instructor">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground mt-1">Manage your instructor profile and preferences</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile */}
        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-5">Profile Information</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center relative">
              <span className="text-xl font-bold text-primary-foreground">SJ</span>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors">
                <Camera size={14} className="text-muted-foreground" />
              </button>
            </div>
            <div>
              <div className="text-body font-semibold text-foreground">Sarah Johnson</div>
              <div className="text-small text-muted-foreground">Senior Full-Stack Developer</div>
            </div>
          </div>
<<<<<<< Updated upstream
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
=======

          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-6 flex items-center gap-2">
              <Shield size={20} className="text-primary" /> Security & Password
            </h2>
            <div className="space-y-4">
>>>>>>> Stashed changes
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">First Name</label>
                <input type="text" defaultValue="Sarah"                   className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">Last Name</label>
                <input type="text" defaultValue="Johnson" className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Email</label>
              <input type="email" defaultValue="sarah@nexusacademy.com" className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Bio</label>
              <textarea
                rows={3}
                defaultValue="Senior Full-Stack Developer with 10+ years of experience building scalable web applications."
                className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Website</label>
              <input type="url" defaultValue="https://sarahjohnson.dev" className="w-full px-4 py-2.5 text-small border border-border outline-none rounded-button focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </div>

        {/* Payout */}
        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-5">Payout Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Payout Method</label>
              <AppSelect
                options={["Bank Transfer (ACH)", "PayPal", "Stripe"]}
                defaultValue="Bank Transfer (ACH)"
                triggerClassName="px-4 py-2.5"
              />
            </div>
            <div>
              <label className="text-small font-medium text-foreground block mb-1.5">Payout Schedule</label>
              <AppSelect
                options={["Monthly (1st of each month)", "Bi-weekly", "Weekly"]}
                defaultValue="Monthly (1st of each month)"
                triggerClassName="px-4 py-2.5"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-card card-shadow p-6">
          <h2 className="text-h3 text-card-foreground mb-5">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: "New enrollment alerts", description: "Get notified when a student enrolls", checked: true },
              { label: "Review notifications", description: "Get notified when you receive a review", checked: true },
              { label: "Payout notifications", description: "Get notified when a payout is processed", checked: true },
              { label: "Marketing emails", description: "Receive tips and platform updates", checked: false },
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

export default InstructorSettings;

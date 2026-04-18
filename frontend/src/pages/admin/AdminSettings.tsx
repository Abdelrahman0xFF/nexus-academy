import { Save, Shield, Bell, Globe, Mail, Lock, Database } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const AdminSettings = () => {
<<<<<<< Updated upstream
=======
  const [formData, setFormData] = useState({
    firstName: "Zeyad",
    lastName: "Mostafa",
    nickname: "El ZooZ",
    email: "zeyad.mostafa@nexusacademy.com",
    // bio: "Full-stack developer and platform administrator.",
    bio: "Tager rozBlabn ad eldonya.",
    title: "Chief Administrator",
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

  const handleSave = () => {
    setDisplayedProfile({ ...formData });
    setPasswords({ old: "", new: "", confirm: "" });
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

>>>>>>> Stashed changes
  return (
    <DashboardLayout type="admin">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Platform Settings</h1>
        <p className="text-body text-muted-foreground mt-1">Configure global platform behavior and security</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-6 flex items-center gap-2">
                <Globe size={20} className="text-primary" /> General Configuration
            </h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-small font-medium text-foreground block mb-1.5">Site Name</label>
                    <input 
                        type="text" 
                        defaultValue="NexusAcademy" 
                        className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
                <div>
                    <label className="text-small font-medium text-foreground block mb-1.5">Support Email</label>
                    <input 
                        type="email" 
                        defaultValue="support@nexusacademy.com" 
                        className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
              </div>
              <div>
                    <label className="text-small font-medium text-foreground block mb-1.5">Currency</label>
                    <select className="w-full px-4 py-2.5 text-small border border-border rounded-button bg-card outline-none focus:ring-2 focus:ring-primary/20">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                    </select>
                </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-6 flex items-center gap-2">
                <Shield size={20} className="text-primary" /> Security & Access
            </h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-small font-medium text-foreground">Self-Registration</div>
                        <div className="text-xs text-muted-foreground">Allow new users to create accounts</div>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-small font-medium text-foreground">Email Verification</div>
                        <div className="text-xs text-muted-foreground">Require email confirmation for new users</div>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-small font-medium text-foreground">Instructor Approval</div>
                        <div className="text-xs text-muted-foreground">Manually approve instructor applications</div>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-small font-medium text-foreground">Maintenance Mode</div>
                        <div className="text-xs text-muted-foreground">Disable frontend access for all users except admins</div>
                    </div>
                    <Switch />
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-card rounded-card card-shadow p-6">
                <h3 className="text-body font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Database size={18} /> System Status
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-medium">1.2.0-stable</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Last Backup</span>
                        <span className="font-medium">2 hours ago</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Storage Usage</span>
                        <span className="font-medium text-amber-600">82% (41.2 GB)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">API Status</span>
                        <span className="text-emerald-500 font-bold uppercase tracking-tighter">Healthy</span>
                    </div>
                </div>
            </div>

            <Button className="w-full gradient-primary border-0 text-primary-foreground font-bold rounded-button">
                <Save size={16} className="mr-2" /> Save Changes
            </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;

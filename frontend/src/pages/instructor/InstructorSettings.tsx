import {
  Save,
  Camera,
  Mail,
  Briefcase,
  CheckCircle2,
  XCircle,
  Shield,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { authApi, InstructorSettingsForm } from "@/lib/auth-api";
import { toast } from "sonner";
import { getMediaUrl } from "@/lib/utils";

const InstructorSettings = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<InstructorSettingsForm>({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    title: "",
    website: "",
    avatar: null,
    avatarPreview: "",
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        bio: user.bio || "",
        title: user.title || "",
        avatarPreview: user.avatar_url ? getMediaUrl(user.avatar_url) : "",
      }));
    }
  }, [user]);

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
      setFormData({ ...formData, avatar: file, avatarPreview: URL.createObjectURL(file) });
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

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profileData = new FormData();
      profileData.append("first_name", formData.firstName);
      profileData.append("last_name", formData.lastName);
      profileData.append("bio", formData.bio);
      profileData.append("title", formData.title);
      if (formData.avatar) {
        profileData.append("avatar", formData.avatar);
      }

      await authApi.updateProfile(user.id, profileData);

      if (passwords.new) {
        await authApi.changePassword({
          old_password: passwords.old,
          new_password: passwords.new,
          confirm_password: passwords.confirm,
        });
      }

      await refreshUser();
      toast.success("Settings updated successfully");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="instructor">
      <div className="mb-8">
        <h1 className="text-h1 text-foreground">Settings</h1>
        <p className="text-body text-muted-foreground mt-1">
          Manage your instructor profile and preferences
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-8 flex items-center gap-2">
              Personal Information
              <UserIcon size={20} className="text-muted-foreground" />
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-sm flex items-center justify-center bg-gradient-to-br from-[#2D7A85] to-[#5BA4AD]">
                  {formData.avatarPreview ? (
                    <img
                      src={formData.avatarPreview}
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
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background h-28 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-card card-shadow p-6">
            <h2 className="text-h3 text-card-foreground mb-6 flex items-center gap-2">
              <Shield size={20} className="text-primary" /> Security & Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-small font-medium text-foreground block mb-1.5">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.old}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old: e.target.value })
                  }
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
                    placeholder="Enter new password"
                    value={passwords.new}
                    onChange={(e) =>
                      setPasswords({ ...passwords, new: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
                </div>
                <div>
                  <label className="text-small font-medium text-foreground block mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwords.confirm}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirm: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-small border border-border rounded-button outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/20 rounded-xl grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "6+ Characters", met: passwordCriteria.length },
                  { label: "Capital Letter", met: passwordCriteria.hasUpper },
                  { label: "Small Letter", met: passwordCriteria.hasLower },
                  { label: "Number", met: passwordCriteria.hasNumber },
                  {
                    label: "Symbol (@, %, *)",
                    met: passwordCriteria.hasSymbol,
                  },
                  { label: "Match Passwords", met: passwordCriteria.match },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-[11px]"
                  >
                    {item.met ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <XCircle size={14} className="text-muted-foreground/30" />
                    )}
                    <span
                      className={
                        item.met
                          ? "text-emerald-600 font-bold"
                          : "text-muted-foreground"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-card card-shadow p-6 text-center border-b-4 border-primary overflow-hidden relative">
            <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-gradient-to-br from-[#2D7A85] to-[#5BA4AD]">
              {formData.avatarPreview ? (
                <img
                  src={formData.avatarPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold tracking-tighter">
                  {formData.firstName[0]}
                  {formData.lastName[0]}
                </span>
              )}
            </div>

            <h3 className="text-h3 font-black text-foreground truncate">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-xs font-medium text-muted-foreground mb-4 px-2 line-clamp-1">
              {formData.title}
            </p>

            <div className="py-2.5 px-4 bg-muted/40 rounded-xl flex items-center justify-center gap-2 text-[11px] text-muted-foreground border border-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="font-medium truncate">
                {formData.email}
              </span>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!canSave || loading}
            className="w-full gradient-primary border-0 text-primary-foreground font-black rounded-button shadow-xl py-6 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={20} className="mr-2" />} Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InstructorSettings;


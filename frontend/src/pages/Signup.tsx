import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  GraduationCap,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const passwordCriteria = {
    length: form.password.length >= 6,
    hasUpper: /[A-Z]/.test(form.password),
    hasLower: /[a-z]/.test(form.password),
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    match: form.password === form.confirm && form.password !== "",
  };

  const isPasswordValid =
    passwordCriteria.length &&
    passwordCriteria.hasUpper &&
    passwordCriteria.hasLower &&
    passwordCriteria.hasSymbol;

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email address";

    if (!isPasswordValid) newErrors.password = "Password requirements not met";
    if (form.password !== form.confirm)
      newErrors.confirm = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: "Registration Failed",
        description: "Please check the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Account created successfully!",
      description: "Redirecting to email verification...",
    });

    setTimeout(() => {
      navigate("/verify-otp");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center transition-transform group-hover:scale-110">
              <GraduationCap size={22} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Nexus<span className="text-primary">Academy</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create your account
          </h1>
          <p className="text-muted-foreground mt-1">
            Start your learning journey today
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Alex"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                className={
                  errors.firstName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.firstName && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Johnson"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className={
                  errors.lastName
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
              />
              {errors.lastName && (
                <p className="text-[10px] text-destructive font-medium">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={
                errors.email
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            {errors.email && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={
                  errors.password ? "border-destructive pr-10" : "pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="confirm your password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className={errors.confirm ? "border-destructive" : ""}
            />
            {errors.confirm && (
              <p className="text-[10px] text-destructive font-medium">
                {errors.confirm}
              </p>
            )}
          </div>

          <div className="p-3 bg-muted/20 rounded-lg space-y-2 border border-border/50">
            <div className="flex items-center gap-2 text-[11px]">
              {passwordCriteria.length ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <XCircle size={14} className="text-muted-foreground/30" />
              )}
              <span
                className={
                  passwordCriteria.length
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                }
              >
                6+ Characters
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {passwordCriteria.hasUpper && passwordCriteria.hasLower ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <XCircle size={14} className="text-muted-foreground/30" />
              )}
              <span
                className={
                  passwordCriteria.hasUpper && passwordCriteria.hasLower
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                }
              >
                Capital & Small letters
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {passwordCriteria.hasSymbol ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <XCircle size={14} className="text-muted-foreground/30" />
              )}
              <span
                className={
                  passwordCriteria.hasSymbol
                    ? "text-emerald-600 font-medium"
                    : "text-muted-foreground"
                }
              >
                Symbols (! @ # $ % ^ & *)
              </span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isPasswordValid || !form.confirm}
            className="w-full gradient-primary border-0 text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-bold hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

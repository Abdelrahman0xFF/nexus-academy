import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const VerifyOTP = () => {
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the full 6-digit code sent to your email.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Email Verified",
      description: "You can now proceed to login.",
    });
  };

  const handleResend = () => {
    setTimeLeft(120);
    setIsTimerActive(true);
    toast({
      title: "OTP Sent",
      description: "A new code has been sent to your email.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-small font-medium">Back to Sign Up</span>
          </Link>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck size={32} className="text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground">
            Verify your Email
          </h1>
          <p className="text-muted-foreground mt-2 px-6">
            We've sent a 6-digit verification code to your email address.
          </p>
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleVerify}
          className="space-y-6 bg-card border border-border rounded-xl p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-[0.5em] font-bold h-14 border-2 focus-visible:ring-primary/20"
              />
            </div>

            {/* Timer & Resend Section */}
            <div className="text-center">
              {isTimerActive ? (
                <div className="text-small text-muted-foreground">
                  Resend code in{" "}
                  <span className="text-primary font-mono font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-small font-bold text-primary hover:underline transition-all animate-in fade-in slide-in-from-top-1"
                >
                  Didn't receive a code? Sent OTP Again
                </button>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary border-0 text-primary-foreground font-bold h-12 shadow-md hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Verify Account
          </Button>
        </form>

        {/* Footer info */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
            <GraduationCap size={14} />
            <span>Secure Verification by Nexus Academy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

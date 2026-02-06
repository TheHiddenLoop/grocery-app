import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "../hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { loginAdmin } from "../features/auth/authSlice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
        dispatch (loginAdmin(formData));
        await new Promise((resolve) => setTimeout(resolve, 1500));
      // Navigate to admin dashboard
      navigate("/admin");
    } catch (error) {
      toast({
        title: "Access Denied",
        description: error.message || "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background-secondary to-background p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Security Notice */}
        <div className="mb-4 p-3 rounded-lg bg-warning-bg border border-warning flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-warning-foreground">Restricted Access</p>
            <p className="text-xs text-warning-foreground/80 mt-1">
              This is a secure admin area. Unauthorized access attempts are logged.
            </p>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-border shadow-2xl">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4 relative">
              <Shield className="w-8 h-8 text-primary-foreground" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card"></div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Secure access to dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-10 ${errors.email ? "border-error" : ""}`}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? "border-error" : ""}`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Sign In to Dashboard
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">Secure Connection</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your session is encrypted and protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
import RightAuthPanel from "../components/RightAuthPanel"
import { Lock, Mail } from "lucide-react"
import InputField from "../components/Input"
import { useState } from "react"
import Button from "../components/Button"
import { Link } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        <div className="flex items-center justify-center px-6">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">

            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>

              <h1 className="text-xl font-semibold text-text-primary">
                Welcome Back
              </h1>

              <p className="text-sm text-text-secondary text-center">
                Login to continue to your account
              </p>
            </div>

            <div className="my-1">
              <div className="flex flex-col gap-2">
                <label className="text-text-primary font-medium text-xs">
                  Email Address
                </label>
                <InputField
                  row
                  placeholder="Enter your email"
                  icon={Mail}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-text-primary font-medium text-xs">
                  Password
                </label>
                <InputField
                  placeholder="Enter your password"
                  icon={Lock}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                />
              </div>
            </div>

            <p className="text-sm text-text-secondary flex justify-end gap-1">
              Don’t have an account?
              <Link to="/signin" className="text-primary hover:underline cursor-pointer">
                Sign In
              </Link>
            </p>

            <Button
              text="Login"
              className="w-full bg-primary text-text-primary hover:bg-secondary"
            />
          </form>
        </div>

        <div className="bg-bg-secondary hidden lg:flex items-center justify-center">
          <RightAuthPanel
            title="Welcome Back 👋"
            subtitle="Login to your account"
            description="Access your dashboard, manage your profile, and continue where you left off."
          />
        </div>

      </div>
    </div>
  );
}

export default Login;

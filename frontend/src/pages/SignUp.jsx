import { Link } from "react-router";
import RightAuthPanel from "../components/RightAuthPanel"
import { Lock, Mail, User, UserPlus } from "lucide-react"
import InputField from "../components/Input"
import { useState } from "react"
import Button from "../components/Button"
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../features/auth/authSlice"
import { selectAuthStatus } from "../features/auth/authSelector"

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const loading = useSelector(selectAuthStatus);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.name) return;
    try {
      await dispatch(signup(formData)).unwrap();
      setFormData({ name: "", email: "", password: "" });
      setTimeout(()=>{
          navigate("/");
        }, 1000);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">

        <div className="flex items-center justify-center px-6">
          <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">

            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="w-14 h-14 rounded-xl bg-bg-secondary flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>

              <h1 className="text-xl font-semibold text-text-primary">
                Create Account
              </h1>

              <p className="text-sm text-text-secondary text-center">
                Sign up to get started with your account
              </p>
            </div>

            <div className="my-1">
              <div className="flex flex-col gap-2">
                <label className="text-text-primary font-medium text-xs">
                  Full Name
                </label>
                <InputField
                  row
                  placeholder="Enter your full name"
                  icon={User}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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
              Already have an account?
              <Link to="/login" className="text-primary hover:underline cursor-pointer">
                Login
              </Link>
            </p>

            <Button
              text="Sign up"
              className="w-full bg-primary text-text-primary hover:bg-secondary"
            />
          </form>
        </div>

        <div className="bg-bg-secondary hidden lg:flex items-center justify-center">
          <RightAuthPanel
            title="Join Us 👋"
            subtitle="Create your account"
            description="Sign up to get access to your dashboard, manage your profile, and start your journey with us."
          />
        </div>

      </div>
    </div>
  );
}

export default Signup;

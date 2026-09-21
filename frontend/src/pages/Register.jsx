import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Lock, Mail, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";
import AnnotationMarker from "../components/AnnotationMarker.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/user/register`, data, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        toast.error("Registration failed! Username or Email might be taken.");
        return;
      }

      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas blueprint-grid px-4 relative py-12">
      <div className="w-full max-w-md bg-surface border-2 border-ink p-8 shadow-[4px_4px_0_0_#17181A] relative my-auto">
        <AnnotationMarker top left />
        <AnnotationMarker top right />
        <AnnotationMarker bottom left />
        <AnnotationMarker bottom right />

        <div className="text-center mb-8 relative z-10">
          <div className="size-12 bg-canvas border-2 border-ink flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0_0_#17181A]">
            <UserPlus className="size-6 text-ink" />
          </div>
          <h2 className="text-3xl font-bold font-mono text-ink mb-2 tracking-tight uppercase">
            Create Account
          </h2>
          <p className="text-ink/60 text-sm font-mono uppercase">
            Join the platform
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-ink uppercase">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink/50">
                <User className="size-4" />
              </span>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("username", { required: "Username is required" })}
              />
            </div>
            {errors.username && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-ink uppercase">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink/50">
                <Mail className="size-4" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-ink uppercase">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink/50">
                <Lock className="size-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className="w-full pl-10 pr-10 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/50 hover:text-ink cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-ink uppercase">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink/50">
                <Lock className="size-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-canvas hover:bg-ink/90 py-3.5 font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent"
          >
            {loading ? "Registering..." : "Register"}
            {!loading && <ArrowRight className="size-4" />}
          </button>

          <p className="text-center text-xs text-ink/60 font-mono mt-2 uppercase">
            Already have an account?{" "}
            <Link to="/login" className="text-ink font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
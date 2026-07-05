import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Lock, Mail, Eye, EyeOff, UserPlus, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 size-96 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 size-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className="size-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <UserPlus className="size-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-400 text-sm font-normal">
            Join the platform and start coding!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <User className="size-4" />
              </span>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                {...register("username", { required: "Username is required" })}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-xs font-semibold mt-0.5">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Mail className="size-4" />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Lock className="size-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 cursor-target"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs font-semibold mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                <Lock className="size-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs font-semibold mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-target text-base mt-2"
          >
            {loading ? "Registering..." : "Register"}
            {!loading && <ArrowRight className="size-4" />}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400 font-normal mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
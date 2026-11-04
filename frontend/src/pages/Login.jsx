import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/User.jsx";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { User, Lock, Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import AnnotationMarker from "../components/AnnotationMarker.jsx";

const REMEMBER_ME_KEY = "rememberedUsername";

const Login = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // On mount, pre-fill username if the user had checked "Remember me" before
  useEffect(() => {
    const savedUsername = localStorage.getItem(REMEMBER_ME_KEY);
    if (savedUsername) {
      setValue("username", savedUsername);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/user/login`, data, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        toast.error("Login failed! Invalid credentials.");
        return;
      }

      // Save or clear the remembered username based on the checkbox
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, data.username);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      const userInfo = {
        _id: response.data._id,
        username: response.data.username,
        fullName: response.data.fullName,
        email: response.data.email,
        profilePhoto: response.data.profilePhoto,
        affiliation: response.data.affiliation,
      };

      setUserData(userInfo);
      localStorage.setItem("userData", JSON.stringify(userInfo));
      toast.success("Welcome back, " + userInfo.username + "!");
      navigate("/");
    } catch (err) {
      toast.error("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas blueprint-grid px-4 relative">
      <div className="w-full max-w-md bg-surface border-2 border-ink p-8 shadow-[4px_4px_0_0_#17181A] relative">
        <AnnotationMarker top left />
        <AnnotationMarker top right />
        <AnnotationMarker bottom left />
        <AnnotationMarker bottom right />

        <div className="text-center mb-8 relative z-10">
          <div className="size-12 bg-canvas border-2 border-ink flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0_0_#17181A]">
            <LogIn className="size-6 text-ink" />
          </div>
          <h2 className="text-3xl font-bold font-mono text-ink mb-2 tracking-tight uppercase">
            Welcome Back
          </h2>
          <p className="text-ink/60 text-sm font-mono uppercase">
            Sign in to continue
          </p>
        </div>

        {/* autocomplete="on" triggers the browser's built-in "Save Password?" prompt */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 relative z-10" autoComplete="on">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-bold text-ink uppercase">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-ink/50">
                <User className="size-4" />
              </span>
              <input
                type="text"
                autoComplete="username"
                {...register("username", { required: "Username is required" })}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
              />
            </div>
            {errors.username && (
              <p className="text-red-600 text-xs font-mono font-bold mt-0.5">
                {errors.username.message}
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
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 bg-canvas border-2 border-ink/20 text-ink placeholder-ink/40 focus:outline-none focus:border-ink transition-colors font-mono text-sm"
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

          {/* Remember Me */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="checkbox"
              aria-checked={rememberMe}
              onClick={() => setRememberMe((prev) => !prev)}
              className={`w-4 h-4 border-2 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                rememberMe
                  ? "bg-ink border-ink"
                  : "bg-canvas border-ink/30 hover:border-ink"
              }`}
            >
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-canvas" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span
              className="text-xs font-mono text-ink/60 uppercase select-none cursor-pointer hover:text-ink transition-colors"
              onClick={() => setRememberMe((prev) => !prev)}
            >
              Remember my username
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-canvas hover:bg-ink/90 py-3.5 font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent"
          >
            {loading ? "Signing in..." : "Sign In"}
            {!loading && <ArrowRight className="size-4" />}
          </button>

          <p className="text-center text-xs text-ink/60 font-mono mt-2 uppercase">
            Don't have an account?{" "}
            <Link to="/register" className="text-ink font-bold hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

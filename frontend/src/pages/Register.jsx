import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/User.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();

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
      const response = await axios.post(`${apiUrl}/user/register`, data, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        // alert(response.data.message || "Registration failed!");
        toast.error("Registration failed!");
        navigate("/register");
        return;
      }

      // alert("Registration successful! Please log in.");
      toast.success("Registration successful! Please log in.")
      navigate("/login");
    } catch (err) {
      // console.error("Registration error:", err.message);
      // alert("An error occurred during registration. Please try again.");
      toast.error("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 box-animate animate-scale-in border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Join the platform and start coding!
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div className="animate-fade-in">
            <label className="font-medium">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full mt-1 p-3 border rounded-lg outline-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="animate-fade-in">
            <label className="font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mt-1 p-3 border rounded-lg outline-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="animate-fade-in">
            <label className="font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full mt-1 p-3 border rounded-lg outline-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="animate-fade-in">
            <label className="font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              className="w-full mt-1 p-3 border rounded-lg outline-blue-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold btn-animate"
          >
            Register
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 font-semibold hover:underline transition-colors duration-200"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
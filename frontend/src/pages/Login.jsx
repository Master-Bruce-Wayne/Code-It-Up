import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/User.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUserData } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.post(`${apiUrl}/user/login`, data, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        alert(response.data.message || "Login failed!");
        navigate("/login");
        return;
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
      alert("User logged in")
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-2">
          Sign In
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Welcome back! Please login to continue.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div>
            <label className="font-medium">Username</label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              placeholder="Enter your username"
              className="w-full mt-1 p-2 border rounded outline-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="font-medium">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter your password"
              className="w-full mt-1 p-2 border rounded outline-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition hover:cursor-pointer"
          >
            Sign In
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

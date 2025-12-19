import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/User.jsx";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const {setUserData} = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    try {
      const response = await axios.post(`${apiUrl}/user/register`, data, {
        withCredentials: true,
      });

      if (response.data.success === false) {
        alert(response.data.message || "Registration failed!");
        navigate("/register");
        return;
      }

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.message);
      alert("An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="">
      <div className="">
        <div className="">
          <form onSubmit={handleSubmit(onSubmit)} className="">

            {/* Username */}
            <div>
              <label className="">
                Username
              </label>
              <div className="">
                <input
                  type="text"
                  {...register("username", { required: "Username is required" })}
                  placeholder="Enter your username"
                  className=""
                />
              </div>
              {errors.username && (
                <p className="">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="">
                Password
              </label>
              <div className="">
                <input
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter your password"
                  className=""
                />
              </div>
              {errors.password && (
                <p className="">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="">
                Email
              </label>
              <div className="">
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className=""
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="">
                Confirm Password
              </label>
              <div className="">
                <input
                  type="password"
                  {...register("confirmPassword", { required: "Confirm your password" })}
                  className=""
                  placeholder="Re-enter password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className=""
            >
              Sign In
            </button>

            {/* Signup link */}
            <p className="">
              Don't have an account?{" "}
              <a 
                href="/register" 
                className=""
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
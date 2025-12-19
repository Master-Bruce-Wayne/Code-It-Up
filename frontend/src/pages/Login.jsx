import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/User.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const {userData, setUserData} = useAuth();
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
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Error occurred while logging in. Please try again.");
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

export default Login;
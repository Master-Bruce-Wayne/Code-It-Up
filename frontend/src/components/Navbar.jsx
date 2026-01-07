import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const { userData, setUserData } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("userData");
      setUserData(null);
      navigate("/login");
    } catch (err) {
      // alert("Logout failed");
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="w-full shadow">
      
      <div className="bg-gray-900 text-white h-14 flex items-center">
        <div className="w-[90%] mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide">
            Code-It-Up
          </Link>

          {/* Profile Section */}
          {userData ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="bg-gray-800 px-3 py-1 rounded-md underline cursor-pointer"
              >
                {userData.username} ⌄ 
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 bg-white text-black shadow rounded w-36">
                  <Link
                    to={`/profile/${userData.username}`}
                    className="block px-3 py-2 hover:bg-gray-200"
                    onClick={() => setOpenMenu(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Bottom navbar links */}
      <div className="bg-gray-100 border-b">
        <div className="w-[90%] mx-auto h-10 flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600" : "text-gray-700"
              } hover:text-blue-600`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/problemset"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600" : "text-gray-700"
              } hover:text-blue-600`
            }
          >
            Problemset
          </NavLink>

          <NavLink
            to="/contests"
            className={({ isActive }) =>
              `font-medium ${
                isActive ? "text-blue-600" : "text-gray-700"
              } hover:text-blue-600`
            }
          >
            Contests
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

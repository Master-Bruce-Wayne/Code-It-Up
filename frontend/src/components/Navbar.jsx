import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";
import { Code2, LogOut, User, LogIn, ChevronDown, List, Trophy, Home } from "lucide-react";

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
      setOpenMenu(false);
      navigate("/login");
      toast.success("Successfully logged out!");
    } catch (err) {
      toast.error("Logout failed!");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="w-[90%] mx-auto h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Code2 className="size-5" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Code-It-Up
            </span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? "text-indigo-400" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              <Home className="size-4" />
              Home
            </NavLink>

            <NavLink
              to="/problemset"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? "text-indigo-400" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              <List className="size-4" />
              Problemset
            </NavLink>

            <NavLink
              to="/contests"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive ? "text-indigo-400" : "text-gray-400 hover:text-gray-200"
                }`
              }
            >
              <Trophy className="size-4" />
              Contests
            </NavLink>
          </nav>
        </div>

        {/* Right: Session Info */}
        <div className="flex items-center gap-4">
          {userData ? (
            <div className="relative">
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-gray-200 hover:bg-slate-800/80 transition-all font-medium text-sm cursor-target"
              >
                <div className="size-6 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <span>{userData.username}</span>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`} />
              </button>

              {openMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl animate-scale-in z-20">
                    <Link
                      to={`/profile/${userData.username}`}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-slate-800 hover:text-white transition-colors"
                      onClick={() => setOpenMenu(false)}
                    >
                      <User className="size-4" />
                      My Profile
                    </Link>

                    <div className="h-[1px] bg-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors cursor-target"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-indigo-500/10 cursor-target"
            >
              <LogIn className="size-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

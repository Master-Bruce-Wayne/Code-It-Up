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
        method: "GET",
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
    <header className="sticky top-0 z-50 w-full bg-navbg border-b-2 border-ink">
      <div className="w-[90%] mx-auto h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-ink hover:opacity-80">
            <div className="p-1 border-2 border-ink bg-surface rounded-md">
              <Code2 className="size-5" />
            </div>
            <span>Code-It-Up</span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-semibold transition-colors font-mono ${
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              <Home className="size-4" />
              Home
            </NavLink>

            <NavLink
              to="/problemset"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-semibold transition-colors font-mono ${
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                }`
              }
            >
              <List className="size-4" />
              Problemset
            </NavLink>

            <NavLink
              to="/contests"
              className={({ isActive }) =>
                `flex items-center gap-1.5 text-sm font-semibold transition-colors font-mono ${
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink"
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border-2 border-ink bg-surface text-ink hover:bg-canvas-alt transition-transform font-mono text-sm uppercase tracking-wide cursor-pointer active:translate-y-[1px]"
              >
                <div className="size-6 rounded-pill border-2 border-ink bg-lime flex items-center justify-center font-bold text-xs">
                  {userData.username.charAt(0).toUpperCase()}
                </div>
                <span>{userData.username}</span>
                <ChevronDown className={`size-3.5 transition-transform duration-200 ${openMenu ? "rotate-180" : ""}`} />
              </button>

              {openMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 rounded-md border-2 border-ink bg-surface p-1.5 z-20">
                    <Link
                      to={`/profile/${userData.username}`}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-md font-mono font-semibold text-sm text-ink hover:bg-canvas-alt transition-colors"
                      onClick={() => setOpenMenu(false)}
                    >
                      <User className="size-4" />
                      My Profile
                    </Link>

                    <div className="h-[1px] bg-divider my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-md font-mono font-semibold text-sm text-red-700 hover:bg-canvas-alt transition-colors cursor-pointer"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-surface text-ink border-2 border-ink px-4 py-1.5 rounded-md text-[0.85rem] font-bold font-mono uppercase tracking-[0.03em] hover:-translate-y-0.5 transition-transform active:translate-y-0 cursor-pointer"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 bg-lime text-ink border-2 border-ink px-4 py-1.5 rounded-md text-[0.85rem] font-bold font-mono uppercase tracking-[0.03em] hover:bg-lime-hover hover:-translate-y-0.5 transition-all active:translate-y-0 cursor-pointer"
              >
                Start Testing &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

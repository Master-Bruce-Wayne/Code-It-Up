import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Clock, Trophy, ArrowRight, Activity, Zap } from "lucide-react";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, past

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch(`${apiUrl}/contest/getAll`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load contests");
          toast.error("Failed to load contests");
        } else {
          setContests(data.contests);
        }
      } catch (err) {
        setError("Server error while fetching contests");
        toast.error("Server error while fetching contests");
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getContestStatus = (startTime, duration) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    
    if (now < start) return { status: "upcoming", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
    if (now >= start && now <= end) return { status: "live", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse" };
    return { status: "past", color: "bg-slate-800 text-slate-400 border-slate-700" };
  };

  const filteredContests = contests.filter((c) => {
    if (filter === "all") return true;
    const { status } = getContestStatus(c.startTime, c.duration);
    return status === filter;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-400">Loading Contests...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <h2 className="text-center text-red-500 text-xl font-semibold">{error}</h2>
      </div>
    );

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-12 bg-slate-950 min-h-screen">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Trophy className="size-3.5" />
            Competitive Arena
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">Contests</h1>
          <p className="text-gray-400 max-w-lg leading-relaxed text-sm font-normal">
            Compete against developers worldwide. Gain rating points, solve problems under time pressure, and rise up the ranks.
          </p>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 bg-slate-900/60 p-1 border border-slate-800 rounded-2xl flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-md hover:cursor-pointer"
                : "text-gray-400 hover:text-gray-200 hover:cursor-pointer"
            }`}
          >
            All Contests
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === "upcoming"
                ? "bg-indigo-600 text-white shadow-md hover:cursor-pointer"
                : "text-gray-400 hover:text-gray-200 hover:cursor-pointer"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === "past"
                ? "bg-indigo-600 text-white shadow-md hover:cursor-pointer"
                : "text-gray-400 hover:text-gray-200 hover:cursor-pointer"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {filteredContests.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
          <p className="text-gray-500 text-lg font-medium">No contests available in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredContests.map((c, index) => {
            const { status, color } = getContestStatus(c.startTime, c.duration);
            const startDate = new Date(c.startTime);
            
            return (
              <div
                key={c._id}
                className="contest-card animate-fade-in-up border border-slate-900 bg-slate-900/20 hover:border-slate-800 hover:bg-slate-900/50 p-6 rounded-2xl shadow-sm transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="text-gray-600 font-bold text-lg">#{index + 1}</span>
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-bold text-gray-200 group-hover:text-white transition-colors">{c.contestName}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-semibold text-gray-500 tracking-wider">CODE: {c.contestCode}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${color}`}>
                            {status.toUpperCase()}
                          </span>
                          {c.rated && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              RATED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4.5 text-indigo-400" />
                        <span className="font-semibold text-gray-300">Start Time:</span>
                        <span>{startDate.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4.5 text-purple-400" />
                        <span className="font-semibold text-gray-300">Duration:</span>
                        <span>{c.duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Button */}
                  <div className="flex items-center">
                    <Link
                      to={`/contest/${c.contestCode}`}
                      className="flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-gray-300 hover:text-white border border-slate-800 hover:border-indigo-500/30 px-6 py-3.5 rounded-2xl font-bold text-base shadow-md transition-all group-hover:scale-[1.02] cursor-target"
                    >
                      {status === "upcoming" ? "Register & Details" : status === "live" ? "Enter Contest" : "View Results"}
                      <ArrowRight className="size-4.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      {contests.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-900 text-center">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Showing <span className="text-indigo-400">{filteredContests.length}</span> of{" "}
            <span className="text-gray-300">{contests.length}</span> contests
          </p>
        </div>
      )}
    </div>
  );
};

export default Contests;

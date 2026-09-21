import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Clock, Trophy, ArrowRight } from "lucide-react";
import AnnotationMarker from "../components/AnnotationMarker.jsx";

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
    
    if (now < start) return { status: "upcoming", color: "bg-accentBlue text-ink" };
    if (now >= start && now <= end) return { status: "live", color: "bg-lime text-ink" };
    return { status: "past", color: "bg-surface text-ink-muted border-ink/50 border-2" };
  };

  const filteredContests = contests.filter((c) => {
    if (filter === "all") return true;
    const { status } = getContestStatus(c.startTime, c.duration);
    return status === filter;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-canvas">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-ink"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-canvas">
        <h2 className="text-center text-accentCoral font-bold font-mono text-xl">{error}</h2>
      </div>
    );

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-12 bg-canvas min-h-[80vh] blueprint-grid">
      {/* Header Section */}
      <div className="mb-10 text-center relative">
        <div className="inline-block mb-4">
          <AnnotationMarker label="COMPETITIVE ARENA" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight mb-3">Contests</h1>
        <p className="text-ink-soft font-mono text-sm uppercase tracking-wider max-w-2xl mx-auto">
          Compete against developers worldwide. Gain rating points, solve problems under time pressure, and rise up the ranks.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 justify-center mb-12 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-pill font-mono text-sm font-bold uppercase tracking-wider transition-all border-2 border-ink ${
            filter === "all"
              ? "bg-ink text-canvas"
              : "bg-surface text-ink hover:bg-ink/5"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-5 py-2 rounded-pill font-mono text-sm font-bold uppercase tracking-wider transition-all border-2 border-ink ${
            filter === "upcoming"
              ? "bg-ink text-canvas"
              : "bg-surface text-ink hover:bg-ink/5"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`px-5 py-2 rounded-pill font-mono text-sm font-bold uppercase tracking-wider transition-all border-2 border-ink ${
            filter === "past"
              ? "bg-ink text-canvas"
              : "bg-surface text-ink hover:bg-ink/5"
          }`}
        >
          Past
        </button>
      </div>

      {filteredContests.length === 0 ? (
        <div className="text-center py-20 border-2 border-ink border-dashed rounded-md bg-surface">
          <p className="text-ink-muted font-mono font-bold uppercase tracking-wider">No contests available in this category.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredContests.map((c, index) => {
            const { status, color } = getContestStatus(c.startTime, c.duration);
            const startDate = new Date(c.startTime);
            
            return (
              <div
                key={c._id}
                className="bg-surface border-2 border-ink p-6 rounded-lg shadow-[4px_4px_0_0_#17181A] transition-transform hover:-translate-y-1 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Column */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="text-ink-muted font-mono font-bold text-lg">#{index + 1}</span>
                      <div className="space-y-1.5">
                        <h3 className="text-2xl font-bold text-ink">{c.contestName}</h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink-muted border-2 border-ink/20 px-2 py-0.5 rounded-sm">
                            CODE: {c.contestCode}
                          </span>
                          <span className={`px-2 py-0.5 rounded-pill font-mono text-[10px] font-bold uppercase tracking-wider ${
                            status === 'past' ? color : `border-2 border-ink ${color}`
                          }`}>
                            {status}
                          </span>
                          {c.rated && (
                            <span className="px-2 py-0.5 rounded-pill font-mono text-[10px] font-bold uppercase tracking-wider border-2 border-ink bg-surface text-ink">
                              RATED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-center gap-2 text-ink">
                        <Calendar className="size-4 text-ink-muted" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Start:</span>
                        <span className="font-mono text-sm font-bold">{startDate.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink">
                        <Clock className="size-4 text-ink-muted" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Duration:</span>
                        <span className="font-mono text-sm font-bold">{c.duration} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Button */}
                  <div className="flex items-center">
                    <Link
                      to={`/contest/${c.contestCode}`}
                      className="flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-3 border-2 border-ink bg-surface hover:bg-ink hover:text-canvas text-ink font-bold font-mono uppercase tracking-wider rounded-md transition-colors shadow-[2px_2px_0_0_#17181A] hover:shadow-none translate-y-0 hover:translate-y-[2px] translate-x-0 hover:translate-x-[2px]"
                    >
                      {status === "upcoming" ? "Register / Details" : status === "live" ? "Enter Contest" : "View Results"}
                      <ArrowRight className="size-4" />
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
        <div className="mt-12 pt-8 border-t-2 border-ink/20 text-center">
          <p className="text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">
            Showing <span className="text-ink">{filteredContests.length}</span> of{" "}
            <span className="text-ink">{contests.length}</span> contests
          </p>
        </div>
      )}
    </div>
  );
};

export default Contests;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
    
    if (now < start) return { status: "upcoming", color: "bg-blue-100 text-blue-700" };
    if (now >= start && now <= end) return { status: "live", color: "bg-green-100 text-green-700" };
    return { status: "past", color: "bg-gray-100 text-gray-700" };
  };

  const filteredContests = contests.filter((c) => {
    if (filter === "all") return true;
    const { status } = getContestStatus(c.startTime, c.duration);
    return status === filter;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Contests...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-center text-red-500 text-xl font-semibold">{error}</h2>
      </div>
    );

  return (
    <div className="w-full px-20 mx-auto py-8 bg-white min-h-screen">
      {/* Header Section */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Contests</h1>
        <p className="text-lg text-gray-600 mb-6">
          Participate in coding contests and compete with other programmers
        </p>
        
        {/* Filter Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-md hover:cursor-pointer"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:cursor-pointer"
            }`}
          >
            All Contests
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
              filter === "upcoming"
                ? "bg-blue-600 text-white shadow-md hover:cursor-pointer"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:cursor-pointer"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("past")}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
              filter === "past"
                ? "bg-blue-600 text-white shadow-md hover:cursor-pointer"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:cursor-pointer"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {filteredContests.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-medium">No contests available.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {filteredContests.map((c, index) => {
            const { status, color } = getContestStatus(c.startTime, c.duration);
            const startDate = new Date(c.startTime);
            const endDate = new Date(startDate.getTime() + c.duration * 60000);
            
            return (
              <div
                key={c._id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 table-row-animate"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="text-gray-500 font-semibold text-lg">#{index + 1}</span>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{c.contestName}</h3>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-gray-600 font-medium">Code: {c.contestCode}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          {c.rated && (
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                              Rated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Start:</span>
                        <span>{startDate.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Duration:</span>
                        <span>{c.duration} minutes</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Action Button */}
                  <div className="flex items-center">
                    <Link
                      to={`/contest/${c.contestCode}`}
                      className="bg-blue-600 hover:bg-blue-700 !text-white px-8 py-3 rounded-xl btn-animate font-semibold shadow-md text-lg"
                    >
                      {status === "upcoming" ? "View Details →" : status === "live" ? "Enter Contest →" : "View Results →"}
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
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredContests.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{contests.length}</span> contests
          </p>
        </div>
      )}
    </div>
  );
};

export default Contests;

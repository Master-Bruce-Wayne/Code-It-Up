import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, Tag, ChevronRight, BookOpen, Star } from "lucide-react";

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/getAll`);
        const data = await res.json();

        if (!data.problems) {
          setError("Failed to load problems");
          toast.error("Failed to load problems");
        } else {
          setProblems(data.problems);
        }
      } catch (err) {
        setError("Server error while fetching problems");
        toast.error("Server error while fetching problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((p) =>
    p.probName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.probCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyStyles = (rating) => {
    if (!rating) return { badge: "bg-slate-800 text-slate-400 border-slate-700", text: "text-slate-400" };
    if (rating < 1200) return { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", text: "text-emerald-400" };
    if (rating < 1600) return { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", text: "text-blue-400" };
    if (rating < 2000) return { badge: "bg-purple-500/10 text-purple-400 border-purple-500/20", text: "text-purple-400" };
    if (rating < 2400) return { badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", text: "text-amber-400" };
    return { badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", text: "text-rose-400" };
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-400">Loading Problems...</h2>
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
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
            <BookOpen className="size-3.5" />
            Practice Library
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">Problemset</h1>
          <p className="text-gray-400 max-w-lg leading-relaxed text-sm font-normal">
            Improve your analytical speed and concepts. Browse through algorithmic challenges curated across varying levels.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <Search className="size-4" />
          </span>
          <input
            type="text"
            placeholder="Search problem by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-sm"
          />
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm ? "No problems found matching your query." : "No problems available yet."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredProblems.map((p, index) => {
            const diffStyles = getDifficultyStyles(p.probRating);
            return (
              <div
                key={p._id}
                className="prob-item animate-fade-in-up border border-slate-900 bg-slate-900/20 hover:border-slate-800 hover:bg-slate-900/50 p-5 rounded-2xl shadow-sm transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Block */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-gray-600 font-bold text-sm">#{index + 1}</span>
                      <Link
                        to={`/problemset/problem/${p.probCode}`}
                        className="text-lg font-extrabold text-gray-200 hover:text-indigo-400 transition-colors"
                      >
                        {p.probName}
                      </Link>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${diffStyles.badge}`}>
                        {p.probRating ? `Rating: ${p.probRating}` : "Unrated"}
                      </span>
                    </div>
                    
                    {p.probTags?.length > 0 && (
                      <div className="flex gap-2 flex-wrap items-center">
                        <Tag className="size-3.5 text-gray-500 flex-shrink-0" />
                        {p.probTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-slate-900 border border-slate-800 text-gray-400 rounded-md font-medium hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-default"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Button */}
                  <div className="flex items-center">
                    <Link
                      to={`/problemset/problem/${p.probCode}`}
                      className="flex items-center gap-1 bg-slate-900 hover:bg-indigo-600 text-gray-300 hover:text-white border border-slate-800 hover:border-indigo-500/30 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all group-hover:scale-[1.02] cursor-target"
                    >
                      Solve
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      {problems.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-900 text-center">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Showing <span className="text-indigo-400">{filteredProblems.length}</span> of{" "}
            <span className="text-gray-300">{problems.length}</span> problems
          </p>
        </div>
      )}
    </div>
  );
};

export default Problemset;

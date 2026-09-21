import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Search, Tag, ChevronRight, BookOpen, Star } from "lucide-react";
import AnnotationMarker from '../components/AnnotationMarker.jsx';

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
    if (!rating) return { badge: "bg-surface text-ink", text: "text-ink" };
    if (rating < 1200) return { badge: "bg-lime text-ink", text: "text-ink" };
    if (rating < 1600) return { badge: "bg-accentBlue-soft text-ink", text: "text-ink" };
    if (rating < 2000) return { badge: "bg-accentPurple text-ink", text: "text-ink" };
    if (rating < 2400) return { badge: "bg-accentCoral text-ink", text: "text-ink" };
    return { badge: "bg-accentCoral text-ink", text: "text-ink" };
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-ink mb-4"></div>
          <h2 className="text-xl font-bold font-mono text-ink uppercase tracking-wider">Loading...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <h2 className="text-center text-accentCoral text-xl font-bold font-mono uppercase tracking-wider">{error}</h2>
      </div>
    );

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-12 bg-canvas min-h-screen blueprint-grid">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <AnnotationMarker label="PRACTICE LIBRARY" className="mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight mb-3">Problemset</h1>
          <p className="text-ink-soft max-w-lg leading-relaxed text-sm font-normal">
            Improve your analytical speed and concepts. Browse through algorithmic challenges curated across varying levels.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-ink-muted">
            <Search className="size-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface border-2 border-ink rounded-md text-ink placeholder-ink-muted focus:outline-none focus:shadow-[4px_4px_0_0_#17181A] transition-shadow font-mono font-bold text-[0.85rem]"
          />
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-ink rounded-lg bg-surface">
          <p className="text-ink-muted font-mono font-bold uppercase tracking-wider">
            {searchTerm ? "No problems found" : "No problems available yet"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredProblems.map((p, index) => {
            const diffStyles = getDifficultyStyles(p.probRating);
            return (
              <div
                key={p._id}
                className="border-2 border-ink bg-surface p-5 rounded-lg transition-transform hover:-translate-y-0.5 group"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Block */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-ink-muted font-mono font-bold text-sm">#{index + 1}</span>
                      <Link
                        to={`/problemset/problem/${p.probCode}`}
                        className="text-lg font-bold text-ink hover:text-accentBlue transition-colors"
                      >
                        {p.probName}
                      </Link>
                      <span className={`px-2.5 py-0.5 rounded-pill text-xs font-bold border-2 border-ink ${diffStyles.badge}`}>
                        {p.probRating ? `Rating: ${p.probRating}` : "Unrated"}
                      </span>
                    </div>
                    
                    {p.probTags?.length > 0 && (
                      <div className="flex gap-2 flex-wrap items-center">
                        <Tag className="size-3.5 text-ink-muted flex-shrink-0" />
                        {p.probTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-[0.7rem] bg-canvas-alt border border-divider text-ink-soft rounded-md font-mono font-bold uppercase tracking-wide cursor-default"
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
                      className="flex items-center gap-1 bg-surface hover:bg-lime text-ink border-2 border-ink px-5 py-2.5 rounded-md font-mono font-bold text-sm uppercase tracking-wide transition-colors cursor-pointer active:translate-y-[1px]"
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
        <div className="mt-12 pt-8 border-t-2 border-ink text-center">
          <p className="text-ink-soft text-xs font-mono font-bold uppercase tracking-wider">
            Showing <span className="text-ink">{filteredProblems.length}</span> of{" "}
            <span className="text-ink-muted">{problems.length}</span> problems
          </p>
        </div>
      )}
    </div>
  );
};

export default Problemset;

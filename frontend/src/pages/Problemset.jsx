import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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

  const getDifficultyColor = (rating) => {
    if (!rating) return "bg-gray-100 text-gray-700";
    if (rating < 1200) return "bg-green-100 text-green-700";
    if (rating < 1600) return "bg-blue-100 text-blue-700";
    if (rating < 2000) return "bg-purple-100 text-purple-700";
    if (rating < 2400) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Problems...</h2>
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
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Problemset</h1>
        <p className="text-lg text-gray-600 mb-6">
          Practice coding problems and improve your problem-solving skills
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search problems by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700"
          />
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-medium">
            {searchTerm ? "No problems found matching your search." : "No problems available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {filteredProblems.map((p, index) => (
            <div
              key={p._id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 table-row-animate"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-gray-500 font-semibold text-lg">#{index + 1}</span>
                    <Link
                      to={`/problemset/problem/${p.probCode}`}
                      className="text-xl font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                      {p.probName}
                    </Link>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(p.probRating)}`}>
                      {p.probRating ? `Rating: ${p.probRating}` : "Unrated"}
                    </span>
                  </div>
                  
                  {p.probTags?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {p.probTags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg font-medium border border-blue-200 hover:bg-blue-100 transition-colors duration-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Section - Action Button */}
                <div className="flex items-center">
                  <Link
                    to={`/problemset/problem/${p.probCode}`}
                    className="bg-blue-600 hover:bg-blue-700 !text-white px-6 py-3 rounded-xl btn-animate font-semibold shadow-md"
                  >
                    Solve →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {problems.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-800">{filteredProblems.length}</span> of{" "}
            <span className="font-semibold text-gray-800">{problems.length}</span> problems
          </p>
        </div>
      )}
    </div>
  );
};

export default Problemset;

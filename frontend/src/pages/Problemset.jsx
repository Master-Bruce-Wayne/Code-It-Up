import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Problemset = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/getAll`);
        const data = await res.json();

        if (!data.problems) {
          setError("Failed to load problems");
        } else {
          setProblems(data.problems);
        }
      } catch (err) {
        setError("Server error while fetching problems");
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading Problems...
      </h2>
    );

  if (error)
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>
    );

  return (
    <div className="w-[85%] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Problemset</h1>

      {problems.length === 0 ? (
        <p className="text-gray-500 text-lg">No problems available.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Problem Name</th>
                <th className="p-3 border">Tags</th>
                <th className="p-3 border">Rating</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, index) => (
                <tr
                  key={p._id}
                  className="border hover:bg-gray-50 transition"
                >
                  <td className="p-3 border font-semibold text-center">
                    {index + 1}
                  </td>

                  <td className="p-3 border font-semibold text-blue-600">
                    <Link to={`/problem/${p.probCode}`}>
                      {p.probName}
                    </Link>
                  </td>

                  <td className="p-3 border">
                    {p.probTags?.length > 0 ? (
                      <div className="flex gap-2 flex-wrap">
                        {p.probTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No tags</span>
                    )}
                  </td>

                  <td className="p-3 border text-center font-medium">
                    {p.probRating ?? "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Problemset;

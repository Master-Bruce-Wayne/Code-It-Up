import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading Contests...
      </h2>
    );

  if (error)
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );

  return (
    <div className="w-[85%] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Contests</h1>

      {contests.length === 0 ? (
        <p className="text-gray-500 text-lg">No contests available.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Contest Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Start Time</th>
                <th className="p-3 border">Duration (mins)</th>
                <th className="p-3 border">Rated</th>
                <th className="p-3 border text-center">Enter</th>
              </tr>
            </thead>

            <tbody>
              {contests.map((c, index) => (
                <tr
                  key={c._id}
                  className="border hover:bg-gray-50 transition"
                >
                  <td className="p-3 border font-semibold text-center">
                    {index + 1}
                  </td>

                  <td className="p-3 border font-semibold">
                    {c.contestName}
                  </td>

                  <td className="p-3 border">{c.contestCode}</td>

                  <td className="p-3 border">
                    {new Date(c.startTime).toLocaleString()}
                  </td>

                  <td className="p-3 border text-center">
                    {c.duration}
                  </td>

                  <td className="p-3 border">
                    {c.rated ? (
                      <span className="text-green-600 font-semibold">
                        Rated
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        Unrated
                      </span>
                    )}
                  </td>

                  <td className="p-3 border text-center">
                    <Link
                      to={`/contest/${c.contestCode}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition"
                    >
                      Enter →
                    </Link>
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

export default Contests;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ContestPage = () => {
  const { contestCode } = useParams();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await fetch(`${apiUrl}/contest/${contestCode}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load contest");
          setLoading(false);
          return;
        }

        setContest(data.contest);

        // fetch problems now
        await fetchProblems(data.contest.problems);
      } catch (err) {
        setError("Server error while fetching contest");
      } finally {
        setLoading(false);
      }
    };

    const fetchProblems = async (problemArray) => {
      try {
        const results = await Promise.all(
          problemArray.map(async (p) => {
            const res = await fetch(
              `${apiUrl}/problem/getById/${p.problemId}`
            );
            const data = await res.json();

            if (!data.success) return null;

            return {
              index: p.index,
              probName: data.problem.probName,
              probCode: data.problem.probCode,
              probRating: data.problem.probRating
            };
          })
        );

        setProblems(results.filter(Boolean));
      } catch (err) {
        setError("Failed to load contest problems");
      }
    };

    fetchContest();
  }, [contestCode]);

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading Contest...
      </h2>
    );

  if (error)
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );

  if (!contest) return null;

  return (
    <div className="w-[85%] mx-auto py-8">

      {/* Navbar  */}
      <div className="flex gap-6 border-b mb-6 text-lg font-medium">

        <a
          href={location.pathname}
          className={`pb-2 ${
            location.pathname.endsWith(`/contest/${contestCode}`)
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Problems
        </a>

        <a
          href={`${location.pathname}/submit`}
          className={`pb-2 ${
            location.pathname.includes("/submit")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Submit
        </a>

        <a
          href={`${location.pathname}/submissions/my`}
          className={`pb-2 ${
            location.pathname.includes("/submissions/my")
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          My Submissions
        </a>
      </div>

      {/* Header */}
      <div className="border-b pb-5 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {contest.contestName}
        </h1>
        <h3 className="text-gray-500 font-medium">
          Code: {contest.contestCode}
        </h3>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Start:</span>{" "}
            {new Date(contest.startTime).toLocaleString()}
          </p>

          <p>
            <span className="font-semibold">Duration:</span>{" "}
            {contest.duration} minutes
          </p>

          <p>
            <span className="font-semibold">Rated:</span>{" "}
            {contest.rated ? (
              <span className="text-green-600 font-semibold">
                Yes
              </span>
            ) : (
              <span className="text-gray-500">No</span>
            )}
          </p>
        </div>
      </div>

      {/* Problems Table */}
      <h2 className="text-2xl font-semibold mb-4">Problems</h2>

      {problems.length === 0 ? (
        <p className="text-gray-500">No problems found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="p-3 border">Index</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Rating</th>
                <th className="p-3 border">Solve</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, i) => (
                <tr
                  key={i}
                  className="text-center border hover:bg-gray-50 transition"
                >
                  <td className="p-3 border font-semibold">{p.index}</td>

                  <td className="p-3 border">{p.probName}</td>

                  <td className="p-3 border">{p.probRating}</td>

                  <td className="p-3 border">
                    <Link
                      to={`/contest/${contestCode}/problem/${p.probCode}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition"
                    >
                      Solve →
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

export default ContestPage;

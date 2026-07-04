import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";

const ContestPage = () => {
  const { contestCode } = useParams();
  const location = useLocation();
  const { userData } = useAuth();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Registration and countdown state
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // to show timer for upcoming contest
  const calculateTimeLeft = (startTime) => {
    const difference = +new Date(startTime) - +new Date();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      totalMs: difference
    };
  };

  useEffect(() => {
    const fetchContestAndData = async () => {
      try {
        const res = await fetch(`${apiUrl}/contest/${contestCode}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load contest");
          toast.error("Failed to load contest!");
          setLoading(false);
          return;
        }

        setContest(data.contest);

        // Fetch problems if the contest has started
        const isUpcoming = new Date(data.contest.startTime) > new Date();
        if (!isUpcoming && data.contest.problems) {
          await fetchProblems(data.contest.problems);
        }

        // Setup timer if contest is upcoming
        if (isUpcoming) {
          setTimeLeft(calculateTimeLeft(data.contest.startTime));
          timerRef.current = setInterval(() => {
            const calculated = calculateTimeLeft(data.contest.startTime);
            setTimeLeft(calculated);
            // If countdown finishes, clear timer and reload to show problems
            if (!calculated) {
              clearInterval(timerRef.current);
              window.location.reload();
            }
          }, 1000);
        }

        // Fetch user registration status
        if (userData && userData._id) {
          const regRes = await fetch(`${apiUrl}/contest/${contestCode}/registration-status/${userData._id}`);
          const regData = await regRes.json();
          if (regData.success) {
            setRegistrationStatus(regData);
          }
        }
      } catch (err) {
        setError("Server error while fetching contest");
        toast.error("Server error while fetching contest");
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
        toast.error("Failed to load contest problems");
      }
    };

    fetchContestAndData();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [contestCode, userData]);

  // to register for contest
  const handleRegister = async (isRated) => {
    if (!userData) {
      toast.error("Please login to register for this contest!");
      return;
    }

    try {
      setRegistering(true);
      const res = await fetch(`${apiUrl}/contest/${contestCode}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userData._id,
          isRated
        })
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Registration successful!");
        setRegistrationStatus({ registered: true, isRated });
      } else {
        toast.error(data.message || "Registration failed!");
      }
    } catch (err) {
      toast.error("Connection error. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading Contest...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-center text-red-500 text-xl font-semibold">{error}</h2>
      </div>
    );

  if (!contest) return null;

  const isUpcoming = timeLeft !== null;

  return (
    <div className="w-full px-20 mx-auto py-8 bg-white min-h-screen">

      {/* Navbar  */}
      <div className="flex gap-6 border-b mb-6 text-lg font-medium animate-fade-in">
        <a
          href={location.pathname}
          className={`pb-2 transition-all duration-200 ${
            location.pathname.endsWith(`/contest/${contestCode}`)
              ? "!text-blue-600 border-b-2 border-blue-600"
              : "!text-gray-600 hover:text-blue-600"
          }`}
        >
          Problems
        </a>

        <a
          href={`${location.pathname}/submit`}
          className={`pb-2 transition-all duration-200 ${
            location.pathname.includes("/submit")
              ? "!text-blue-600 border-b-2 border-blue-600"
              : "!text-gray-600 hover:text-blue-600"
          }`}
        >
          Submit
        </a>

        <a
          href={`${location.pathname}/submissions/my`}
          className={`pb-2 transition-all duration-200 ${
            location.pathname.includes("/submissions/my")
              ? "!text-blue-600 border-b-2 border-blue-600"
              : "!text-gray-600 hover:text-blue-600"
          }`}
        >
          My Submissions
        </a>
      </div>

      {/* Header */}
      <div className="border-b pb-5 mb-6 animate-fade-in">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
              {contest.contestName}
            </h1>
            <h3 className="text-gray-500 text-lg font-medium">
              Code: {contest.contestCode}
            </h3>
          </div>
          {isUpcoming && (
            <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 animate-pulse">
              Registration Open
            </span>
          )}
        </div>

        <div className="mt-4 text-base text-gray-700 space-y-1">
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

      {/* Contest Environment & registration logic */}
      {isUpcoming ? (
        <div className="grid md:grid-cols-2 gap-8 my-8 animate-fade-in">
          {/* Countdown Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
            <h3 className="text-xl font-semibold mb-6 text-indigo-200">CONTEST BEGINS IN</h3>
            <div className="flex gap-4">
              {timeLeft.days > 0 && (
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-extrabold text-indigo-400">{timeLeft.days}</span>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Days</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-indigo-400">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Hours</span>
              </div>
              <span className="text-4xl md:text-5xl font-extrabold text-indigo-600 animate-pulse">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-indigo-400">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Mins</span>
              </div>
              <span className="text-4xl md:text-5xl font-extrabold text-indigo-600 animate-pulse">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-indigo-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-1">Secs</span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-white border-2 border-gray-150 rounded-2xl p-8 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Contest Entry</h3>
              <p className="text-gray-600 leading-relaxed font-normal mb-6">
                Register below to participate. You can choose to enter as a **Rated** participant to influence your leaderboard rating or **Unrated** for casual practice.
              </p>
            </div>

            {registrationStatus?.registered ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center animate-scale-in">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-150 text-green-700 mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-green-800 mb-1">Registration Complete!</h4>
                <p className="text-green-700 font-medium text-sm">
                  You are registered as a <span className="underline font-bold">{registrationStatus.isRated ? "Rated" : "Unrated"}</span> participant.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userData ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRegister(true)}
                      disabled={registering}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm disabled:opacity-50 cursor-target flex flex-col items-center justify-center gap-1"
                    >
                      <span>Register (Rated)</span>
                      <span className="text-[10px] opacity-80 font-normal">Rating will change</span>
                    </button>
                    <button
                      onClick={() => handleRegister(false)}
                      disabled={registering}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 px-4 rounded-xl font-bold transition-all hover:scale-[1.02] border disabled:opacity-50 cursor-target flex flex-col items-center justify-center gap-1"
                    >
                      <span>Register (Unrated)</span>
                      <span className="text-[10px] opacity-80 font-normal text-gray-500">Practice only</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium mb-3">Login to register for the contest</p>
                    <Link
                      to="/login"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
                    >
                      Go to Login
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Problems Section */}
      <h2 className="text-2xl font-bold mb-4 animate-fade-in mt-8">Problems</h2>

      {isUpcoming ? (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center my-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Problems Locked</h3>
          <p className="text-gray-500 max-w-md mx-auto font-normal">
            Problems will become visible automatically once the contest begins. Make sure to register beforehand!
          </p>
        </div>
      ) : problems.length === 0 ? (
        <p className="text-gray-500">No problems found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg overflow-hidden shadow-sm bg-white animate-fade-in">
          <table className="w-full border-collapse">
            <thead className="bg-white border-b-2 border-gray-200">
              <tr className="text-center">
                <th className="p-3 border font-semibold">Index</th>
                <th className="p-3 border font-semibold">Name</th>
                <th className="p-3 border font-semibold">Rating</th>
                <th className="p-3 border font-semibold">Solve</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, i) => (
                <tr
                  key={i}
                  className="text-center border-b table-row-animate bg-white"
                >
                  <td className="p-3 border font-semibold">{p.index}</td>
                  <td className="p-3 border">{p.probName}</td>
                  <td className="p-3 border">{p.probRating}</td>
                  <td className="p-3 border">
                    <Link
                      to={`/contest/${contestCode}/problem/${p.probCode}`}
                      className="bg-blue-600 hover:bg-blue-700 !text-white px-4 py-2 rounded-lg btn-animate inline-block"
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

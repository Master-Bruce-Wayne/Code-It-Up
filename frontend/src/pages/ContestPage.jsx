import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";
import { Clock, Lock, Trophy, Sparkles, Unlock, Calendar, Check, ArrowLeft, ArrowRight, Play } from "lucide-react";

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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-400">Loading Contest...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <h2 className="text-center text-red-500 text-xl font-semibold">{error}</h2>
      </div>
    );

  if (!contest) return null;

  const isUpcoming = timeLeft !== null;

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-12 bg-slate-950 min-h-screen">

      {/* Navigation Breadcrumbs / Links */}
      <div className="flex gap-6 border-b border-slate-900 mb-8 text-sm font-semibold animate-fade-in">
        <a
          href={location.pathname}
          className={`pb-3 transition-all ${
            location.pathname.endsWith(`/contest/${contestCode}`)
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Problems
        </a>

        <a
          href={`${location.pathname}/submit`}
          className={`pb-3 transition-all ${
            location.pathname.includes("/submit")
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Submit
        </a>

        <a
          href={`${location.pathname}/submissions/my`}
          className={`pb-3 transition-all ${
            location.pathname.includes("/submissions/my")
              ? "text-indigo-400 border-b-2 border-indigo-400"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          My Submissions
        </a>
      </div>

      {/* Header card */}
      <div className="border border-slate-900 bg-slate-900/10 backdrop-blur-sm p-8 rounded-3xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {contest.contestName}
            </h1>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
              Contest Code: {contest.contestCode}
            </h3>
          </div>
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 uppercase tracking-wide animate-pulse">
              <Sparkles className="size-3" />
              Registration Open
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-slate-900/60 text-sm text-gray-400">
          <div className="flex items-center gap-2.5">
            <Calendar className="size-4.5 text-indigo-400" />
            <div>
              <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider">Start Time</span>
              <span className="text-gray-200 font-medium">{new Date(contest.startTime).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="size-4.5 text-purple-400" />
            <div>
              <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider">Duration</span>
              <span className="text-gray-200 font-medium">{contest.duration} minutes</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Trophy className="size-4.5 text-amber-400" />
            <div>
              <span className="block text-gray-500 text-xs font-semibold uppercase tracking-wider">Contest Rating</span>
              <span className="text-gray-200 font-medium">{contest.rated ? "Rated Contest" : "Unrated Practice"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Environment & registration logic */}
      {isUpcoming ? (
        <div className="grid md:grid-cols-2 gap-8 my-8">
          {/* Countdown Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
            <h3 className="text-xs font-bold tracking-widest text-indigo-400 uppercase mb-6 flex items-center gap-1.5">
              <Clock className="size-3.5" />
              CONTEST BEGINS IN
            </h3>
            <div className="flex gap-4">
              {timeLeft.days > 0 && (
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{timeLeft.days}</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Days</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Hrs</span>
              </div>
              <span className="text-4xl md:text-5xl font-bold text-indigo-500 animate-pulse">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Mins</span>
              </div>
              <span className="text-4xl md:text-5xl font-bold text-indigo-500 animate-pulse">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Secs</span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">Participation Entry</h3>
              <p className="text-gray-400 leading-relaxed font-normal text-sm">
                Register to take part in this session. Choosing **Rated** affects your rating stats; choosing **Unrated** lets you compete casually.
              </p>
            </div>

            {registrationStatus?.registered ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 text-center animate-scale-in mt-6">
                <div className="inline-flex items-center justify-center size-10 rounded-full bg-emerald-500/10 text-emerald-400 mb-3 border border-emerald-500/20">
                  <Check className="size-5" />
                </div>
                <h4 className="text-base font-extrabold text-emerald-400 mb-1">You Are Registered!</h4>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  Registration type: <span className="text-indigo-400 underline">{registrationStatus.isRated ? "Rated Participant" : "Unrated Participant"}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-6">
                {userData ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRegister(true)}
                      disabled={registering}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-indigo-600/15 disabled:opacity-50 cursor-target flex flex-col items-center justify-center gap-0.5"
                    >
                      <span>Rated Entry</span>
                      <span className="text-[9px] opacity-70 font-normal">Alters global rating</span>
                    </button>
                    <button
                      onClick={() => handleRegister(false)}
                      disabled={registering}
                      className="border border-slate-800 bg-slate-950 hover:bg-slate-800 text-gray-300 hover:text-white py-3.5 px-4 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 cursor-target flex flex-col items-center justify-center gap-0.5"
                    >
                      <span>Unrated Entry</span>
                      <span className="text-[9px] opacity-70 font-normal text-gray-500">Casual practice</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-950 rounded-2xl border border-dashed border-slate-800">
                    <p className="text-gray-400 font-semibold text-sm mb-3">Sign in to register for the contest</p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md cursor-target"
                    >
                      <Play className="size-3.5 fill-white" />
                      Login Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Problems Section */}
      <h2 className="text-2xl font-bold mb-5 text-white tracking-tight animate-fade-in">Problems</h2>

      {isUpcoming ? (
        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl p-12 text-center my-4 animate-fade-in flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 mb-4 shadow-xl">
            <Lock className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-300 mb-2">Problems Locked</h3>
          <p className="text-gray-500 max-w-sm mx-auto font-normal text-sm">
            The problems set for this contest will reveal and unlock automatically as soon as the start time hits.
          </p>
        </div>
      ) : problems.length === 0 ? (
        <p className="text-gray-500 text-sm">No problems found for this contest.</p>
      ) : (
        <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950 animate-fade-in shadow-xl">
          <table className="w-full border-collapse">
            <thead className="border-b border-slate-900 bg-slate-900/20">
              <tr className="text-center">
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Index</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 text-left pl-6">Problem Title</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Rating</th>
                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Solve</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, i) => (
                <tr
                  key={i}
                  className="table-row-anim animate-fade-in-up text-center border-b border-slate-900 hover:bg-slate-900/10 transition-colors"
                >
                  <td className="p-4 font-extrabold text-gray-300">{p.index}</td>
                  <td className="p-4 text-left pl-6 font-bold text-gray-200 hover:text-indigo-400 transition-colors">
                    <Link to={`/contest/${contestCode}/problem/${p.probCode}`}>
                      {p.probName}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-gray-400">
                      {p.probRating}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/contest/${contestCode}/problem/${p.probCode}`}
                      className="inline-flex items-center gap-1 bg-slate-900 hover:bg-indigo-600 text-gray-300 hover:text-white border border-slate-800 hover:border-indigo-500/20 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all cursor-target"
                    >
                      Solve
                      <ArrowRight className="size-3.5" />
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

import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";
import { Clock, Lock, Trophy, Sparkles, Unlock, Calendar, Check, ArrowLeft, ArrowRight, Play } from "lucide-react";
import AnnotationMarker from "../components/AnnotationMarker.jsx";

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

  if (!contest) return null;

  const isUpcoming = timeLeft !== null;

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-12 bg-canvas min-h-[80vh] blueprint-grid">

      {/* Navigation Breadcrumbs / Links */}
      <div className="flex gap-6 border-b-2 border-ink/20 mb-8 font-mono text-[10px] font-bold uppercase tracking-wider">
        <a
          href={location.pathname}
          className={`pb-3 border-b-2 transition-all ${
            location.pathname.endsWith(`/contest/${contestCode}`)
              ? "text-ink border-ink"
              : "text-ink-muted border-transparent hover:text-ink hover:border-ink/50"
          }`}
        >
          Problems
        </a>

        <a
          href={`${location.pathname}/submit`}
          className={`pb-3 border-b-2 transition-all ${
            location.pathname.includes("/submit")
              ? "text-ink border-ink"
              : "text-ink-muted border-transparent hover:text-ink hover:border-ink/50"
          }`}
        >
          Submit
        </a>

        <a
          href={`${location.pathname}/submissions/my`}
          className={`pb-3 border-b-2 transition-all ${
            location.pathname.includes("/submissions/my")
              ? "text-ink border-ink"
              : "text-ink-muted border-transparent hover:text-ink hover:border-ink/50"
          }`}
        >
          My Submissions
        </a>
      </div>

      {/* Header card */}
      <div className="border-2 border-ink bg-surface shadow-[4px_4px_0_0_#17181A] p-8 rounded-lg mb-8 relative overflow-hidden">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold font-mono text-ink tracking-tight mb-2">
              {contest.contestName}
            </h1>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-ink-soft">
              Contest Code: {contest.contestCode}
            </h3>
          </div>
          {isUpcoming && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[10px] font-mono font-bold border-2 border-ink bg-lime text-ink uppercase tracking-wider">
              <Sparkles className="size-3" />
              Registration Open
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t-2 border-ink/20 text-ink">
          <div className="flex items-center gap-2.5">
            <Calendar className="size-5 text-ink-muted" />
            <div>
              <span className="block text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">Start Time</span>
              <span className="font-bold">{new Date(contest.startTime).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="size-5 text-ink-muted" />
            <div>
              <span className="block text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">Duration</span>
              <span className="font-bold">{contest.duration} minutes</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Trophy className="size-5 text-ink-muted" />
            <div>
              <span className="block text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">Contest Rating</span>
              <span className="font-bold">{contest.rated ? "Rated Contest" : "Unrated Practice"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Environment & registration logic */}
      {isUpcoming ? (
        <div className="grid md:grid-cols-2 gap-8 my-8">
          {/* Countdown Card */}
          <div className="bg-surface border-2 border-ink rounded-lg shadow-[4px_4px_0_0_#17181A] p-8 flex flex-col justify-center items-center text-center">
            <h3 className="text-[10px] font-mono font-bold tracking-wider text-ink-muted uppercase mb-6 flex items-center gap-1.5">
              <Clock className="size-4" />
              CONTEST BEGINS IN
            </h3>
            <div className="flex gap-4">
              {timeLeft.days > 0 && (
                <div className="flex flex-col">
                  <span className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight">{timeLeft.days}</span>
                  <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest mt-1">Days</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest mt-1">Hrs</span>
              </div>
              <span className="text-4xl md:text-5xl font-bold font-mono text-ink-muted">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest mt-1">Mins</span>
              </div>
              <span className="text-4xl md:text-5xl font-bold font-mono text-ink-muted">:</span>
              <div className="flex flex-col">
                <span className="text-4xl md:text-5xl font-bold font-mono text-ink tracking-tight">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-widest mt-1">Secs</span>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div className="bg-surface border-2 border-ink rounded-lg shadow-[4px_4px_0_0_#17181A] p-8 flex flex-col justify-between">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-ink tracking-tight">Participation Entry</h3>
              <p className="text-ink-soft leading-relaxed font-mono text-xs">
                Register to take part in this session. Choosing **Rated** affects your rating stats; choosing **Unrated** lets you compete casually.
              </p>
            </div>

            {registrationStatus?.registered ? (
              <div className="bg-lime/20 border-2 border-ink rounded-md p-6 text-center mt-auto">
                <div className="inline-flex items-center justify-center size-10 rounded-full bg-lime border-2 border-ink text-ink mb-3">
                  <Check className="size-5" />
                </div>
                <h4 className="text-base font-bold text-ink mb-1">You Are Registered!</h4>
                <p className="text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">
                  Registration type: <span className="text-ink underline">{registrationStatus.isRated ? "Rated Participant" : "Unrated Participant"}</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 mt-auto">
                {userData ? (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleRegister(true)}
                      disabled={registering}
                      className="bg-ink text-canvas hover:opacity-90 py-3.5 px-4 rounded-md font-mono font-bold text-xs transition-all shadow-[2px_2px_0_0_#17181A] disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 border-2 border-ink"
                    >
                      <span className="uppercase">Rated Entry</span>
                      <span className="text-[9px] opacity-80 font-normal">Alters global rating</span>
                    </button>
                    <button
                      onClick={() => handleRegister(false)}
                      disabled={registering}
                      className="border-2 border-ink bg-surface hover:bg-ink/5 text-ink py-3.5 px-4 rounded-md font-mono font-bold text-xs transition-all shadow-[2px_2px_0_0_#17181A] disabled:opacity-50 flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="uppercase">Unrated Entry</span>
                      <span className="text-[9px] text-ink-muted font-normal">Casual practice</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-canvas rounded-md border-2 border-dashed border-ink">
                    <p className="text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider mb-3">Sign in to register for the contest</p>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 bg-ink text-canvas font-mono uppercase font-bold text-xs px-6 py-2.5 rounded-md shadow-[2px_2px_0_0_#17181A] transition-all border-2 border-ink"
                    >
                      <Play className="size-3.5" />
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
      <div className="flex items-center mb-5 gap-2">
        <AnnotationMarker label="CONTEST SET" />
        <h2 className="text-2xl font-bold font-mono text-ink tracking-tight ml-2">Problems</h2>
      </div>

      {isUpcoming ? (
        <div className="bg-canvas border-2 border-dashed border-ink rounded-lg p-12 text-center my-4 flex flex-col items-center justify-center">
          <div className="inline-flex items-center justify-center size-14 rounded-full bg-surface border-2 border-ink text-ink-muted mb-4 shadow-[2px_2px_0_0_#17181A]">
            <Lock className="size-6" />
          </div>
          <h3 className="text-lg font-bold text-ink mb-2">Problems Locked</h3>
          <p className="text-ink-soft max-w-sm mx-auto font-mono text-xs">
            The problems set for this contest will reveal and unlock automatically as soon as the start time hits.
          </p>
        </div>
      ) : problems.length === 0 ? (
        <p className="text-ink-muted font-mono text-sm uppercase tracking-wider">No problems found for this contest.</p>
      ) : (
        <div className="border-2 border-ink rounded-lg bg-surface shadow-[4px_4px_0_0_#17181A] overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="border-b-2 border-ink bg-canvas/50">
              <tr>
                <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20">Index</th>
                <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-left border-r-2 border-ink/20">Problem Title</th>
                <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20">Rating</th>
                <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {problems.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-ink/20 hover:bg-ink/5 transition-colors last:border-0"
                >
                  <td className="p-4 font-mono text-sm font-bold text-ink-muted text-center border-r-2 border-ink/20">{p.index}</td>
                  <td className="p-4 text-left font-bold text-ink border-r-2 border-ink/20">
                    <Link to={`/contest/${contestCode}/problem/${p.probCode}`} className="hover:underline">
                      {p.probName}
                    </Link>
                  </td>
                  <td className="p-4 text-center border-r-2 border-ink/20">
                    <span className="px-2 py-0.5 rounded-pill font-mono text-[10px] font-bold uppercase tracking-wider border-2 border-ink text-ink bg-surface">
                      {p.probRating}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/contest/${contestCode}/problem/${p.probCode}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 border-2 border-ink bg-surface hover:bg-ink hover:text-canvas text-ink font-bold font-mono uppercase text-[10px] tracking-wider rounded-md transition-colors shadow-[2px_2px_0_0_#17181A] hover:shadow-none translate-y-0 hover:translate-y-[2px] translate-x-0 hover:translate-x-[2px]"
                    >
                      Solve
                      <ArrowRight className="size-3" />
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

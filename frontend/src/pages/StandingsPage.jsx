import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/User.jsx";
import { toast } from "react-toastify";
import { Trophy, RefreshCw, Users, CheckCircle2, ArrowRight } from "lucide-react";
import AnnotationMarker from "../components/AnnotationMarker.jsx";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtTime = (minutes) => {
  if (minutes === null || minutes === undefined) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${String(m).padStart(2, "0")}m` : `${m}m`;
};

// ─── Problem Cell ────────────────────────────────────────────────────────────

const ProblemCell = ({ cell }) => {
  if (!cell || (cell.attempts === 0 && cell.verdict === null)) {
    return (
      <td className="p-3 text-center border-r border-ink/10">
        <span className="text-ink/20 font-mono text-xs">—</span>
      </td>
    );
  }

  if (cell.verdict === "AC") {
    return (
      <td className="p-3 text-center border-r border-ink/10 bg-lime/10">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-xs font-bold text-ink">
            +{cell.attempts > 1 ? cell.attempts - 1 : ""}
          </span>
          <span className="font-mono text-[10px] text-ink-muted font-bold">
            {fmtTime(cell.time)}
          </span>
        </div>
      </td>
    );
  }

  // Wrong / TLE / CE — not yet solved
  return (
    <td className="p-3 text-center border-r border-ink/10 bg-accentCoral/10">
      <span className="font-mono text-xs font-bold text-accentCoral">
        -{cell.attempts}
      </span>
    </td>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const StandingsPage = () => {
  const { contestCode } = useParams();
  const location = useLocation();
  const { userData } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [contestName, setContestName]   = useState("");
  const [standings, setStandings]       = useState([]);
  const [problemIndices, setProblemIndices] = useState([]);
  const [contestEnd, setContestEnd]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastRefresh, setLastRefresh]   = useState(null);
  const intervalRef = useRef(null);

  const isLive = () => contestEnd && new Date() < new Date(contestEnd);

  const fetchStandings = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(`${apiUrl}/contest/${contestCode}/standings`);
      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to load standings");
        toast.error("Failed to load standings");
        return;
      }

      setContestName(data.contestName || "");
      setStandings(data.standings || []);
      setProblemIndices(data.problemIndices || []);
      setContestEnd(data.contestEnd || null);
      setLastRefresh(new Date());
    } catch (err) {
      setError("Server error while loading standings");
      toast.error("Server error while loading standings");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Initial fetch + live polling every 60s during active contest
  useEffect(() => {
    fetchStandings();

    intervalRef.current = setInterval(() => {
      if (isLive()) {
        fetchStandings(true); // silent refresh
      } else {
        clearInterval(intervalRef.current);
      }
    }, 60000);

    return () => clearInterval(intervalRef.current);
  }, [contestCode]);

  // Navigation tab definitions
  const basePath = `/contest/${contestCode}`;
  const tabs = [
    { label: "Problems",       href: basePath },
    { label: "My Submissions", href: `${basePath}/submissions/my` },
    { label: "Standings",      href: `${basePath}/standings` },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-canvas">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-ink" />
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-canvas">
        <h2 className="text-center text-accentCoral font-bold font-mono text-xl">{error}</h2>
      </div>
    );

  const totalSolved = standings.reduce((acc, row) => acc + row.solved, 0);

  return (
    <div className="w-[90%] max-w-6xl mx-auto py-12 bg-canvas min-h-[80vh] blueprint-grid">

      {/* Navigation Tabs */}
      <div className="flex gap-6 border-b-2 border-ink/20 mb-8 font-mono text-[10px] font-bold uppercase tracking-wider">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            to={tab.href}
            className={`pb-3 border-b-2 transition-all ${
              location.pathname === tab.href
                ? "text-ink border-ink"
                : "text-ink-muted border-transparent hover:text-ink hover:border-ink/50"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Contest Title Card */}
      <div className="border-2 border-ink bg-surface shadow-[4px_4px_0_0_#17181A] p-6 rounded-lg mb-8 relative overflow-hidden">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-ink tracking-tight">
              {contestName || contestCode} — Standings
            </h1>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">
              Contest Code: {contestCode}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isLive() && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-ink bg-lime text-ink text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-ink animate-pulse" />
                Live Contest
              </span>
            )}
            <button
              onClick={() => fetchStandings()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-ink bg-surface hover:bg-ink hover:text-canvas text-ink font-mono text-[10px] font-bold uppercase tracking-wider transition-colors shadow-[2px_2px_0_0_#17181A] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]"
            >
              <RefreshCw className="size-3" />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t-2 border-ink/10">
          <div className="flex items-center gap-2 text-ink">
            <Users className="size-4 text-ink-muted" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Registered:</span>
            <span className="font-mono text-sm font-bold">{standings.length}</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <CheckCircle2 className="size-4 text-lime" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-ink-muted">Total ACs:</span>
            <span className="font-mono text-sm font-bold">{totalSolved}</span>
          </div>
          {lastRefresh && (
            <div className="col-span-2 sm:col-span-1 text-right sm:text-right">
              <span className="text-[10px] font-mono text-ink-muted uppercase tracking-wider">
                Synced at {lastRefresh.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Header Label */}
      <div className="flex items-center mb-5 gap-2">
        <AnnotationMarker label="STANDINGS & LEADERBOARD" />
      </div>

      {/* Empty state */}
      {standings.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-ink rounded-lg bg-surface">
          <Trophy className="size-10 text-ink-muted mx-auto mb-4" />
          <p className="text-ink-muted font-mono font-bold uppercase tracking-wider text-sm">
            No participants yet
          </p>
          <p className="text-ink-muted font-mono text-xs mt-2">
            Standings will update automatically as soon as registered users submit solutions.
          </p>
        </div>
      ) : (
        <div className="border-2 border-ink bg-surface shadow-[4px_4px_0_0_#17181A] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">

              {/* Table Head */}
              <thead className="border-b-2 border-ink bg-canvas/60">
                <tr>
                  <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20 w-14">
                    #
                  </th>
                  <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-left border-r-2 border-ink/20 min-w-[160px]">
                    Participant
                  </th>
                  <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20 w-20">
                    Solved
                  </th>
                  <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20 w-24">
                    Penalty
                  </th>
                  {problemIndices.map((idx) => (
                    <th
                      key={idx}
                      className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r border-ink/10 w-24 hover:bg-ink/5"
                    >
                      <Link
                        to={`/contest/${contestCode}/problem/${contestCode}${idx}`}
                        className="hover:underline flex items-center justify-center gap-1"
                        title={`View problem ${idx}`}
                      >
                        {idx}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {standings.map((row, i) => {
                  const isMe = userData && (userData.username === row.username || userData._id === row.userId);
                  return (
                    <tr
                      key={row.userId || i}
                      className={`border-b border-ink/20 transition-colors last:border-0 ${
                        isMe
                          ? "bg-lime/20 border-l-4 border-l-ink font-semibold"
                          : "hover:bg-ink/5"
                      }`}
                    >
                      {/* Rank */}
                      <td className="p-4 text-center border-r-2 border-ink/20">
                        {row.rank <= 3 ? (
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full border-2 border-ink font-mono font-bold text-xs ${
                              row.rank === 1
                                ? "bg-[#FFD700] text-ink"
                                : row.rank === 2
                                ? "bg-[#C0C0C0] text-ink"
                                : "bg-[#CD7F32] text-ink"
                            }`}
                          >
                            {row.rank}
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-ink-muted text-sm">
                            {row.rank}
                          </span>
                        )}
                      </td>

                      {/* Username */}
                      <td className="p-4 border-r-2 border-ink/20">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/profile/${row.username}`}
                            className="font-bold font-mono text-sm text-ink hover:underline"
                          >
                            {row.username}
                          </Link>
                          {isMe && (
                            <span className="text-[9px] font-mono font-bold text-ink bg-lime px-1.5 py-0.5 border border-ink uppercase">
                              you
                            </span>
                          )}
                          {!row.isRated && (
                            <span className="text-[9px] font-mono font-bold text-ink-muted bg-canvas px-1.5 py-0.5 border border-ink/30 uppercase">
                              unrated
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Solved */}
                      <td className="p-4 text-center border-r-2 border-ink/20">
                        <span className="font-mono font-bold text-ink text-sm">
                          {row.solved}
                        </span>
                      </td>

                      {/* Penalty */}
                      <td className="p-4 text-center border-r-2 border-ink/20">
                        <span className="font-mono font-bold text-ink-muted text-sm">
                          {row.solved > 0 ? row.penalty : "—"}
                        </span>
                      </td>

                      {/* Problem cells */}
                      {problemIndices.map((idx) => (
                        <ProblemCell key={idx} cell={row.problems?.[idx]} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend & Scoring Explanations */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-[10px] font-mono text-ink-muted uppercase tracking-wider p-4 bg-surface border-2 border-ink/20 rounded-md">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-lime border border-ink" />
            Accepted (+wrong attempts, time)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 bg-accentCoral border border-ink" />
            Unsolved (-attempts)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="font-bold">—</span>
            Untouched
          </span>
        </div>
        <div className="text-right">
          ICPC Rules: Penalty = Solve time (min) + 20min per wrong submission
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;

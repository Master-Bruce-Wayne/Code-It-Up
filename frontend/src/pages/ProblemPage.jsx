import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock, Cpu, Tag, ArrowRight, BookOpen, AlertCircle, Copy, Check } from "lucide-react";

const ProblemPage = () => {
  const location = useLocation();
  const { probCode, contestCode } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/getProb/${probCode}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load problem");
          toast.error("Failed to load problem");
        } else {
          setProblem(data.problem);
        }
      } catch (err) {
        setError("Server error while fetching problem");
        toast.error("Server error while fetching problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [probCode]);

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    toast.info("Sample input copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-ink mb-4"></div>
          <h2 className="text-xl font-bold font-mono text-ink uppercase tracking-wider">Loading Problem...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-canvas px-4">
        <div className="max-w-md w-full border-2 border-ink bg-surface rounded-lg p-6 text-center shadow-[4px_4px_0_0_#17181A]">
          <AlertCircle className="size-10 text-accentCoral mx-auto mb-3" />
          <h2 className="text-ink text-lg font-bold font-mono mb-1">Access Denied</h2>
          <p className="text-ink-soft text-sm font-normal">{error}</p>
        </div>
      </div>
    );

  if (!problem) return null;

  // Resolve return URL
  const submitUrl = contestCode ? `/contest/${contestCode}/problem/${probCode}/submit` : `/problemset/problem/${probCode}/submit`;
  const subMyUrl = contestCode ? `/contest/${contestCode}/submissions/my` : `/problemset/problem/${probCode}/submissions/my`;

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-12 bg-canvas min-h-screen blueprint-grid">

      {/* Navigation Tabs */}
      <div className="flex gap-6 border-b-2 border-ink mb-8 text-sm font-bold font-mono uppercase tracking-wide">
        <Link
          to={location.pathname}
          className="pb-3 text-ink border-b-4 border-ink transition-all"
        >
          Problem Statement
        </Link>

        <Link
          to={submitUrl}
          className="pb-3 text-ink-muted hover:text-ink transition-all"
        >
          Submit Code
        </Link>

        <Link
          to={subMyUrl}
          className="pb-3 text-ink-muted hover:text-ink transition-all"
        >
          My Submissions
        </Link>
      </div>

      {/* Grid: Details and Main description */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Column: Statement & Samples */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Description */}
          <div className="border-2 border-ink bg-surface p-6 rounded-lg space-y-3">
            <h1 className="text-3xl font-bold font-mono text-ink tracking-tight">{problem.probName}</h1>
            
            {problem.probTags?.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                <Tag className="size-3.5 text-ink-muted flex-shrink-0" />
                {problem.probTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[0.7rem] bg-canvas-alt border border-divider text-ink-soft rounded-md font-mono font-bold uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Statement */}
          <section className="border-2 border-ink bg-surface p-6 rounded-lg">
            <h2 className="text-xl font-bold font-mono text-ink mb-3">Problem Description</h2>
            <div className="text-ink-soft font-mono whitespace-pre-line leading-relaxed font-normal text-sm md:text-base">
              {problem.probStatement}
            </div>
          </section>

          {/* Input Format */}
          <section className="border-2 border-ink bg-surface p-6 rounded-lg">
            <h2 className="text-lg font-bold font-mono text-ink mb-2">Input Format</h2>
            <p className="text-ink-soft font-mono whitespace-pre-line text-sm leading-relaxed">
              {problem.inputFormat}
            </p>
          </section>

          {/* Output Format */}
          <section className="border-2 border-ink bg-surface p-6 rounded-lg">
            <h2 className="text-lg font-bold font-mono text-ink mb-2">Output Format</h2>
            <p className="text-ink-soft font-mono whitespace-pre-line text-sm leading-relaxed">
              {problem.outputFormat}
            </p>
          </section>

          {/* Sample Tests */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">Sample Tests</h2>

            {problem.samples?.length === 0 ? (
              <p className="text-ink-muted text-sm font-mono font-bold uppercase tracking-wider">No sample tests available.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {problem.samples?.map((s, i) => (
                  <div
                    key={i}
                    className="window-chrome"
                  >
                    <div className="window-chrome-header flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="window-chrome-dots">
                          <div className="window-chrome-dot" />
                          <div className="window-chrome-dot" />
                          <div className="window-chrome-dot" />
                        </div>
                        <span className="text-[11px] font-mono text-ink-muted font-bold uppercase tracking-wider ml-2">Sample #{i + 1}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(s.input, i)}
                        className="p-1.5 rounded-md border-2 border-ink bg-surface hover:bg-canvas-alt text-ink transition-all cursor-pointer"
                        title="Copy input"
                      >
                        {copiedIndex === i ? <Check className="size-3.5 text-accentBlue" /> : <Copy className="size-3.5" />}
                      </button>
                    </div>

                    <div className="p-5 bg-surface grid md:grid-cols-2 gap-4">
                      {/* Input container */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-wider block">Input</span>
                        <pre className="bg-canvas border border-ink text-ink-soft p-4 rounded-md font-mono text-sm overflow-x-auto select-all h-full">
                          {s.input}
                        </pre>
                      </div>

                      {/* Output container */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono font-bold text-ink-muted uppercase tracking-wider block">Expected Output</span>
                        <pre className="bg-canvas border border-ink text-ink-soft p-4 rounded-md font-mono text-sm overflow-x-auto h-full">
                          {s.output}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          {/* Action Card */}
          <div className="border-2 border-ink bg-surface p-6 rounded-lg space-y-4">
            <h3 className="text-lg font-bold text-ink tracking-tight">Solve Challenge</h3>
            <p className="text-ink-soft text-xs font-normal">
              Read the details carefully, verify constraints, and write your solution in our editor.
            </p>
            <Link
              to={submitUrl}
              className="flex items-center justify-center gap-1.5 w-full bg-lime border-2 border-ink text-ink py-3 rounded-md font-mono font-bold text-[0.85rem] uppercase tracking-wide shadow-[4px_4px_0_0_#17181A] hover:bg-lime-hover hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
            >
              Code Solution
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Limits Card */}
          <div className="border-2 border-ink bg-surface p-6 rounded-lg space-y-4">
            <h3 className="text-xs font-bold text-ink font-mono uppercase tracking-wider">Constraints & Limits</h3>
            <div className="flex flex-col gap-3.5 text-sm text-ink font-normal">
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-ink-soft" />
                <div>
                  <span className="block text-ink-muted text-[10px] font-bold font-mono uppercase tracking-wider">Time Limit</span>
                  <span className="text-ink font-semibold">{problem.timeLimit} ms</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Cpu className="size-4 text-ink-soft" />
                <div>
                  <span className="block text-ink-muted text-[10px] font-bold font-mono uppercase tracking-wider">Memory Limit</span>
                  <span className="text-ink font-semibold">{problem.memoryLimit} MB</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <AlertCircle className="size-4 text-ink-soft" />
                <div>
                  <span className="block text-ink-muted text-[10px] font-bold font-mono uppercase tracking-wider">Problem Difficulty</span>
                  <span className="text-ink font-semibold">{problem.probRating || "Unrated"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Constraints Statement */}
          <div className="border-2 border-ink bg-surface p-6 rounded-lg space-y-2">
            <h3 className="text-xs font-bold text-ink font-mono uppercase tracking-wider">Additional Constraints</h3>
            <p className="text-ink-soft font-mono whitespace-pre-line text-xs leading-relaxed font-normal">
              {problem.constraints}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;

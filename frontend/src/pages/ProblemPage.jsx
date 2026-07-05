import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Clock, Cpu, Tag, ArrowRight, BookOpen, AlertCircle, Copy, Check } from "lucide-react";
import { gsap } from "gsap";

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
          // GSAP fade entrance
          setTimeout(() => {
            gsap.from(".fade-block", {
              y: 15,
              opacity: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out"
            });
          }, 50);
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-400">Loading Problem...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4">
        <div className="max-w-md w-full border border-red-500/20 bg-red-500/5 rounded-2xl p-6 text-center">
          <AlertCircle className="size-10 text-red-400 mx-auto mb-3" />
          <h2 className="text-red-400 text-lg font-bold mb-1">Access Denied</h2>
          <p className="text-gray-400 text-sm font-normal">{error}</p>
        </div>
      </div>
    );

  if (!problem) return null;

  // Resolve return URL
  const listUrl = contestCode ? `/contest/${contestCode}` : "/problemset";
  const submitUrl = contestCode ? `/contest/${contestCode}/problem/${probCode}/submit` : `/problemset/problem/${probCode}/submit`;
  const subMyUrl = contestCode ? `/contest/${contestCode}/submissions/my` : `/problemset/problem/${probCode}/submissions/my`; // Wait, actually the route in main.jsx:
  // /contest/:contestCode/submissions/my OR /problemset/problem/:probCode/submissions/my

  return (
    <div className="w-[90%] max-w-7xl mx-auto py-12 bg-slate-950 min-h-screen">

      {/* Navigation Tabs */}
      <div className="flex gap-6 border-b border-slate-900 mb-8 text-sm font-semibold animate-fade-in">
        <Link
          to={location.pathname}
          className="pb-3 text-indigo-400 border-b-2 border-indigo-400 transition-all"
        >
          Problem Statement
        </Link>

        <Link
          to={submitUrl}
          className="pb-3 text-gray-500 hover:text-gray-300 transition-all"
        >
          Submit Code
        </Link>

        <Link
          to={subMyUrl}
          className="pb-3 text-gray-500 hover:text-gray-300 transition-all"
        >
          My Submissions
        </Link>
      </div>

      {/* Grid: Details and Main description */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Column: Statement & Samples */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Description */}
          <div className="border border-slate-900 bg-slate-900/10 backdrop-blur-sm p-6 rounded-2xl space-y-3 fade-block">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{problem.probName}</h1>
            
            {problem.probTags?.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                <Tag className="size-3.5 text-gray-500 flex-shrink-0" />
                {problem.probTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-xs bg-slate-950 border border-slate-800 text-gray-400 rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Statement */}
          <section className="border border-slate-900 bg-slate-900/20 p-6 rounded-2xl fade-block">
            <h2 className="text-xl font-bold text-white mb-3">Problem Description</h2>
            <div className="text-gray-300 whitespace-pre-line leading-relaxed font-normal text-sm md:text-base">
              {problem.probStatement}
            </div>
          </section>

          {/* Input Format */}
          <section className="border border-slate-900 bg-slate-900/20 p-6 rounded-2xl fade-block">
            <h2 className="text-lg font-bold text-white mb-2">Input Format</h2>
            <p className="text-gray-400 whitespace-pre-line text-sm leading-relaxed">
              {problem.inputFormat}
            </p>
          </section>

          {/* Output Format */}
          <section className="border border-slate-900 bg-slate-900/20 p-6 rounded-2xl fade-block">
            <h2 className="text-lg font-bold text-white mb-2">Output Format</h2>
            <p className="text-gray-400 whitespace-pre-line text-sm leading-relaxed">
              {problem.outputFormat}
            </p>
          </section>

          {/* Sample Tests */}
          <section className="space-y-4 fade-block">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Sample Tests</h2>

            {problem.samples?.length === 0 ? (
              <p className="text-gray-500 text-sm">No sample tests available.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {problem.samples?.map((s, i) => (
                  <div
                    key={i}
                    className="border border-slate-900 bg-slate-900/10 rounded-2xl p-5 space-y-4"
                  >
                    <p className="text-sm font-bold text-gray-300 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-indigo-500" />
                      Sample Case #{i + 1}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Input container */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input</span>
                          <button
                            onClick={() => copyToClipboard(s.input, i)}
                            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-gray-500 hover:text-gray-300 transition-all cursor-target"
                            title="Copy input"
                          >
                            {copiedIndex === i ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                          </button>
                        </div>
                        <pre className="bg-slate-950 border border-slate-900 text-rose-400/90 p-4 rounded-xl font-mono text-sm overflow-x-auto select-all">
                          {s.input}
                        </pre>
                      </div>

                      {/* Output container */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Expected Output</span>
                        <pre className="bg-slate-950 border border-slate-900 text-emerald-400/90 p-4 rounded-xl font-mono text-sm overflow-x-auto">
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
          <div className="border border-slate-900 bg-slate-900/30 backdrop-blur-sm p-6 rounded-2xl space-y-4 fade-block">
            <h3 className="text-lg font-bold text-white tracking-tight">Solve Challenge</h3>
            <p className="text-gray-400 text-xs font-normal">
              Read the details carefully, verify constraints, and write your solution in our editor.
            </p>
            <Link
              to={submitUrl}
              className="flex items-center justify-center gap-1.5 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 cursor-target hover:-translate-y-0.5 transition-all"
            >
              Code Solution
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* Limits Card */}
          <div className="border border-slate-900 bg-slate-900/30 backdrop-blur-sm p-6 rounded-2xl space-y-4 fade-block">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Constraints & Limits</h3>
            <div className="flex flex-col gap-3.5 text-sm text-gray-300 font-normal">
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-indigo-400" />
                <div>
                  <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Time Limit</span>
                  <span className="text-gray-200 font-semibold">{problem.timeLimit} ms</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Cpu className="size-4 text-purple-400" />
                <div>
                  <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Memory Limit</span>
                  <span className="text-gray-200 font-semibold">{problem.memoryLimit} MB</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <AlertCircle className="size-4 text-amber-400" />
                <div>
                  <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-wider">Problem Difficulty</span>
                  <span className="text-gray-200 font-semibold">{problem.probRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Constraints Statement */}
          <div className="border border-slate-900 bg-slate-900/30 backdrop-blur-sm p-6 rounded-2xl space-y-2 fade-block">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Additional Constraints</h3>
            <p className="text-gray-400 whitespace-pre-line text-xs leading-relaxed font-normal">
              {problem.constraints}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;

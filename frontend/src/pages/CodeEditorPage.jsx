import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/User.jsx';
import Editor from "@monaco-editor/react";
import { toast } from 'react-toastify';
import { Code2, Terminal, Send, Play, RefreshCw, ArrowLeft, FileText, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

const CodeEditorPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { userData } = useAuth();
    const { probCode, contestCode } = useParams();
    const navigate = useNavigate();

    // Editor & Language states
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here
    cout << "Hello, World!" << endl;
    return 0;
}`);
    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);
    const [leftTab, setLeftTab] = useState('description'); // 'description' | 'submissions'
    
    // Problem and Submissions details
    const [problem, setProblem] = useState(null);
    const [problemLoading, setProblemLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    
    // Custom execution console states
    const [customInput, setCustomInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [consoleVerdict, setConsoleVerdict] = useState('');
    const [consoleOpen, setConsoleOpen] = useState(false);
    const [consoleTab, setConsoleTab] = useState('input'); // 'input' | 'output'

    // Fetch problem details and previous submissions
    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await fetch(`${apiUrl}/problem/getProb/${probCode}`);
                const data = await res.json();
                if (data.success) {
                    setProblem(data.problem);
                } else {
                    toast.error("Failed to load problem statement");
                }
            } catch (err) {
                console.error("Error fetching problem:", err);
            } finally {
                setProblemLoading(false);
            }
        };

        fetchProblem();
    }, [probCode]);

    const fetchSubmissions = async () => {
        if (!userData) return;
        try {
            const res = await fetch(`${apiUrl}/submission/problem/${probCode}/user/${userData.username}`);
            const data = await res.json();
            if (data.success) {
                setSubmissions(data.submissions || []);
            }
        } catch (err) {
            console.error("Error fetching user submissions:", err);
        }
    };

    useEffect(() => {
        if (leftTab === 'submissions') {
            fetchSubmissions();
        }
    }, [leftTab, userData]);

    const handleRunCode = async () => {
        try {
            setRunning(true);
            setConsoleOpen(true);
            setConsoleTab('output');
            setConsoleVerdict('Running...');
            setConsoleOutput('');

            const res = await axios.post(`${apiUrl}/submission/run`, {
                code,
                language,
                input: customInput
            });

            if (res.data.success) {
                setConsoleVerdict(res.data.verdict);
                setConsoleOutput(res.data.output);
            } else {
                setConsoleVerdict('Error');
                setConsoleOutput(res.data.message || 'Execution error');
            }
        } catch (err) {
            setConsoleVerdict('Error');
            setConsoleOutput(err.message);
            toast.error("Code run failed.");
        } finally {
            setRunning(false);
        }
    };

    const handleSubmit = async () => {
        if (!userData) {
            toast.error("Please login to submit code");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${apiUrl}/submission/submit`, {
                code, language, probCode, 
                username: userData.username, 
                userId: userData._id
            });

            if (!res.data.success) {
                toast.error(res.data.message || "Failed to submit code to backend");
            } else {
                const isAccepted = res.data.verdict === 'AC';
                if (isAccepted) {
                    toast.success("Accepted! (AC) 🎉");
                } else {
                    toast.warn(`Submission evaluated: ${res.data.verdict}`);
                }
                // Switch to submissions tab to view history
                setLeftTab('submissions');
                fetchSubmissions();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCode(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here
    cout << "Hello, World!" << endl;
    return 0;
}`);
        toast.info("Editor reset");
    };

    const getVerdictColor = (v) => {
        if (v === 'AC') return 'text-emerald-400';
        if (v === 'WA') return 'text-rose-400';
        if (v === 'TLE') return 'text-amber-500';
        if (v === 'CE') return 'text-yellow-500';
        return 'text-red-400';
    };

    const getVerdictBg = (v) => {
        if (v === 'AC') return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
        if (v === 'WA') return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
        if (v === 'TLE') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
        return 'bg-slate-800 border-slate-700 text-slate-400';
    };

    const backUrl = contestCode ? `/contest/${contestCode}` : `/problemset/problem/${probCode}`;

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col h-screen text-gray-200">
            {/* Header / Topbar */}
            <div className="h-14 border-b border-slate-900 bg-slate-950 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <Link to={backUrl} className="p-1.5 rounded-lg hover:bg-slate-900 text-gray-400 hover:text-white transition-all">
                        <ArrowLeft className="size-4" />
                    </Link>
                    <span className="h-4 w-[1px] bg-slate-800" />
                    <h1 className="font-extrabold text-sm text-white tracking-tight">
                        Coding Workspace • <span className="text-indigo-400">{probCode}</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-gray-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold focus:outline-none"
                    >
                        <option value="cpp">C++ (g++)</option>
                        <option value="java" disabled>Java (Soon)</option>
                        <option value="python" disabled>Python (Soon)</option>
                    </select>

                    <button
                        onClick={handleReset}
                        className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-gray-400 hover:text-white transition-all cursor-target"
                        title="Reset code"
                    >
                        <RefreshCw className="size-4" />
                    </button>
                </div>
            </div>

            {/* Split Panel */}
            <div className="flex flex-1 overflow-hidden shrink min-h-0">
                
                {/* Left Side: Statement/Submissions */}
                <div className="w-[45%] border-r border-slate-900 flex flex-col h-full bg-slate-950">
                    <div className="h-11 border-b border-slate-900 bg-slate-950/40 flex items-center px-4 gap-4 shrink-0">
                        <button
                          onClick={() => setLeftTab('description')}
                          className={`h-full px-2 text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 border-b-2 ${
                            leftTab === 'description' ? 'text-indigo-400 border-indigo-400' : 'text-gray-500 border-transparent hover:text-gray-300'
                          }`}
                        >
                            <FileText className="size-3.5" />
                            Description
                        </button>
                        <button
                          onClick={() => setLeftTab('submissions')}
                          className={`h-full px-2 text-xs font-bold tracking-wide uppercase transition-all flex items-center gap-1.5 border-b-2 ${
                            leftTab === 'submissions' ? 'text-indigo-400 border-indigo-400' : 'text-gray-500 border-transparent hover:text-gray-300'
                          }`}
                        >
                            <Terminal className="size-3.5" />
                            Submissions
                        </button>
                    </div>

                    {/* Left Pane Content scrollable */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {problemLoading ? (
                            <div className="text-center py-10 text-gray-500 font-medium">Loading description...</div>
                        ) : leftTab === 'description' && problem ? (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">{problem.probName}</h2>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                      <span className="font-semibold text-gray-400">Limits:</span>
                                      <span>Time: {problem.timeLimit}ms</span>
                                      <span>Memory: {problem.memoryLimit}MB</span>
                                      <span>Rating: {problem.probRating}</span>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-slate-900" />

                                <div className="space-y-4">
                                    <div className="text-gray-300 whitespace-pre-line leading-relaxed text-sm md:text-base font-normal">
                                        {problem.probStatement}
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Input Format</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                        {problem.inputFormat}
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Output Format</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                        {problem.outputFormat}
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Constraints</h4>
                                    <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                                        {problem.constraints}
                                    </p>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Sample Cases</h3>
                                    {problem.samples?.map((s, idx) => (
                                        <div key={idx} className="border border-slate-900 bg-slate-900/10 rounded-xl p-4 space-y-3">
                                            <p className="text-xs font-bold text-gray-400">Case #{idx + 1}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <span className="block text-gray-500 font-bold uppercase tracking-wider mb-1">Input</span>
                                                    <pre className="bg-slate-950 border border-slate-900 text-rose-400 p-3 rounded-lg overflow-x-auto select-all font-mono">
                                                        {s.input}
                                                    </pre>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-500 font-bold uppercase tracking-wider mb-1">Expected Output</span>
                                                    <pre className="bg-slate-950 border border-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto font-mono">
                                                        {s.output}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : leftTab === 'submissions' ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white tracking-tight">Your Previous Submissions</h3>
                                {submissions.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No submissions recorded for this problem.</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {submissions.map((s, idx) => (
                                            <div key={s._id} className="border border-slate-900 bg-slate-900/10 p-4 rounded-xl flex items-center justify-between text-sm">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getVerdictBg(s.verdict)}`}>
                                                            {s.verdict}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-mono">{s.language}</span>
                                                    </div>
                                                    <span className="block text-[11px] text-gray-500">{new Date(s.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Right Side: Monaco & Console */}
                <div className="flex-1 flex flex-col h-full bg-slate-950 relative min-w-0">
                    
                    {/* Monaco Editor Container */}
                    <div className="flex-1 min-h-0 bg-slate-950">
                        <Editor
                            height="100%"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value ?? "")}
                            options={{
                                fontSize: 15,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                tabSize: 4,
                                fontFamily: 'JetBrains Mono, Courier New, monospace',
                                cursorStyle: 'line',
                                insertSpaces: true,
                            }}
                        />
                    </div>

                    {/* Bottom Console Panel Drawer */}
                    {consoleOpen && (
                        <div className="h-56 border-t border-slate-900 bg-slate-950 flex flex-col shrink-0 select-none">
                            <div className="h-10 border-b border-slate-900 bg-slate-950/40 flex items-center justify-between px-4">
                                <div className="flex gap-4 h-full">
                                    <button
                                      onClick={() => setConsoleTab('input')}
                                      className={`h-full text-xs font-bold uppercase tracking-wide border-b-2 flex items-center ${
                                        consoleTab === 'input' ? 'text-indigo-400 border-indigo-400' : 'text-gray-500 border-transparent hover:text-gray-300'
                                      }`}
                                    >
                                        Custom Input
                                    </button>
                                    <button
                                      onClick={() => setConsoleTab('output')}
                                      className={`h-full text-xs font-bold uppercase tracking-wide border-b-2 flex items-center ${
                                        consoleTab === 'output' ? 'text-indigo-400 border-indigo-400' : 'text-gray-500 border-transparent hover:text-gray-300'
                                      }`}
                                    >
                                        Run Result
                                    </button>
                                </div>
                                <button 
                                  onClick={() => setConsoleOpen(false)}
                                  className="text-gray-500 hover:text-gray-300 text-xs font-bold hover:underline cursor-target"
                                >
                                  Close
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-sm">
                                {consoleTab === 'input' ? (
                                    <textarea
                                      value={customInput}
                                      onChange={(e) => setCustomInput(e.target.value)}
                                      placeholder="Provide standard input (stdin) for code execution..."
                                      className="w-full h-full bg-slate-950 text-gray-200 border-0 outline-none resize-none placeholder-gray-600 focus:ring-0"
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-500 font-bold">VERDICT:</span>
                                            <span className={`font-extrabold uppercase ${getVerdictColor(consoleVerdict)}`}>
                                                {consoleVerdict}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 font-bold mb-1">STDOUT:</span>
                                            <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                {consoleOutput || "(No stdout/Empty output)"}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Bottom Toolbar Action buttons */}
                    <div className="h-14 border-t border-slate-900 bg-slate-950/60 flex items-center justify-between px-6 shrink-0 select-none">
                        <button
                          onClick={() => setConsoleOpen(!consoleOpen)}
                          className="flex items-center gap-1 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/60 transition-all font-bold text-xs cursor-target"
                        >
                            <Terminal className="size-3.5" />
                            Console
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleRunCode}
                                disabled={running || loading}
                                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-gray-200 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 border border-slate-800 disabled:opacity-50 cursor-target"
                            >
                                <Play className="size-3.5 fill-gray-200" />
                                {running ? "Running..." : "Run"}
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading || running}
                                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-target"
                            >
                                <Send className="size-3.5" />
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default CodeEditorPage;

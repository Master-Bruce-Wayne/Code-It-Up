import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/User.jsx';
import Editor from "@monaco-editor/react";
import { toast } from 'react-toastify';
import { Play, Send, RefreshCw } from 'lucide-react';

const CodeEditorPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { userData } = useAuth();
    const { probCode, contestCode } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Editor & Language states
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState(`#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    // Write your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`);
    const [loading, setLoading] = useState(false);
    const [running, setRunning] = useState(false);
    
    // Custom execution console states
    const [customInput, setCustomInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState('');
    const [consoleVerdict, setConsoleVerdict] = useState('');
    const [hasRun, setHasRun] = useState(false);

    const handleRunCode = async () => {
        try {
            setRunning(true);
            setHasRun(true);
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
                navigate(subMyUrl);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setCode(`#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n    // Write your code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}`);
        toast.info("Editor reset");
    };

    const getVerdictColor = (v) => {
        if (v === 'AC') return 'text-lime';
        if (v === 'WA') return 'text-accentCoral';
        if (v === 'TLE') return 'text-accentPurple';
        if (v === 'CE') return 'text-accentCoral';
        return 'text-accentCoral';
    };

    const probUrl = contestCode ? `/contest/${contestCode}/problem/${probCode}` : `/problemset/problem/${probCode}`;
    const submitUrl = location.pathname;
    const subMyUrl = contestCode ? `/contest/${contestCode}/submissions/my` : `/problemset/problem/${probCode}/submissions/my`;

    return (
        <div className="w-[90%] max-w-7xl mx-auto py-12 bg-canvas min-h-screen blueprint-grid">
            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b-2 border-ink mb-8 text-sm font-bold font-mono uppercase tracking-wide">
                <Link
                  to={probUrl}
                  className="pb-3 text-ink-muted hover:text-ink transition-all"
                >
                  Problem Statement
                </Link>

                <Link
                  to={submitUrl}
                  className="pb-3 text-ink border-b-4 border-ink transition-all"
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

            <div className="space-y-6 max-w-4xl">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold font-mono text-ink tracking-tight">Submit Code for <span className="text-accentBlue">{probCode}</span></h1>
                    
                    <div className="flex items-center gap-3">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-surface border-2 border-ink text-ink px-4 py-2 rounded-md font-mono font-bold text-[0.85rem] focus:outline-none focus:shadow-[4px_4px_0_0_#17181A] transition-shadow uppercase tracking-wide"
                        >
                            <option value="cpp">C++ (g++)</option>
                            <option value="java" disabled>Java (Soon)</option>
                            <option value="python" disabled>Python (Soon)</option>
                        </select>

                        <button
                            onClick={handleReset}
                            className="p-2 rounded-md border-2 border-ink bg-surface hover:bg-canvas-alt text-ink transition-all cursor-pointer"
                            title="Reset code"
                        >
                            <RefreshCw className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Editor Container */}
                <div className="border-2 border-ink rounded-lg overflow-hidden h-[500px] shadow-[8px_8px_0_0_#17181A]">
                    <div className="bg-canvas-alt border-b-2 border-ink p-2 flex items-center gap-2">
                        <div className="flex gap-1.5 px-2">
                            <div className="size-3 rounded-full border border-ink bg-surface" />
                            <div className="size-3 rounded-full border border-ink bg-surface" />
                            <div className="size-3 rounded-full border border-ink bg-surface" />
                        </div>
                        <span className="text-ink-muted text-xs font-mono font-bold uppercase tracking-wider ml-2">editor.cpp</span>
                    </div>
                    <Editor
                        height="calc(100% - 42px)"
                        language={language}
                        theme="vs-light"
                        value={code}
                        onChange={(value) => setCode(value ?? "")}
                        options={{
                            fontSize: 14,
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

                {/* Custom Input / Output Area */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-ink font-mono font-bold uppercase tracking-wider text-[11px]">Custom Input (stdin)</label>
                        <textarea
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            placeholder="Provide standard input..."
                            className="w-full h-32 bg-surface border-2 border-ink rounded-md p-3 text-ink-soft font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0_0_#17181A] transition-shadow resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-ink font-mono font-bold uppercase tracking-wider text-[11px]">Execution Output</label>
                        <div className="w-full h-32 bg-canvas-alt border-2 border-ink rounded-md p-3 overflow-y-auto">
                            {!hasRun ? (
                                <span className="text-ink-muted font-mono text-sm">Run your code to see output...</span>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-ink-muted font-bold font-mono text-xs uppercase tracking-wider">Verdict:</span>
                                        <span className={`font-bold uppercase font-mono text-sm ${getVerdictColor(consoleVerdict)}`}>
                                            {consoleVerdict}
                                        </span>
                                    </div>
                                    <div>
                                        <pre className="text-ink-soft whitespace-pre-wrap font-mono text-sm">
                                            {consoleOutput || "(No stdout/Empty output)"}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-4 border-t-2 border-ink">
                    <button
                        onClick={handleRunCode}
                        disabled={running || loading}
                        className="flex items-center gap-1.5 bg-surface hover:bg-canvas-alt text-ink px-6 py-2.5 rounded-md font-mono font-bold text-sm uppercase tracking-wide border-2 border-ink disabled:opacity-50 transition-transform active:translate-y-[1px] cursor-pointer"
                    >
                        <Play className="size-4" />
                        {running ? "Running..." : "Run Code"}
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || running}
                        className="flex items-center gap-1.5 bg-lime hover:bg-lime-hover text-ink px-8 py-2.5 rounded-md font-mono font-bold text-sm uppercase tracking-wide border-2 border-ink shadow-[4px_4px_0_0_#17181A] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all cursor-pointer"
                    >
                        <Send className="size-4" />
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPage;

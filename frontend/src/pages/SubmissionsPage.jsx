import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/User';
import { toast } from 'react-toastify';
import { CheckCircle2, XCircle, Clock, AlertTriangle, FileCode } from 'lucide-react';

const SubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submissions, setSubmissions] = useState([]);
    const { probCode, contestCode } = useParams();
    const { userData, setUserData } = useAuth();
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (!userData) {
            const storedUser = localStorage.getItem("userData");
            if (storedUser) {
                setUserData(JSON.parse(storedUser));
            } else {
                navigate("/login");
            }
        }
    }, []);

    useEffect(() => {
        if (!userData) return;
        
        const fetchSubmissions = async () => {
            try {
                if (probCode) {
                    const res = await fetch(`${apiUrl}/submission/problem/${probCode}/user/${userData.username}`);
                    const data = await res.json();

                    if (!data.success) {
                        setError(data.message || "Failed to import submissions!");
                        toast.error("Failed to import submissions!");
                    } else {
                        setSubmissions(data.submissions || []);
                    }
                } else if (contestCode) {
                    const res = await fetch(`${apiUrl}/submission/contest/${contestCode}/user/${userData.username}`);
                    const data = await res.json();

                    if (!data.success) {
                        setError(data.message || "Failed to load contest submissions");
                        toast.error("Failed to load contest submissions!");
                    } else {
                        setSubmissions(data.result || []);
                    }
                } else {
                    toast.warn("No problem code or contest code provided!");
                }
            } catch (err) {
                setError("Failed to fetch user submissions! Try Again!");
                toast.error("Failed to fetch user submissions");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [userData, probCode, contestCode]);

    const getVerdictBadge = (v) => {
        if (v === "AC") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-3.5" />
                    ACCEPTED
                </span>
            );
        }
        if (v === "WA") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <XCircle className="size-3.5" />
                    WRONG ANSWER
                </span>
            );
        }
        if (v === "TLE") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="size-3.5" />
                    TIME LIMIT EXCEEDED
                </span>
            );
        }
        if (v === "CE") {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                    <AlertTriangle className="size-3.5" />
                    COMPILATION ERROR
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                {v}
            </span>
        );
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-400">Loading Submissions...</h2>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <h2 className="text-center text-red-500 text-xl font-semibold">{error}</h2>
            </div>
        );

    return (
        <div className="w-[90%] max-w-7xl mx-auto py-12 bg-slate-950 min-h-screen">
            <div className="mb-8 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                    <FileCode className="size-5" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">My Submissions</h1>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                        History for {probCode || contestCode}
                    </p>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                    <p className="text-gray-500 text-base font-semibold">No submissions recorded yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-900 rounded-2xl bg-slate-950 shadow-xl">
                    <table className="w-full border-collapse">
                        <thead className="border-b border-slate-900 bg-slate-900/20">
                            <tr className="text-center">
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">#</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500 text-left pl-6">Problem</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Language</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Verdict</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Submitted At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((s, idx) => (
                                <tr
                                    key={s._id}
                                    className="sub-row animate-fade-in-up text-center border-b border-slate-900 hover:bg-slate-900/10 transition-colors"
                                >
                                    <td className="p-4 font-extrabold text-gray-500">{idx + 1}</td>

                                    <td className="p-4 text-left pl-6 font-bold text-gray-200 hover:text-indigo-400 transition-colors">
                                        <Link to={`/problemset/problem/${s.problemCode}`}>
                                            {s.problem?.probName || s.problemCode}
                                        </Link>
                                    </td>

                                    <td className="p-4 text-gray-400 font-mono text-sm">
                                        {s.language}
                                    </td>

                                    <td className="p-4">
                                        {getVerdictBadge(s.verdict)}
                                    </td>

                                    <td className="p-4 text-gray-500 text-xs font-semibold">
                                        {new Date(s.createdAt).toLocaleString()}
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

export default SubmissionsPage;
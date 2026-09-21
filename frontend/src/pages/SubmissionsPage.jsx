import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/User';
import { toast } from 'react-toastify';
import AnnotationMarker from '../components/AnnotationMarker.jsx';

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
                        setError(data.message || "Failed to load submissions!");
                        toast.error("Failed to load submissions!");
                    } else {
                        // Sometimes the backend might wrap array in array, flatten it just in case
                        const flatSubs = Array.isArray(data.submissions) ? data.submissions.flat() : [];
                        setSubmissions(flatSubs);
                    }
                } else if (contestCode) {
                    const res = await fetch(`${apiUrl}/submission/contest/${contestCode}/user/${userData.username}`);
                    const data = await res.json();

                    if (!data.success) {
                        setError(data.message || "Failed to load contest submissions");
                        toast.error("Failed to load contest submissions!");
                    } else {
                        const flatSubs = Array.isArray(data.result) ? data.result.flat() : [];
                        setSubmissions(flatSubs);
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
        const baseClasses = "inline-flex items-center justify-center px-3 py-1 rounded-pill text-[10px] font-mono font-bold uppercase tracking-wider border-2 border-ink";
        if (v === "AC") {
            return (
                <span className={`${baseClasses} bg-lime text-ink`}>
                    ACCEPTED
                </span>
            );
        }
        if (v === "WA") {
            return (
                <span className={`${baseClasses} bg-accentCoral text-ink`}>
                    WRONG ANSWER
                </span>
            );
        }
        if (v === "TLE") {
            return (
                <span className={`${baseClasses} bg-accentBlue text-ink`}>
                    TIME LIMIT
                </span>
            );
        }
        if (v === "CE") {
            return (
                <span className={`${baseClasses} bg-[#FFD166] text-ink`}>
                    COMPILATION ERR
                </span>
            );
        }
        return (
            <span className={`${baseClasses} bg-surface text-ink-muted`}>
                {v}
            </span>
        );
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

    return (
        <div className="w-[90%] max-w-5xl mx-auto py-12 bg-canvas min-h-[80vh] blueprint-grid">
            <div className="mb-10 text-center">
                <div className="inline-block mb-4">
                    <AnnotationMarker label="SUBMISSIONS" />
                </div>
                <h1 className="text-4xl font-bold font-mono text-ink tracking-tight mb-2">My Submissions</h1>
                <p className="text-ink-soft font-mono text-sm uppercase tracking-wider">
                    History for {probCode || contestCode}
                </p>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-20 border-2 border-ink border-dashed rounded-md bg-surface">
                    <p className="text-ink-muted font-mono font-bold uppercase tracking-wider">No submissions recorded yet.</p>
                </div>
            ) : (
                <div className="border-2 border-ink rounded-lg bg-surface overflow-hidden shadow-[4px_4px_0_0_#17181A]">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="border-b-2 border-ink bg-canvas/50">
                                <tr>
                                    <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20">#</th>
                                    <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-left border-r-2 border-ink/20">Problem</th>
                                    <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20">Language</th>
                                    <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center border-r-2 border-ink/20">Verdict</th>
                                    <th className="p-4 font-mono font-bold text-[10px] uppercase tracking-wider text-ink text-center">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((s, idx) => (
                                    <tr
                                        key={s._id || idx}
                                        className="border-b border-ink/20 hover:bg-ink/5 transition-colors"
                                    >
                                        <td className="p-4 font-mono text-sm font-bold text-ink-muted text-center border-r-2 border-ink/20">{idx + 1}</td>

                                        <td className="p-4 text-left font-bold text-ink border-r-2 border-ink/20">
                                            <Link to={`/problemset/problem/${s.problemCode || s.probCode}`} className="hover:underline">
                                                {s.problem?.probName || s.problemCode || s.probCode}
                                            </Link>
                                        </td>

                                        <td className="p-4 font-mono text-sm font-bold text-ink text-center border-r-2 border-ink/20">
                                            {s.language}
                                        </td>

                                        <td className="p-4 text-center border-r-2 border-ink/20">
                                            {getVerdictBadge(s.verdict)}
                                        </td>

                                        <td className="p-4 text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider text-center">
                                            {new Date(s.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionsPage;
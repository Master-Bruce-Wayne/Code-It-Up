import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, Activity, Code, CheckCircle2, XCircle } from 'lucide-react';
import AnnotationMarker from '../components/AnnotationMarker.jsx';

const ProfilePage = () => {
  const { username } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${apiUrl}/submission/user/${username}`);
        const data = await res.json();
        if (data.success && data.submissions) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error("Error fetching user stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [username]);

  // Calculate stats
  const totalSubmissions = submissions.length;
  const acceptedSubmissions = submissions.filter(s => s.verdict === 'AC').length;
  const uniqueSolved = new Set(submissions.filter(s => s.verdict === 'AC').map(s => s.probCode)).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] bg-canvas">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-ink"></div>
      </div>
    );
  }

  return (
    <div className="w-[90%] max-w-5xl mx-auto py-12 bg-canvas min-h-[80vh] blueprint-grid">
      <div className="mb-10 text-center">
        <div className="inline-block mb-4">
          <AnnotationMarker label="USER PROFILE" />
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="size-20 bg-lime border-2 border-ink shadow-[4px_4px_0_0_#17181A] rounded-full flex items-center justify-center mb-4">
            <User className="size-10 text-ink" />
          </div>
          <h1 className="text-4xl font-bold font-mono text-ink tracking-tight mb-2">@{username}</h1>
          <p className="text-ink-soft font-mono text-sm uppercase tracking-wider">Coder / Developer</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {/* Stat Block 1 */}
        <div className="bg-surface border-2 border-ink p-4 rounded-md shadow-[4px_4px_0_0_#17181A]">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="size-4 text-ink-muted" />
            <span className="text-[10px] text-ink-muted font-mono font-bold uppercase tracking-wider">Total Subs</span>
          </div>
          <div className="text-3xl font-bold font-mono text-ink">{totalSubmissions}</div>
        </div>

        {/* Stat Block 2 */}
        <div className="bg-surface border-2 border-ink p-4 rounded-md shadow-[4px_4px_0_0_#17181A]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="size-4 text-lime" />
            <span className="text-[10px] text-ink-muted font-mono font-bold uppercase tracking-wider">Accepted</span>
          </div>
          <div className="text-3xl font-bold font-mono text-ink">{acceptedSubmissions}</div>
        </div>

        {/* Stat Block 3 */}
        <div className="bg-surface border-2 border-ink p-4 rounded-md shadow-[4px_4px_0_0_#17181A]">
          <div className="flex items-center gap-2 mb-2">
            <Code className="size-4 text-accentBlue" />
            <span className="text-[10px] text-ink-muted font-mono font-bold uppercase tracking-wider">Problems Solved</span>
          </div>
          <div className="text-3xl font-bold font-mono text-ink">{uniqueSolved}</div>
        </div>

        {/* Stat Block 4 */}
        <div className="bg-surface border-2 border-ink p-4 rounded-md shadow-[4px_4px_0_0_#17181A]">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="size-4 text-accentCoral" />
            <span className="text-[10px] text-ink-muted font-mono font-bold uppercase tracking-wider">Accuracy</span>
          </div>
          <div className="text-3xl font-bold font-mono text-ink">
            {totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0}%
          </div>
        </div>
      </div>

      <div className="border-2 border-ink bg-surface rounded-lg p-6">
        <h2 className="text-xl font-bold font-mono text-ink mb-4">Recent Activity</h2>
        {submissions.length === 0 ? (
          <p className="text-ink-muted font-mono text-sm uppercase tracking-wider">No recent submissions found.</p>
        ) : (
          <div className="space-y-3">
            {submissions.slice(0, 5).map((sub) => (
              <div key={sub._id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-divider pb-3 last:border-0 last:pb-0 gap-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 border-2 border-ink font-mono font-bold text-[10px] uppercase tracking-wider rounded-pill ${sub.verdict === 'AC' ? 'bg-lime text-ink' : 'bg-accentCoral text-ink'}`}>
                    {sub.verdict}
                  </span>
                  <span className="text-ink font-bold">{sub.probCode}</span>
                </div>
                <div className="text-ink-muted font-mono text-[10px] font-bold uppercase tracking-wider">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
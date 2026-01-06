import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/User';

const SubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(false);
    const [submissions, setSubmissions] = useState([]);
    const { probCode,contestCode }= useParams();
    const { userData, setUserData} = useAuth();
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
      // console.log(userData);
      // if(!userData)  setUserData(JSON.parse(localStorage.getItem("userData")));
      // if (!userData) {
      //   alert("You need to be logged in first!");
      //   navigate('/login'); return;
      // }
        
      const fetchSubmissions = async () => {
        try {
          if(probCode) {
            const res= await fetch(`${apiUrl}/submission/problem/${probCode}/user/${userData.username}`);
            const data=await res.json();

            if (!data.success) {
              setError(data.message || "Failed to import submissions!");
            } else {
              setSubmissions(data.submissions);
            }
          }
          else if(contestCode) {
            const res= await fetch(`${apiUrl}/submission/contest/${contestCode}/user/${userData.username}`);
            const data = await res.json();

            if(!data.success) {
              setError(data.message || "Failed to load contest submissions");
            } else {
              setSubmissions(data.result);
            }
          }
          else {
            alert("No problemcode or contest code provided!")
          }

        } catch(err) {
          setError("Failed to fetch user submissions! Try Again!");
        }
        finally {
          setLoading(false);
        }
      }

      fetchSubmissions();
      // console.log(submissions);
    }, [userData, probCode, contestCode]);

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading Submissions...
      </h2>
    );

  if( error)
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );

  return (
    <div className="w-[85%] mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        My Submissions
      </h1>

      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Problem</th>
                <th className="p-3 border">Language</th>
                <th className="p-3 border">Verdict</th>
                <th className="p-3 border">Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {submissions.map((s, idx) => (
                <tr
                  key={s._id}
                  className="hover:bg-gray-50 transition text-center"
                >
                  <td className="p-3 border">{idx + 1}</td>

                  <td className="p-3 border text-blue-600 font-medium">
                    <Link to={`/problem/${s.problemCode}`}>
                      {s.problem?.probName || s.problemCode}
                    </Link>
                  </td>

                  <td className="p-3 border">
                    {s.language}
                  </td>

                  <td
                    className={`p-3 border font-semibold ${
                      s.verdict === "AC"
                        ? "text-green-600"
                        : s.verdict === "WA"
                        ? "text-red-600"
                        : s.verdict === "TLE"
                        ? "text-orange-500"
                        : s.verdict === "CE"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {s.verdict}
                  </td>

                  <td className="p-3 border text-sm">
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
}

export default SubmissionsPage
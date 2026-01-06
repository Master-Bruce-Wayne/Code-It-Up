import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/User';

const SubmissionsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError]= useState(false);
    const [submissions, setSubmissions] = useState(null);
    const { probCode,contestCode }= useParams();
    const { userData, setUserData} = useAuth();
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
      if (!userData) {
        // navigate('/login');
        alert("You need to be logged in first!");
      }
        
      // console.log(probCode, contestCode, userData.username);
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
    }, [userData, probCode, contestCode]);

  return (
    <div>Submissions</div>
  )
}

export default SubmissionsPage
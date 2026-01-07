import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/User.jsx';
import Editor from "@monaco-editor/react"
import { toast } from 'react-toastify';

const CodeEditorPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [language,setLanguage] = useState('cpp');
    const [loading, setLoading] =useState(false);
    const [error,setError] = useState("");
    const [code, setCode]= useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    cout<< "Write code here!";
    return 0;
}
    `);
    const {userData,setUserData} = useAuth();
    const {probCode} = useParams();
    const navigate = useNavigate();
    
    const handleSubmit = async() => {
        try {
            setLoading(true);
            const res = await axios.post(`${apiUrl}/submission/submit`, {
                code, language, probCode, 
                username:userData.username, userId:userData._id
            });

            // console.log("Res:",res);
            // console.log("Res.data: ", res.data);
            if(!res.data.success) {
              setError("Failed to submit code to backend");
              toast.error("Failed to submit code to backend");
            }
        } catch(err){
            setError(err.message);
            toast.error(err.message);
        } finally {
            // navigate('')
        }
    };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-3">Code Editor</h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border p-2 mb-3"
      >
        <option value="cpp">C++</option>
      </select>

      {/* Monaco Code Editor */}
      <div className="border rounded overflow-hidden">
        <Editor
          height="400px"
          language="cpp"
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-red-500">{error}</p>
      )}
    </div>
  );
}

export default CodeEditorPage
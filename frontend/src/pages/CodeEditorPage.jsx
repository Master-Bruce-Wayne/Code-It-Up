import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/User.jsx';
import Editor from "@monaco-editor/react"
import { toast } from 'react-toastify';

const CodeEditorPage = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [language, setLanguage] = useState('cpp');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here
    cout << "Hello, World!" << endl;
    return 0;
}`);
    const { userData } = useAuth();
    const { probCode } = useParams();
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        if (!userData) {
            toast.error("Please login to submit code");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const res = await axios.post(`${apiUrl}/submission/submit`, {
                code, language, probCode, 
                username: userData.username, 
                userId: userData._id
            });

            if (!res.data.success) {
                setError("Failed to submit code to backend");
                toast.error("Failed to submit code to backend");
            } else {
                toast.success("Code submitted successfully!");
                // Optionally navigate to submissions page
                // navigate(`/problemset/problem/${probCode}/submissions/my`);
            }
        } catch (err) {
            setError(err.message);
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
        setError("");
        toast.info("Code editor reset");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-[95%] max-w-7xl mx-auto py-6">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Code Editor</h1>
                            <p className="text-gray-600">
                                Problem: <Link to={`/problemset/problem/${probCode}`} className="text-blue-600 hover:underline font-semibold">{probCode}</Link>
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/problemset/problem/${probCode}`}
                                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-medium text-gray-700"
                            >
                                ← Back to Problem
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Editor Section */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in mb-6">
                    {/* Toolbar */}
                    <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium">Language:</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 font-medium"
                            >
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="python">Python</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg btn-animate font-medium transition-colors"
                            >
                                Reset Code
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg btn-animate font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </span>
                                ) : (
                                    "Submit Code"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Monaco Editor */}
                    <div className="border-t border-gray-200">
                        <Editor
                            height="600px"
                            language={language}
                            theme="vs-dark"
                            value={code}
                            onChange={(value) => setCode(value ?? "")}
                            options={{
                                fontSize: 16,
                                minimap: { enabled: true },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                lineNumbers: 'on',
                                roundedSelection: false,
                                readOnly: false,
                                cursorStyle: 'line',
                                formatOnPaste: true,
                                formatOnType: true,
                                tabSize: 4,
                                insertSpaces: true,
                            }}
                        />
                    </div>
                </div>

                {/* Info & Error Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Tips Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tips & Guidelines
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Read the problem statement carefully before coding</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Test your code with sample inputs before submitting</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Ensure your solution handles edge cases</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Check time and memory constraints</span>
                            </li>
                        </ul>
                    </div>

                    {/* Error/Status Section */}
                    <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Status & Errors
                        </h3>
                        {error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        ) : (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p className="text-blue-700 font-medium">Ready to submit. Make sure your code is correct!</p>
                            </div>
                        )}
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Language:</strong> {language.toUpperCase()}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                <strong>Code Length:</strong> {code.length} characters
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CodeEditorPage;

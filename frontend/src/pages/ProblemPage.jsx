import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react"

const ProblemPage = () => {
  const { probCode } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${apiUrl}/problem/getProb/${probCode}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Failed to load problem");
        } else {
          setProblem(data.problem);
        }
      } catch (err) {
        setError("Server error while fetching problem");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [probCode]);

  if (loading)
    return (
      <h2 className="text-center text-xl font-semibold mt-10">
        Loading Problem...
      </h2>
    );

  if (error)
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>
    );

  if (!problem) return null;

  return (
    <div className="w-[85%] mx-auto py-8">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">{problem.probName}</h1>

        <p className="text-gray-600 text-sm mt-1">
          Code: <span className="font-semibold">{problem.probCode}</span> •
          Rating:{" "}
          <span className="font-semibold">{problem.probRating}</span> •
          Time Limit: {problem.timeLimit} ms • Memory: {problem.memoryLimit} MB
        </p>

        {problem.probTags?.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {problem.probTags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Problem Statement */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Problem Statement
        </h2>
        <p className="text-gray-800 whitespace-pre-line">
          {problem.probStatement}
        </p>
      </section>

      {/* Input Format */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Input Format
        </h2>
        <p className="text-gray-800 whitespace-pre-line">
          {problem.inputFormat}
        </p>
      </section>

      {/* Output Format */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Output Format
        </h2>
        <p className="text-gray-800 whitespace-pre-line">
          {problem.outputFormat}
        </p>
      </section>

      {/* Constraints */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Constraints
        </h2>
        <p className="text-gray-800 whitespace-pre-line">
          {problem.constraints}
        </p>
      </section>

      {/* Samples */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Sample Tests
        </h2>

        {problem.samples?.length === 0 && (
          <p className="text-gray-500">No sample tests available.</p>
        )}

        {problem.samples?.map((s, i) => (
          <div
            key={i}
            className="border rounded p-4 mb-4 bg-gray-50 space-y-3"
          >
            <p className="font-semibold">Sample {i + 1}</p>

            <div>
              <p className="font-semibold">Input</p>
              <pre className="bg-black text-white p-3 rounded whitespace-pre-wrap">
                {s.input}
              </pre>
            </div>

            <div>
              <p className="font-semibold">Output</p>
              <pre className="bg-black text-white p-3 rounded whitespace-pre-wrap">
                {s.output}
              </pre>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProblemPage;

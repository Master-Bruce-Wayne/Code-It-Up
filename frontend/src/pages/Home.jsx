import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-[90%] mx-auto py-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to <span className="text-blue-600">Code-It-Up</span>
        </h1>

        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Practice coding problems, participate in contests, sharpen your
          problem solving skills, and grow as a competitive programmer.
          This platform helps you improve logic, algorithms, data structures,
          and coding speed — just like Codeforces.
        </p>

        <div className="mt-8 flex justify-center gap-6">
          <Link
            to="/problemset"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go to Problemset
          </Link>

          <Link
            to="/contests"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            View Contests
          </Link>
        </div>
      </div>

      <div className="mt-14 grid md:grid-cols-3 gap-6">
        <div className="p-5 border rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Solve Problems</h3>
          <p className="text-gray-600">
            Browse a wide variety of coding problems based on difficulty and tags.
          </p>
        </div>

        <div className="p-5 border rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Participate in Contests</h3>
          <p className="text-gray-600">
            Compete in live contests, test your speed, accuracy and consistency.
          </p>
        </div>

        <div className="p-5 border rounded shadow hover:shadow-md transition">
          <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
          <p className="text-gray-600">
            View submissions, track performance, and keep improving every day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

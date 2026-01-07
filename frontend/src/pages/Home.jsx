import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="w-[90%] mx-auto py-20">
        <div className="text-center animate-fade-in max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Master Competitive Programming
          </h1>
          
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            Practice coding problems, participate in contests, and sharpen your problem-solving skills. 
            Join thousands of developers improving their algorithms, data structures, and coding speed.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/problemset"
              className="!text-white bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-700 hover:via-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl btn-animate font-semibold text-lg shadow-lg"
            >
              Start Solving →
            </Link>

            <Link
              to="/contests"
              className="relative px-8 py-4 rounded-xl btn-animate font-semibold text-lg overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"></span>
              <span className="absolute inset-[2px] bg-white rounded-lg"></span>
              <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
                View Contests →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-[90%] mx-auto py-12 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-lg mb-16 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">1000+</div>
            <div className="text-gray-700 font-semibold text-lg">Coding Problems</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">50+</div>
            <div className="text-gray-700 font-semibold text-lg">Live Contests</div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-2">5000+</div>
            <div className="text-gray-700 font-semibold text-lg">Active Users</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-[90%] mx-auto py-12 mb-16">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Why Choose Code-It-Up?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border-2 border-gray-200 rounded-2xl shadow-sm bg-white box-animate animate-fade-in hover:border-blue-300 transition-all" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Solve Problems</h3>
            <p className="text-gray-600 leading-relaxed font-normal">
              Browse a comprehensive collection of coding problems organized by difficulty, tags, and topics. 
              Practice algorithms, data structures, and problem-solving techniques.
            </p>
          </div>

          <div className="p-8 border-2 border-gray-200 rounded-2xl shadow-sm bg-white box-animate animate-fade-in hover:border-green-300 transition-all" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Compete in Contests</h3>
            <p className="text-gray-600 leading-relaxed font-normal">
              Participate in live coding contests, test your speed and accuracy under pressure. 
              Compete with peers and climb the leaderboard.
            </p>
          </div>

          <div className="p-8 border-2 border-gray-200 rounded-2xl shadow-sm bg-white box-animate animate-fade-in hover:border-purple-300 transition-all" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed font-normal">
              Monitor your submissions, analyze performance metrics, and track your improvement over time. 
              Set goals and achieve milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="w-[90%] mx-auto py-12 mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Real-Time Code Execution
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed font-normal">
              Write, test, and submit your code directly in the browser with our integrated code editor. 
              Get instant feedback on your solutions with comprehensive test cases.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 font-normal">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Syntax highlighting and auto-completion
              </li>
              <li className="flex items-center text-gray-700 font-normal">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Multiple programming languages support
              </li>
              <li className="flex items-center text-gray-700 font-normal">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Instant compilation and execution
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white box-animate animate-fade-in shadow-xl">
            <h3 className="text-2xl font-semibold mb-4">Ready to Start?</h3>
            <p className="mb-6 !text-white/90 font-normal">
              Join our community of competitive programmers and take your coding skills to the next level.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold btn-animate hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-[90%] mx-auto py-16 mb-16 text-center">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 !text-white animate-fade-in shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Coding Skills?</h2>
          <p className="text-xl mb-8 !text-white/90 font-normal">
            Join thousands of developers already improving on Code-It-Up
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/problemset"
              className="bg-white text-gray-800 px-8 py-4 rounded-xl btn-animate font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Explore Problems →
            </Link>
            <Link
              to="/contests"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 !text-white hover:bg-white/20 px-8 py-4 rounded-xl btn-animate font-semibold text-lg transition-all"
            >
              Join Contest →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

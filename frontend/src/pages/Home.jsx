import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { 
  Code2, Trophy, Terminal, Sparkles, ChevronRight, 
  Cpu, Layers, Zap, CheckCircle2, AlertCircle, Play, 
  ChevronDown, HelpCircle, ArrowUpRight 
} from "lucide-react";
import TargetCursor from '../component/TargetCursor.jsx';

// Animated Code Typing Mockup
const CodeMockup = () => {
  const [typedCode, setTypedCode] = useState("");
  const [verdict, setVerdict] = useState("Pending"); // Pending, Compiling, Running, AC
  
  const codeString = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    if (cin >> a >> b) {
        cout << a + b << endl;
    }
    return 0;
}`;

  useEffect(() => {
    let index = 0;
    let timer;
    
    const type = () => {
      setTypedCode(codeString.substring(0, index));
      index++;
      
      if (index <= codeString.length) {
        timer = setTimeout(type, 35);
      } else {
        // Trigger compile sequence
        setTimeout(() => setVerdict("Compiling"), 800);
        setTimeout(() => setVerdict("Running"), 1600);
        setTimeout(() => setVerdict("AC"), 2400);
        
        // Reset after cycle
        setTimeout(() => {
          setVerdict("Pending");
          index = 0;
          type();
        }, 6000);
      }
    };
    
    type();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/5 overflow-hidden text-left relative group">
      {/* OS Title Bar */}
      <div className="h-10 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-4">
        <div className="flex gap-2">
          <span className="size-3 rounded-full bg-rose-500/80" />
          <span className="size-3 rounded-full bg-amber-500/80" />
          <span className="size-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[11px] font-mono text-gray-500 font-bold uppercase tracking-wider">main.cpp</span>
        <div className="w-12" />
      </div>

      {/* Editor Body */}
      <div className="p-5 font-mono text-xs md:text-sm leading-relaxed min-h-[220px] bg-slate-950 flex flex-col justify-between">
        <div>
          <pre className="text-indigo-400">
            {typedCode}
            <span className="animate-pulse bg-indigo-400 text-transparent">|</span>
          </pre>
        </div>

        {/* Dynamic Judge Output Panel */}
        <div className="border-t border-slate-900 pt-4 mt-4 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Judge Panel</span>
          
          {verdict === "Pending" && (
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-gray-600 animate-pulse" />
              Idle
            </span>
          )}
          {verdict === "Compiling" && (
            <span className="text-xs font-bold text-yellow-500 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-yellow-500 animate-ping" />
              Compiling...
            </span>
          )}
          {verdict === "Running" && (
            <span className="text-xs font-bold text-amber-500 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              Running Testcases...
            </span>
          )}
          {verdict === "AC" && (
            <span className="text-xs font-extrabold text-emerald-400 border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-scale-in">
              <CheckCircle2 className="size-3.5" />
              ACCEPTED (0ms)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// FAQ Accordion Item
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-900 py-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-white font-bold text-base md:text-lg focus:outline-none cursor-target py-2"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="size-4.5 text-indigo-400" />
          {question}
        </span>
        <ChevronDown className={`size-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`} />
      </button>
      
      {isOpen && (
        <p className="text-sm md:text-base text-gray-400 leading-relaxed font-normal pt-2 pb-4 pl-6 animate-fade-in">
          {answer}
        </p>
      )}
    </div>
  );
};

const Home = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero elements transition
      gsap.from(".hero-anim", {
        y: 35,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out"
      });

      // Stagger features
      gsap.from(".feature-card", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.4
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <TargetCursor 
        spinDuration={2}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.3}
      />

      {/* Background Lights */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-indigo-950/20 rounded-full blur-[10rem] pointer-events-none -mr-48 -mt-48" />
      <div className="absolute bottom-1/4 left-0 w-[35rem] h-[35rem] bg-purple-950/15 rounded-full blur-[8rem] pointer-events-none -ml-48" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#090d16_1px,transparent_1px),linear-gradient(to_bottom,#090d16_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* --- HERO SECTION --- */}
      <section className="relative w-[90%] max-w-7xl mx-auto py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold uppercase tracking-wider hero-anim">
            <Sparkles className="size-3" />
            Competitive Arena Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-none hero-anim">
            Level Up Your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-1">
              Coding IQ
            </span>
          </h1>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed font-normal hero-anim max-w-xl">
            Unleash your problem-solving capabilities. Code-It-Up provides an optimized runtime judge, real-time contest environments, and curated practice models.
          </p>

          <div className="flex gap-4 flex-wrap hero-anim">
            <Link
              to="/problemset"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-target"
            >
              Start Solving
              <ArrowUpRight className="size-4" />
            </Link>

            <Link
              to="/contests"
              className="flex items-center gap-2 border border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold text-base hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-target"
            >
              <Trophy className="size-4.5 text-amber-400" />
              View Contests
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Mockup */}
        <div className="flex justify-center lg:justify-end hero-anim">
          <CodeMockup />
        </div>
      </section>

      {/* --- TECH STACK SCROLL TICKER --- */}
      <section className="border-y border-slate-900 bg-slate-950/60 py-6 overflow-hidden select-none mb-24">
        <div className="w-[90%] mx-auto flex items-center justify-around gap-8 flex-wrap text-sm text-gray-500 font-bold uppercase tracking-widest text-center">
          <span className="hover:text-indigo-400 transition-colors">React 19</span>
          <span className="hover:text-indigo-400 transition-colors">Supabase DB</span>
          <span className="hover:text-indigo-400 transition-colors">Monaco Compiler</span>
          <span className="hover:text-indigo-400 transition-colors">Node / Express</span>
          <span className="hover:text-indigo-400 transition-colors">Tailwind v4</span>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="w-[90%] max-w-7xl mx-auto mb-32">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Build Better{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Algorithms
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-normal leading-relaxed">
            The platform is custom engineered from top to bottom for developer skill tracking and efficiency optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="feature-card border border-slate-900 bg-slate-900/10 p-8 rounded-3xl space-y-6 hover:border-indigo-500/25 hover:bg-slate-900/40 transition-all duration-300 relative group">
            <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Terminal className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Full Monaco Sandbox</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Develop solutions inside a premium web IDE with code autocompletion, auto-formatting, reset states, and custom input execution before submission.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="feature-card border border-slate-900 bg-slate-900/10 p-8 rounded-3xl space-y-6 hover:border-indigo-500/25 hover:bg-slate-900/40 transition-all duration-300 relative group">
            <div className="size-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Advanced Scoring Judge</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Automated background compilers test code execution times and memory usages, evaluating edge cases and rendering instant verdict updates.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="feature-card border border-slate-900 bg-slate-900/10 p-8 rounded-3xl space-y-6 hover:border-indigo-500/25 hover:bg-slate-900/40 transition-all duration-300 relative group">
            <div className="size-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
              <Trophy className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Rated Contest Registry</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-normal">
                Register for scheduled competitive rounds as a Rated participant. Overcome time locks, track submission scores, and climb the rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="w-[90%] max-w-4xl mx-auto mb-32">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm font-normal">Everything you need to know about the platform and judging workflow.</p>
        </div>

        <div className="border-t border-slate-900">
          <FAQItem 
            question="How is code executed and judged?" 
            answer="When you click Submit, your code is compiled on our servers using g++ compiler. It is then run in isolation against multiple pre-configured testcase files, evaluating outcomes, execution limits, and memory usages to produce a final verdict." 
          />
          <FAQItem 
            question="What is the difference between Rated and Unrated Contest participation?" 
            answer="Registering as a Rated participant will adjust your profile rating at the end of the contest depending on your score, solving speed, and performance relative to other programmers. Unrated participation lets you solve without rating effects." 
          />
          <FAQItem 
            question="How can I test custom inputs?" 
            answer="Inside the Workspace IDE, click the 'Console' button at the bottom. You can type or paste custom stdin input in the text box, and click 'Run' to execute it and capture output stdout immediately." 
          />
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="w-[90%] max-w-5xl mx-auto pb-24">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/30 border border-slate-800/80 p-12 md:p-16 text-center overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[6rem] pointer-events-none" />
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Compete. Optimize. Level Up.
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto font-normal text-sm md:text-base leading-relaxed">
            Create your account now to start solving coding challenges and climb the global ladder.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="bg-white hover:bg-gray-100 text-slate-950 px-8 py-3.5 rounded-2xl font-extrabold text-base transition-all hover:scale-[1.02] cursor-target shadow-md shadow-white/5"
            >
              Sign Up Now
            </Link>
            <Link
              to="/problemset"
              className="border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] cursor-target"
            >
              Practice List
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

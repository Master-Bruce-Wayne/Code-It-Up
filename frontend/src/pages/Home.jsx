import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Code2, Trophy, Terminal, Sparkles, ChevronRight, 
  Cpu, Layers, Zap, CheckCircle2, AlertCircle, Play, 
  ChevronDown, HelpCircle, ArrowUpRight 
} from "lucide-react";
import AnnotationMarker from '../components/AnnotationMarker.jsx';

// Animated Code Typing Mockup
const CodeMockup = () => {
  const [typedCode, setTypedCode] = useState("");
  const [verdict, setVerdict] = useState("Pending"); 
  
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
        setTimeout(() => setVerdict("Compiling"), 800);
        setTimeout(() => setVerdict("Running"), 1600);
        setTimeout(() => setVerdict("AC"), 2400);
        
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
    <div className="w-full max-w-lg window-chrome text-left relative group">
      <div className="window-chrome-header">
        <div className="window-chrome-dots">
          <div className="window-chrome-dot" />
          <div className="window-chrome-dot" />
          <div className="window-chrome-dot" />
        </div>
        <span className="text-[11px] font-mono text-ink font-bold uppercase tracking-wider ml-4">main.cpp</span>
      </div>

      <div className="p-5 font-mono text-xs md:text-sm leading-relaxed min-h-[220px] bg-surface flex flex-col justify-between">
        <div>
          <pre className="text-ink">
            {typedCode}
            <span className="animate-pulse bg-ink text-transparent">|</span>
          </pre>
        </div>

        <div className="border-t border-divider pt-4 mt-4 flex items-center justify-between">
          <span className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">Judge Panel</span>
          
          {verdict === "Pending" && (
            <span className="text-xs font-bold text-ink-soft flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-ink-muted animate-pulse" />
              Idle
            </span>
          )}
          {verdict === "Compiling" && (
            <span className="text-xs font-bold text-accentBlue flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accentBlue animate-ping" />
              Compiling...
            </span>
          )}
          {verdict === "Running" && (
            <span className="text-xs font-bold text-accentPurple flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-accentPurple animate-pulse" />
              Running Testcases...
            </span>
          )}
          {verdict === "AC" && (
            <span className="text-xs font-bold text-ink border-2 border-ink bg-lime px-2.5 py-0.5 rounded-pill flex items-center gap-1.5">
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
    <div className="border-b border-divider py-4 transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left text-ink font-bold text-base md:text-lg focus:outline-none cursor-pointer py-2"
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="size-4.5 text-ink-soft" />
          {question}
        </span>
        <ChevronDown className={`size-5 text-ink transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <p className="text-sm md:text-base text-ink-soft leading-relaxed font-normal pt-2 pb-4 pl-8">
          {answer}
        </p>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <div className="relative min-h-screen bg-canvas bg-grain overflow-hidden blueprint-grid">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-[90%] max-w-7xl mx-auto py-24 md:py-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Content */}
        <div className="space-y-8 text-left">
          <AnnotationMarker label="COMPETITIVE ARENA LIVE" />

          <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tight text-ink leading-none">
            Level Up Your<br/>Coding IQ
          </h1>

          <p className="text-ink-soft text-base md:text-lg leading-relaxed font-normal max-w-xl">
            Unleash your problem-solving capabilities. Code-It-Up provides an optimized runtime judge, real-time contest environments, and curated practice models.
          </p>

          <div className="flex gap-4 flex-wrap pt-4">
            <Link
              to="/problemset"
              className="flex items-center gap-2 bg-lime border-2 border-ink text-ink px-8 py-3.5 rounded-md font-mono font-bold text-[0.9rem] uppercase tracking-wide hover:bg-lime-hover hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer shadow-[4px_4px_0_0_#17181A]"
            >
              Start Solving
              <ArrowUpRight className="size-4" />
            </Link>

            <Link
              to="/contests"
              className="flex items-center gap-2 border-2 border-ink bg-surface hover:bg-canvas-alt text-ink px-8 py-3.5 rounded-md font-mono font-bold text-[0.9rem] uppercase tracking-wide hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
            >
              <Trophy className="size-4.5" />
              View Contests
            </Link>
          </div>
        </div>

        {/* Right Side: Interactive Mockup */}
        <div className="flex justify-center lg:justify-end">
          <CodeMockup />
        </div>
      </section>

      {/* --- TECH STACK SCROLL TICKER --- */}
      <section className="border-y-2 border-ink bg-canvas-alt py-6 overflow-hidden select-none mb-24">
        <div className="w-[90%] mx-auto flex items-center justify-around gap-8 flex-wrap text-sm text-ink font-mono font-bold uppercase tracking-widest text-center">
          <span className="hover:text-accentBlue transition-colors">React 19</span>
          <span className="hover:text-accentPurple transition-colors">Supabase DB</span>
          <span className="hover:text-accentCoral transition-colors">Monaco Compiler</span>
          <span className="hover:text-accentBlue transition-colors">Node / Express</span>
          <span className="hover:text-accentPurple transition-colors">Tailwind v4</span>
        </div>
      </section>

      {/* --- CORE FEATURES GRID --- */}
      <section className="w-[90%] max-w-7xl mx-auto mb-32 relative">
        <div className="absolute -top-12 -left-6">
          <AnnotationMarker label="HOW IT WORKS" />
        </div>
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4 pt-12">
          <h2 className="text-3xl md:text-5xl font-bold font-mono text-ink tracking-tight">
            Build Better Algorithms
          </h2>
          <p className="text-ink-soft text-sm md:text-base font-normal leading-relaxed">
            The platform is custom engineered from top to bottom for developer skill tracking and efficiency optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="border-2 border-ink bg-surface p-8 rounded-lg space-y-6 hover:-translate-y-1 transition-transform relative">
            <div className="size-12 rounded-md border-2 border-ink bg-canvas-alt text-ink flex items-center justify-center">
              <Terminal className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-ink">Full Monaco Sandbox</h3>
              <p className="text-ink-soft text-sm leading-relaxed font-normal">
                Develop solutions inside a premium web IDE with code autocompletion, auto-formatting, reset states, and custom input execution before submission.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border-2 border-ink bg-surface p-8 rounded-lg space-y-6 hover:-translate-y-1 transition-transform relative">
            <div className="size-12 rounded-md border-2 border-ink bg-lime text-ink flex items-center justify-center shadow-[2px_2px_0_0_#17181A]">
              <Cpu className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-ink">Advanced Scoring Judge</h3>
              <p className="text-ink-soft text-sm leading-relaxed font-normal">
                Automated background compilers test code execution times and memory usages, evaluating edge cases and rendering instant verdict updates.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border-2 border-ink bg-surface p-8 rounded-lg space-y-6 hover:-translate-y-1 transition-transform relative">
            <div className="size-12 rounded-md border-2 border-ink bg-canvas-alt text-ink flex items-center justify-center">
              <Trophy className="size-5.5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-ink">Rated Contest Registry</h3>
              <p className="text-ink-soft text-sm leading-relaxed font-normal">
                Register for scheduled competitive rounds as a Rated participant. Overcome time locks, track submission scores, and climb the rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="w-[90%] max-w-4xl mx-auto mb-32 relative">
        <div className="absolute -top-8 -left-6">
          <AnnotationMarker label="FAQ" />
        </div>
        
        <div className="text-center mb-12 space-y-3 pt-8">
          <h2 className="text-3xl font-bold font-mono text-ink tracking-tight">Frequently Asked Questions</h2>
          <p className="text-ink-soft text-sm font-normal">Everything you need to know about the platform and judging workflow.</p>
        </div>

        <div className="border-t-2 border-ink">
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


    </div>
  );
};

export default Home;

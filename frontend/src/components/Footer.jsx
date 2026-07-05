import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Heart, Code2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-gray-400 mt-auto">
      <div className="w-[90%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
              <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                <Code2 className="size-5" />
              </div>
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Code-It-Up
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-gray-400">
              Master competitive programming. Solve coding challenges, participate in live contests, and track your progress in real-time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/Master-Bruce-Wayne/Code-It-Up" 
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </a>
              <a 
                href="https://linkedin.com/in/sujal-agarwal-746357312" 
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/problemset" className="hover:text-white transition-colors">
                  Problemset
                </Link>
              </li>
              <li>
                <Link to="/contests" className="hover:text-white transition-colors">
                  Contests
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} Code-It-Up. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="size-3 text-rose-500 fill-rose-500" /> by Sujal Agarwal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

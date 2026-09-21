import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Heart, Code2 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink bg-canvas-alt text-ink-soft mt-auto">
      <div className="w-[90%] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-ink hover:opacity-80">
              <div className="p-1 border-2 border-ink bg-surface rounded-md">
                <Code2 className="size-5" />
              </div>
              <span>Code-It-Up</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-ink-soft">
              Master competitive programming. Solve coding challenges, participate in live contests, and track your progress in real-time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://github.com/Master-Bruce-Wayne/Code-It-Up" 
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md border-2 border-ink bg-surface text-ink hover:bg-canvas transition-colors"
                aria-label="GitHub"
              >
                <Github className="size-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-md border-2 border-ink bg-surface text-ink hover:bg-canvas transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="size-5" />
              </a>
              <a 
                href="https://linkedin.com/in/sujal-agarwal-746357312" 
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-md border-2 border-ink bg-surface text-ink hover:bg-canvas transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-sm font-mono font-semibold">
              <li>
                <Link to="/" className="hover:underline underline-offset-4 transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/problemset" className="hover:underline underline-offset-4 transition-all">
                  Problemset
                </Link>
              </li>
              <li>
                <Link to="/contests" className="hover:underline underline-offset-4 transition-all">
                  Contests
                </Link>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h4 className="text-sm font-semibold text-ink font-mono uppercase tracking-wider mb-4">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-sm font-mono font-semibold">
              <li>
                <a href="#" className="hover:underline underline-offset-4 transition-all">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline underline-offset-4 transition-all">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-divider pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-ink-muted uppercase tracking-wide">
          <p>© {currentYear} Code-It-Up. All rights reserved.</p>
          <p className="flex items-center gap-1 font-mono capitalize tracking-normal text-ink-soft">
            Made with <Heart className="size-3 text-accentCoral fill-accentCoral" /> by Sujal Agarwal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

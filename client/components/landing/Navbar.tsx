"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const Navbar = () => {
  return (
    <>
      {/* Top Announcement Bar from the screenshot */}
      <div className="w-full bg-[#111111] px-4 py-2 text-center text-xs font-medium text-[#F3EEE3]">
        <Link
          href="/benchmark"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-85"
        >
          <span className="rounded-full bg-[#D9541E] px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-white">
            Live
          </span>
          <span>Announcing Quelm Benchmarks: Independent evaluation & chaos-testing for AI agents</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#111111]/10 bg-[#F3EEE3]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-[#F3EEE3] font-bold text-base shadow-xs">
              Q
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111111]">
              quelm
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/benchmark"
              className="text-sm font-semibold text-[#D9541E] transition-colors hover:text-[#C24716] flex items-center gap-1.5"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#D9541E]" />
              Benchmark Arena
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-[#111111]/70 transition-colors hover:text-[#111111]"
            >
              Leaderboard
            </Link>
            <Link
              href="/workflows"
              className="text-sm font-medium text-[#111111]/70 transition-colors hover:text-[#111111]"
            >
              Workflows
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-[#111111]/70 transition-colors hover:text-[#111111]"
            >
              Chaos Testing
            </a>
            <a
              href="#architecture"
              className="text-sm font-medium text-[#111111]/70 transition-colors hover:text-[#111111]"
            >
              Architecture
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-[#111111] transition-opacity hover:opacity-70 px-2 py-1"
            >
              Log in
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-2.5 text-sm font-medium text-[#F3EEE3] shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[#252525] active:scale-[0.98]"
            >
              Get early access
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

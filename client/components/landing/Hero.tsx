"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Play, X, Workflow, Sparkles, Bot, Clock } from "lucide-react";

const Hero = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <section className="relative px-6 pt-16 pb-12 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Main Split Grid */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Column: Copy & CTAs */}
          <div className="flex flex-col items-start text-left">
            <Link
              href="/benchmark"
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D9541E]/30 bg-[#FAF7F2] px-3.5 py-1 text-xs font-medium text-[#111111] shadow-xs transition-colors hover:border-[#D9541E]/60"
            >
              <span className="flex h-2 w-2 rounded-full bg-[#D9541E] animate-pulse" />
              <span className="font-semibold text-[#D9541E]">AI Agent Arena</span>
              <span className="text-[#6B6358]">|</span>
              <span className="text-[#554E46]">Benchmark & Chaos Test LangChain, CrewAI & Custom Agents</span>
              <ArrowRight className="h-3 w-3 text-[#D9541E]" />
            </Link>

            <h1 className="text-5xl font-bold tracking-tight text-[#111111] sm:text-6xl md:text-7xl leading-[1.06]">
              The AI teammate <br />
              <span className="font-serif italic font-normal tracking-normal text-[#111111]">
                that never sleeps.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#554E46]">
              Quelm benchmarks and runs autonomous AI agents with repeatable chaos testing — measuring task success, token cost, tool reliability, and execution traces across any framework.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/benchmark"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#D9541E] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#D9541E]/30 transition-all duration-300 hover:scale-[1.02] hover:bg-[#C24716] active:scale-[0.98]"
              >
                Launch Benchmarks
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#111111]/15 bg-[#FAF7F2] px-6 py-3.5 text-sm font-medium text-[#111111] shadow-xs transition-all duration-300 hover:bg-[#EBE3D4] active:scale-[0.98]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111111] text-white">
                  <Play className="h-2.5 w-2.5 fill-white ml-0.5" />
                </span>
                Watch the 2 min demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center gap-4">
              {/* Overlapping Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F3EEE3] object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Founder"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F3EEE3] object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Engineer"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F3EEE3] object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                  alt="Product lead"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-[#F3EEE3] object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                  alt="Founder"
                />
              </div>

              <div>
                <div className="flex items-center gap-0.5 text-xs text-[#111111]">
                  {"★★★★★"}
                </div>
                <p className="text-xs font-medium text-[#554E46]">
                  Loved by <span className="font-semibold text-[#111111]">100+</span> founders
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Screenshot-Inspired Frame with Live Widgets */}
          <div className="relative">
            {/* Burnt Orange outer container & border accent */}
            <div className="relative overflow-hidden rounded-[36px] bg-[#D9541E] p-2.5 shadow-2xl shadow-[#111111]/15">
              <div className="relative min-h-[480px] w-full overflow-hidden rounded-[28px] bg-[#111111]">
                {/* Editorial Photo */}
                <img
                  src="https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=1200&auto=format&fit=crop"
                  alt="City street view"
                  className="h-full w-full object-cover object-center grayscale contrast-125 brightness-90"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/40" />

                {/* Top Left Badge: Built in San Francisco */}
                <div className="absolute left-5 top-5 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-3.5 py-1.5 text-xs font-medium text-white shadow-md backdrop-blur-md">
                  <span>📍</span>
                  <span>Built in San Francisco</span>
                </div>

                {/* Top Right Floating Card: Time saved this week */}
                <div className="absolute right-5 top-5 z-20 rounded-2xl border border-black/5 bg-[#FAF7F2]/95 p-4 shadow-xl backdrop-blur-md text-[#111111] w-42">
                  <p className="text-[11px] font-medium text-[#6B6358]">
                    Time saved this week
                  </p>

                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">11.5</span>
                    <span className="text-xs font-medium text-[#6B6358]">hrs</span>
                  </div>

                  {/* Mini bar graph */}
                  <div className="mt-3 flex items-end gap-1.5 h-6">
                    <div className="w-3 h-3 bg-[#E0D7C6] rounded-xs" />
                    <div className="w-3 h-4 bg-[#E0D7C6] rounded-xs" />
                    <div className="w-3 h-3.5 bg-[#E0D7C6] rounded-xs" />
                    <div className="w-3 h-6 bg-[#D9541E] rounded-xs" />
                    <div className="w-3 h-5 bg-[#111111] rounded-xs" />
                  </div>
                </div>

                {/* Bottom Floating Card: While you slept */}
                <div className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-black/5 bg-[#FAF7F2]/95 p-4.5 shadow-2xl backdrop-blur-md text-[#111111]">
                  <div className="flex items-center justify-between border-b border-[#111111]/10 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#D9541E] animate-pulse" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                        While you slept
                      </h4>
                    </div>
                    <span className="text-[11px] font-medium text-[#6B6358]">
                      Today, 6:02 AM
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 text-xs">
                    {/* Item 1 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-white">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span className="font-medium text-[#111111]">
                          Moved 3 investor calls to Thursday
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B6358]">2:14 AM</span>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-white">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span className="font-medium text-[#111111]">
                          Drafted 14 replies for review
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B6358]">3:42 AM</span>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#111111] text-white">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span className="font-medium text-[#111111]">
                          Paid 2 contractor invoices
                        </span>
                      </div>
                      <span className="text-[11px] text-[#6B6358]">4:05 AM</span>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#D9541E]/20 text-[#D9541E]">
                          <Clock className="h-2.5 w-2.5 stroke-[3]" />
                        </span>
                        <span className="font-medium text-[#111111]">
                          Prepping your board deck with Gemini
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#D9541E]">
                        In progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logos Bar (Exactly matching screenshot) */}
        <div className="mt-20 border-t border-[#111111]/10 pt-8">
          <div className="flex flex-wrap items-center justify-between gap-8 text-[#554E46]">
            <span className="text-xs font-bold tracking-wider uppercase text-[#111111]/80">
              Running ops at 500+
            </span>
            <span className="font-serif text-xl tracking-wider font-semibold text-[#111111]/90">
              Halcyon
            </span>
            <span className="font-mono text-sm tracking-[0.25em] font-extrabold uppercase text-[#111111]/90">
              STRATUS
            </span>
            <span className="text-lg font-bold tracking-tight text-[#111111]/90">
              Parcel.
            </span>
            <span className="text-lg font-light tracking-[0.2em] lowercase text-[#111111]/90">
              lumen
            </span>
            <span className="text-xs font-mono font-extrabold tracking-[0.2em] uppercase text-[#111111]/90">
              ACME LABS
            </span>
            <span className="font-serif text-lg tracking-wide text-[#111111]/90">
              Oaklin
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 2-min Demo Modal */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-[#111111]/15 bg-[#FAF7F2] p-6 shadow-2xl text-[#111111]">
            <div className="flex items-center justify-between border-b border-[#111111]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9541E] text-white">
                  <Workflow className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Quelm Interactive Demo</h3>
                  <p className="text-xs text-[#6B6358]">See how AI agents run unattended</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBE3D4] text-[#111111] hover:bg-[#DED4C3]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#111111]/10 bg-[#F0E9DC] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D9541E] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D9541E]">
                      Live Workflow Orchestration
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6B6358]">Model: Gemini-2.0-Flash</span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#111111]/10 bg-[#FAF7F2] p-3 shadow-xs">
                    <p className="text-[10px] uppercase font-bold text-[#6B6358]">Node 1</p>
                    <p className="text-xs font-semibold mt-1">Inbox & Calendar Scan</p>
                    <span className="inline-block mt-2 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-medium">
                      Completed (0.4s)
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#D9541E] bg-[#FAF7F2] p-3 shadow-xs ring-2 ring-[#D9541E]/20">
                    <p className="text-[10px] uppercase font-bold text-[#D9541E]">Node 2</p>
                    <p className="text-xs font-semibold mt-1">Gemini AI Synthesis</p>
                    <span className="inline-block mt-2 rounded-full bg-[#D9541E]/15 text-[#D9541E] px-2 py-0.5 text-[10px] font-semibold">
                      Running (1.1s)
                    </span>
                  </div>

                  <div className="rounded-xl border border-[#111111]/10 bg-[#FAF7F2] p-3 shadow-xs opacity-75">
                    <p className="text-[10px] uppercase font-bold text-[#6B6358]">Node 3</p>
                    <p className="text-xs font-semibold mt-1">Execute & Dispatch</p>
                    <span className="inline-block mt-2 rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-[10px] font-medium">
                      Queued
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-[#6B6358]">
                  Ready to automate your operations?
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDemoOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-medium text-[#111111] hover:bg-[#EBE3D4]"
                  >
                    Close
                  </button>

                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[#D9541E] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#D9541E]/20 hover:bg-[#C24716]"
                  >
                    Get early access
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;

import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";

const Cta = () => {
  return (
    <section className="relative border-t border-[#111111]/10 py-28">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Contrast container inspired by the screenshot's rich Ink Black card */}
        <div className="rounded-[36px] bg-[#111111] px-8 py-20 text-[#F3EEE3] shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#D9541E]/20 text-[#D9541E] border border-[#D9541E]/40">
            <Bot className="h-9 w-9" />
          </div>

          <h2 className="mt-8 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Build resilient AI pipelines
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#D2C9BC]">
            Orchestrate distributed workflows, autonomous agents, and realtime execution
            pipelines with Quelm.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#D9541E] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#D9541E]/35 transition-all duration-300 hover:scale-[1.03] hover:bg-[#C24716] active:scale-[0.98]"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/workflows/new"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:border-white/40 hover:bg-white/15"
            >
              Create Workflow
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;

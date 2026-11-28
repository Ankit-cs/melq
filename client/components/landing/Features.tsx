import {
  Activity,
  BrainCircuit,
  GitBranch,
  Server,
  ShieldCheck,
  Workflow,
  Zap,
  Gauge,
  Flame,
  Terminal,
} from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "Framework-Independent Benchmarking",
    description:
      "Evaluate LangChain, CrewAI, AutoGen, and custom agents against identical tasks with ground-truth scoring.",
  },
  {
    icon: Flame,
    title: "Chaos & Failure Testing",
    description:
      "Inject simulated 500 tool errors, 429 model rate-limits, and adversarial distractors to measure true agent resilience.",
  },
  {
    icon: Terminal,
    title: "Execution Trace Diff Viewer",
    description:
      "Step-by-step synchronized timelines comparing thoughts, tool calls, token usage, latency, and cost across agents.",
  },
  {
    icon: Workflow,
    title: "Visual Workflow Orchestration",
    description:
      "Compose distributed multi-agent pipelines visually with drag-and-drop nodes, branching logic, and live canvas status.",
  },
  {
    icon: BrainCircuit,
    title: "Modular Gemini 2.0 Flash AI",
    description:
      "Native Google Gemini integration with automatic retry, exponential backoff, and zero-cost free-tier execution.",
  },
  {
    icon: Server,
    title: "Distributed BullMQ Workers",
    description:
      "Enterprise queue architecture backed by Redis and PostgreSQL with persistent execution history.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 bg-[#FAF7F2] px-4 py-2 text-xs font-medium text-[#111111] shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#D9541E]" />
            Platform Capabilities
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[#111111] md:text-5xl">
            Benchmarking, Chaos Testing & Orchestration
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-[#554E46]">
            Melq combines framework-agnostic agent evaluation with an industrial-grade
            distributed execution engine to test, compare, and scale autonomous AI systems.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-[28px] border border-[#111111]/10 bg-[#FAF7F2] p-8 shadow-xs transition-all duration-300 hover:border-[#D9541E]/40 hover:shadow-xl hover:shadow-[#D9541E]/5 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EBE3D4] text-[#D9541E] transition-colors group-hover:bg-[#D9541E] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-8 text-xl font-semibold tracking-tight text-[#111111]">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-[#6B6358]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

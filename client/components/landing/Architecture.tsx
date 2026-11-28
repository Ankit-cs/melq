import { CheckCircle2, Server } from "lucide-react";

const Architecture = () => {
  return (
    <section id="architecture" className="relative border-t border-[#111111]/10 py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#111111]/10 bg-[#FAF7F2] px-4 py-2 text-xs font-medium text-[#111111] shadow-xs">
            <Server className="h-3.5 w-3.5 text-[#D9541E]" />
            System Architecture
          </div>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[#111111]">
            Distributed by design
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-[#554E46]">
            Under the hood, Melq orchestrates distributed task execution through Redis
            queues, BullMQ workers, event-driven orchestration, PostgreSQL persistence,
            and real-time observability streams.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "BullMQ queues with exponential backoff",
              "Event-driven downstream task dispatch",
              "Persistent workflow execution history",
              "Worker heartbeats and live health monitoring",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#D9541E]" />
                <p className="text-[#554E46]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture Visual */}
        <div className="relative rounded-4xl border border-[#111111]/10 bg-[#FAF7F2] p-8 shadow-xl shadow-[#111111]/5">
          <div className="grid gap-6">
            {[
              {
                title: "Workflow Builder",
                subtitle: "Visual orchestration layer",
              },
              {
                title: "Redis + BullMQ",
                subtitle: "Distributed task queues",
              },
              {
                title: "Workers",
                subtitle: "Parallel execution agents (Gemini LLM / HTTP / Transform)",
              },
              {
                title: "PostgreSQL",
                subtitle: "Execution persistence",
              },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="relative rounded-3xl border border-[#111111]/10 bg-[#F0E9DC] p-6 transition-all duration-200 hover:border-[#D9541E]/40"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold tracking-tight text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#6B6358]">{item.subtitle}</p>
                  </div>

                  <div className="h-3 w-3 rounded-full bg-[#D9541E]" />
                </div>

                {idx !== 3 && (
                  <div className="absolute left-1/2 top-full h-6 w-px -translate-x-1/2 bg-[#D9541E]/40" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;

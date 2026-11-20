const STATS = [
  {
    value: "Realtime",
    label: "Workflow orchestration",
  },
  {
    value: "Distributed",
    label: "Worker architecture",
  },
  {
    value: "Fault-Tolerant",
    label: "Execution pipeline",
  },
  {
    value: "Extensible",
    label: "Agent system",
  },
];

const Stats = () => {
  return (
    <section className="relative border-y border-[#111111]/10 bg-[#EFE8DC]/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-14 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[#111111]/10 bg-[#FAF7F2] p-6 shadow-xs backdrop-blur-xl"
          >
            <h3 className="text-3xl font-semibold tracking-tight text-[#111111]">
              {stat.value}
            </h3>

            <p className="mt-2 text-sm text-[#6B6358]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;

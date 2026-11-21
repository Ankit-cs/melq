import {
  LayoutDashboard,
  Workflow,
  Play,
  Bot,
  Gauge,
  Trophy,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Agent Benchmark",
    href: "/benchmark",
    icon: Gauge,
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    label: "Runs",
    href: "/runs",
    icon: Play,
  },
  {
    label: "Agents",
    href: "/agents",
    icon: Bot,
  },
];

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/benchmark": "AI Agent Benchmarking & Chaos Arena",
  "/leaderboard": "Agent Resilience Leaderboard",
  "/workflows": "Workflows",
  "/runs": "Runs",
  "/agents": "Agent Registry",
};

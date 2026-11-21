"use client";

import { AlertCircle } from "lucide-react";
import { Node, Handle, NodeProps, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { AgentNodeData } from "@/lib/types";

import { AGENT_META } from "@/lib/constants/agent.constants";
import { STATUS_STYLES } from "@/lib/constants/status.constants";

const AgentNode = ({ data, selected }: NodeProps<Node<AgentNodeData>>) => {
  const meta = AGENT_META[data.type] ?? AGENT_META["LLM_AGENT"];
  const Icon = meta.icon;

  return (
    <div
      className={cn(
        "group relative w-87.5 rounded-2xl border border-border bg-card/95 shadow-xl backdrop-blur-xl transition-all duration-300 text-card-foreground",
        "hover:border-[#D9541E]/40 hover:shadow-2xl",
        selected && "border-[#D9541E] ring-2 ring-[#D9541E]/30 shadow-2xl",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br opacity-40",
          meta.accent,
        )}
      />

      <Handle
        type="target"
        position={Position.Left}
        className="h-3! w-3! border-2! border-background! bg-[#111111]!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="h-3! w-3! border-2! border-background! bg-[#D9541E]!"
      />

      <div className="relative p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-[#EBE3D4] text-[#D9541E]">
              <Icon className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {meta.label}
              </p>
              <h3 className="max-w-35 truncate text-sm font-semibold tracking-tight text-foreground">
                {data.label}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {data.critical && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
              </div>
            )}

            {data.status && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-medium",
                  STATUS_STYLES[data.status],
                )}
              >
                {data.status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentNode;

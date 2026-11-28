"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import Icon from "../ui/Icon";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6 gap-3">
        <Icon size={34} />
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Melq</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Workflows</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1.5 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#D9541E]/15 text-[#D9541E] font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <IconComponent
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive
                    ? "text-[#D9541E]"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.label}</span>

              {/* active dot */}
              {isActive && (
                <span className="ml-auto h-2 w-2 rounded-full bg-[#D9541E]" />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

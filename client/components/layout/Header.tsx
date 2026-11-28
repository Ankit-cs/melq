"use client";

import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAGE_TITLES } from "@/lib/constants/navigation";
import { useAuth } from "@/providers/auth-provider";

type HeaderProps = {
  onMenuClick?: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const title =
    PAGE_TITLES[pathname] ??
    pathname
      .split("/")
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground md:hidden hover:bg-accent"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground truncate">{title}</h1>
        <div className="hidden sm:block h-4 w-px bg-border opacity-50" />
        <span className="hidden sm:inline text-xs text-muted-foreground">AI Agent Platform</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <>
            <span className="hidden sm:inline text-sm text-muted-foreground">{user.name}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

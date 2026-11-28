import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-[#111111]/10 py-10 bg-[#EFE8DC]/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-[#6B6358] md:flex-row">
        <p>© 2026 Melq. Distributed workflow orchestration platform.</p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Ankit-cs/melq#readme"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#D9541E]"
          >
            Documentation
          </a>

          <a
            href="https://github.com/Ankit-cs/melq"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#D9541E]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

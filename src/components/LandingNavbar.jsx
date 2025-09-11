// src/components/LandingNavbar.jsx
import { Link } from "react-router-dom";
import { useStore } from "../store";
import { Lock } from "lucide-react";

export default function LandingNavbar() {
  const openAuth = useStore((s) => s.openAuth);

  return (
    <header className="sticky top-0 z-30 bg-paper/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="MatchIN Home"
        >
          <Lock className="h-5 w-5 text-ink/80" />
          <span className="text-lg font-semibold tracking-wide text-ink">
            MatchIN
          </span>
        </Link>

        {/* Right nav group */}
        <div className="rounded-full border border-black/10 bg-white px-2 py-1 shadow-soft">
          <nav className="flex items-center gap-1">
            <a
              href="#features"
              className="rounded-full px-4 py-2 text-xl text-ink/80 hover:bg-black/5"
            >
              Features
            </a>
            <a
              href="https://arvto.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-4 py-2 text-xl text-ink/80 hover:bg-black/5"
            >
              MatchinAR
            </a>
            <button
              onClick={() => openAuth("signin")}
              className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-white"
            >
              Sign In
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

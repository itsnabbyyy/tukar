import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store";

export default function Navbar({ variant = "app" }) {
  const token = useStore((s) => s.token);
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const openAuth = useStore((s) => s.openAuth);

  const location = useLocation();
  const nav = useNavigate();

  const params = new URLSearchParams(location.search);
  const currentTab = params.get("tab") || "chat";
  const tabUrl = (t) => `/dashboard?tab=${t}`;

  const pill = (t) =>
    [
      "rounded-full px-4 py-2 text-sm transition",
      currentTab === t ? "bg-black/5 text-ink" : "text-ink/70 hover:bg-black/5",
    ].join(" ");

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <button
          onClick={() => {
            nav("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
          aria-label="MatchIN Home"
        >
          <img
            src="/mlogo.png"
            alt="MatchIN logo"
            className="h-10 w-10 rounded-2xl object-contain"
          />
          <div className="text-xl font-bold tracking-wide text-gray-900">
            MatchIN
          </div>
        </button>

        {/* center nav differs by variant */}
        {variant === "landing" ? (
          <nav className="hidden items-center gap-2 md:flex">
            <a
              href="#features"
              className="rounded-full px-5 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="rounded-full px-5 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="rounded-full px-5 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              FAQ
            </a>
            <a
              href="#find-us"
              className="rounded-full px-5 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              Find Us
            </a>
            <a
              href="https://arvto.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full px-5 py-2.5 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
            >
              MatchIN AR
            </a>
          </nav>
        ) : (
          <nav className="hidden items-center gap-2 md:flex">
            <Link to={tabUrl("chat")} className={pill("chat")}>
              AI Chat
            </Link>
            <Link to={tabUrl("tryon")} className={pill("tryon")}>
              Try On
            </Link>
            <Link to={tabUrl("mood")} className={pill("mood")}>
              Mood Board
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <button
                onClick={() => openAuth("signin")}
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth("signup")}
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.4)] hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <span className="hidden text-gray-600 md:inline font-medium">
                Hi, {user?.first_name || "you"}
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

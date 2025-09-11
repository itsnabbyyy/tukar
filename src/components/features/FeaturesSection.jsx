import { useEffect, useRef } from "react";
import { useStore } from "../../store";
import FeatureCard from "./FeatureCard";
import {
  Bot,
  Image as ImageIcon,
  LayoutGrid,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";

export default function FeaturesSection() {
  const openAuth = useStore((s) => s.openAuth);
  const ref = useRef(null);

  // stagger reveal on scroll
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll(".feat-card"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = 1;
            e.target.style.transform = "translateY(0)";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const features = [
    {
      icon: <Bot className="h-5 w-5" />,
      title: "AI Stylist Chat",
      text: "Describe your vibe and get curated picks—instantly.",
    },
    {
      icon: <ImageIcon className="h-5 w-5" />,
      title: "Virtual Try-On",
      text: "Preview outfits on your photo before you add to cart.",
    },
    {
      icon: <LayoutGrid className="h-5 w-5" />,
      title: "Moodboard Pins",
      text: "Save products & try-ons, compare looks, build a capsule.",
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "Smart Search",
      text: "Browse multi-brand options with clean, shoppable cards.",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Private by Design",
      text: "Your photos stay yours. Remove anytime. Secure by default.",
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Threads & History",
      text: "Keep ideas organized; revisit and continue seamlessly.",
    },
  ];

  return (
    <section
      id="features"
      ref={ref}
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32"
    >
      {/* Enhanced backdrop */}
      <div
        className="pointer-events-none absolute inset-x-4 top-10 -z-10 rounded-[48px] opacity-60"
        style={{
          height: "70%",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.95), rgba(248,250,252,0.6) 45%, rgba(248,250,252,0) 70%)",
        }}
      />

      {/* Enhanced Header */}
      <div className="mx-auto max-w-4xl text-center mb-16 lg:mb-20">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6"
          style={{ color: "#1a202c" }}
        >
          Everything you need to look your best
        </h2>
        <p
          className="text-lg md:text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto"
          style={{ color: "#4a5568" }}
        >
          Fast. Personal. Effortless. Try looks, curate favorites, and shop with
          confidence.
        </p>
      </div>

      {/* Enhanced Features Grid */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16 lg:mb-20">
        {features.map((f, i) => (
          <FeatureCard
            key={f.title}
            icon={f.icon}
            title={f.title}
            text={f.text}
            delay={i * 100}
          />
        ))}
      </div>

      {/* Enhanced CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => openAuth("signup")}
          className="rounded-full px-8 py-4 text-lg md:text-xl font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#ffffff",
          }}
        >
          Create Your Look
        </button>
      </div>

      <style>{`
        :root { --easing: cubic-bezier(.21,.8,.35,1); }
        @keyframes spinBorder { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

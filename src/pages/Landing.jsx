// src/pages/Landing.jsx
import React, { useEffect, useRef } from "react";
import { useStore } from "../store";
import Starfield from "../components/Starfield";
import { Sparkles } from "lucide-react";
import FeaturesSection from "../components/features/FeaturesSection";
import PricingSection from "../components/features/PricingSection";
import FAQSection from "../components/features/FAQSection";
import CurvedHeading from "../components/CurvedHeading.jsx";
import Footer from "../components/Footer";

// --- Local assets for hero flip-cards ---
import nabila2 from "../assets/nabila2.jpeg";
import nabby2 from "../assets/nabby2.png";
import nabila1 from "../assets/nabila1.jpeg";
import nabby1 from "../assets/nabby1.png";
import j1 from "../assets/j1.jpeg";
import jacob1 from "../assets/jacob1.png";
import male from "../assets/male.jpg";
import male2 from "../assets/male2.png";
import oppa from "../assets/oppa.jpg";
import oppa2 from "../assets/oppa2.png";
import gong from "../assets/gong.jpg";
import gong2 from "../assets/gong2.png";

/* ---------------- Flip Card ---------------- */
function FlipCard({ front, back, className = "", delay = 0, duration = 10 }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        perspective: "1000px",
        animation: `floatXY ${duration}s ease-in-out ${delay}ms infinite`,
        willChange: "transform",
      }}
    >
      <div
        className="
          relative rounded-3xl border border-gray-200 bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56
          transition-all duration-700 ease-out
          [transform-style:preserve-3d] [transform:rotateY(0deg)]
          hover:[transform:rotateY(180deg)] hover:shadow-[0_25px_70px_rgba(0,0,0,0.15)]
        "
      >
        <img
          src={front}
          alt="Before virtual try-on"
          className="absolute inset-0 h-full w-full rounded-3xl object-cover [backface-visibility:hidden]"
        />
        <img
          src={back}
          alt="After virtual try-on"
          className="absolute inset-0 h-full w-full rounded-3xl object-cover [transform:rotateY(180deg)] [backface-visibility:hidden]"
        />
      </div>
    </div>
  );
}

/* --------------- Mission Story (scroll reveal) --------------- */
function MissionStory() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (ents) =>
        ents.forEach((e) => e.isIntersecting && el.classList.add("is-visible")),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const lines = [
    "We make the joy of trying-on available in online shopping.",
    "With MatchIN, you see outfits on you before they ever hit the cart.",
    "Because great style shouldn’t be a gamble, it should feel like finding the perfect mirror.",
  ];

  return (
    <section
      id="mission"
      className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32"
      ref={ref}
    >
      {/* soft spotlight behind text */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-[70%] -translate-y-1/2 rounded-[48px] opacity-50"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.4) 55%, rgba(248,250,252,0) 100%)",
        }}
      />
      <div
        className="text-center font-semibold leading-relaxed tracking-tight"
        style={{ color: "#1a202c" }}
      >
        {lines.map((t, i) => (
          <span
            key={i}
            className="line block translate-y-7 opacity-0 will-change-transform"
            style={{
              fontSize: "clamp(24px, 3.5vw, 48px)",
              marginBottom: "0.8em",
              animationDelay: `${i * 220}ms`,
              lineHeight: "1.3",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <style>{`
        .is-visible .line { animation: riseIn 1.05s cubic-bezier(.21,.8,.35,1) forwards; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(24px); filter: blur(5px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);  }
        }
      `}</style>
    </section>
  );
}

/* ------------------- Page ------------------- */
export default function Landing() {
  const openAuth = useStore((s) => s.openAuth);

  const pairs = [
    { front: nabila2, back: nabby2 },
    { front: nabila1, back: nabby1 },
    { front: j1, back: jacob1 },
    { front: oppa, back: oppa2 },
    { front: gong, back: gong2 },
    { front: male, back: male2 },
  ];

  // 3 left / 3 right – spread out more to use full width
  const slots = [
    "left-[2%]  top-[10%]  -rotate-[7deg]  hidden md:block",
    "left-[8%]  top-[48%]   rotate-[4deg]  hidden md:block",
    "left-[25%] top-[82%]  -rotate-[3deg]  hidden md:block",
    "right-[2%]  top-[10%]  rotate-[7deg]  hidden md:block",
    "right-[8%]  top-[49%] -rotate-[4deg]  hidden md:block",
    "right-[25%] top-[83%]  rotate-[3deg]  hidden md:block",
  ];

  // start offsets for the explode-in animation (relative to center) - expanded for wider layout
  const explodeVectors = [
    { x: "25vw", y: "12vh" },
    { x: "22vw", y: "0vh" },
    { x: "25vw", y: "-12vh" },
    { x: "-25vw", y: "12vh" },
    { x: "-22vw", y: "0vh" },
    { x: "-25vw", y: "-12vh" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "transparent",
        color: "#1a1a1a",
      }}
    >
      <Starfield withBlobs={false} />

      {/* HERO */}
      <section className="relative mx-auto flex min-h-[92svh] max-w-full items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* floating flip cards with explode-in reveal */}
        {pairs.map((p, i) => {
          const v = explodeVectors[i] || { x: "0", y: "0" };
          // Pair left/right to explode simultaneously:
          // indices 0 & 3 together, 1 & 4 together, 2 & 5 together
          const pairStep = i % 3;
          const explodeDelay = pairStep * 440; // ms
          const floatDelay = pairStep * 280; // keep subtle desync, but left/right matched

          return (
            <div key={i} className={`absolute ${slots[i]} z-[1]`}>
              <div
                className="explode-card"
                style={{
                  "--from-x": v.x,
                  "--from-y": v.y,
                  "--delay": `${explodeDelay}ms`,
                }}
              >
                <FlipCard
                  front={p.front}
                  back={p.back}
                  delay={floatDelay}
                  duration={9 + (pairStep % 3) * 1.3}
                />
              </div>
            </div>
          );
        })}

        {/* centered title + copy */}
        <div className="relative z-[10] text-center max-w-5xl mx-auto">
          <CurvedHeading className="mb-6" curve={90} font={250} />
          <div className="relative">
            {/* Background overlay for better text readability */}
            <p
              className="relative mx-auto mt-12 max-w-3xl text-lg md:text-xl lg:text-2xl font-semibold leading-relaxed px-6 py-4"
              style={{
                color: "#1a202c",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Discover your perfect style with MatchIn
              <br />
              Curated looks, personalized recommendations,
              <br />
              effortlessly.
            </p>
          </div>
          <button
            onClick={() => openAuth("signup")}
            className="relative z-[11] mt-10 inline-flex items-center justify-center rounded-full px-10 py-4 text-lg md:text-xl font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              color: "#ffffff",
            }}
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Mission */}
      <MissionStory />

      {/* Features */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Pricing */}
      <div id="pricing">
        <PricingSection />
      </div>

      {/* FAQ */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Footer */}
      <div id="find-us">
        <Footer />
      </div>

      {/* local animations */}
      <style>{`
        @keyframes floatXY {
          0%   { transform: translate(0, 0) rotate(0deg); }
          25%  { transform: translate(-8px, -26px) rotate(1.8deg); }
          50%  { transform: translate(0, -14px) rotate(0.6deg); }
          75%  { transform: translate(8px, -26px) rotate(-1.6deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

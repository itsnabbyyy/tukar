import { useState, useEffect, useRef } from "react";
import { Check, X, Sparkles, Crown, Zap } from "lucide-react";

const plansData = {
  monthly: [
    {
      name: "Free",
      icon: "🆓",
      price: "RM0",
      period: "mo",
      originalPrice: null,
      savings: null,
      description: "Perfect for getting started",
      features: [
        { text: "50 images / month", included: true, icon: "📸" },
        { text: "Free for first 30 days", included: true },
        { text: "API Access", included: false },
        { text: "AI Stylist Chatbot", included: false },
        { text: "MoodBoard Tool", included: false },
        { text: "Priority Support", included: false },
        { text: "Commercial Use", included: false },
        { text: "RM0.45 / image for additional top-ups", included: true },
      ],
      action: "Get Started",
      highlight: false,
      gradient: false,
      popular: false,
    },
    {
      name: "Basic",
      icon: "🔹",
      price: "RM35",
      period: "mo",
      originalPrice: null,
      savings: null,
      description: "Great for small businesses",
      features: [
        { text: "300 images / month", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.117", included: true },
        { text: "API Access", included: false },
        { text: "AI Stylist Chatbot", included: false },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: false },
        { text: "Commercial Use", included: true },
        { text: "RM0.35 / image for additional top-ups", included: true },
      ],
      action: "Subscribe Now",
      highlight: false,
      gradient: false,
      popular: false,
    },
    {
      name: "Standard",
      icon: "🎯",
      price: "RM145",
      period: "mo",
      originalPrice: null,
      savings: null,
      description: "Most popular choice",
      features: [
        { text: "1,500 images / month", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.097", included: true },
        { text: "API Access", included: true },
        { text: "AI Stylist Chatbot", included: true },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: true },
        { text: "Commercial Use", included: true },
        { text: "RM0.30 / image for additional top-ups", included: true },
      ],
      action: "Upgrade Plan",
      highlight: false,
      gradient: false,
      popular: true,
    },
    {
      name: "Premium",
      icon: "🚀",
      price: "RM420",
      period: "mo",
      originalPrice: null,
      savings: null,
      description: "For power users & enterprises",
      features: [
        { text: "4,150 images / month", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.101", included: true },
        { text: "API Access", included: true },
        { text: "AI Stylist Chatbot", included: true },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: true },
        { text: "Commercial Use", included: true },
        { text: "RM0.25 / image for additional top-ups", included: true },
      ],
      action: "Go Premium",
      highlight: true,
      gradient: true,
      popular: false,
    },
  ],
  yearly: [
    {
      name: "Basic",
      icon: "🔹",
      price: "RM350",
      period: "yr",
      originalPrice: "RM420",
      savings: "2 Months for FREE",
      description: "Save 17% with yearly billing",
      features: [
        { text: "3,600 images / year", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.097", included: true },
        { text: "API Access", included: false },
        { text: "AI Stylist Chatbot", included: false },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: false },
        { text: "Commercial Use", included: true },
        { text: "RM0.35 / image for additional top-ups", included: true },
      ],
      action: "Save More",
      highlight: false,
      gradient: false,
      popular: false,
    },
    {
      name: "Standard",
      icon: "🎯",
      price: "RM1,450",
      period: "yr",
      originalPrice: "RM1,740",
      savings: "2 Months for FREE",
      description: "Best value for growing teams",
      avgCostPerImage: "RM0.080",
      features: [
        { text: "18,000 images / year", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.080", included: true },
        { text: "API Access", included: true },
        { text: "AI Stylist Chatbot", included: true },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: true },
        { text: "Commercial Use", included: true },
        { text: "RM0.30 / image for additional top-ups", included: true },
      ],
      action: "Yearly Best Seller",
      highlight: false,
      gradient: false,
      popular: true,
    },
    {
      name: "Premium",
      icon: "🚀",
      price: "RM4,200",
      period: "yr",
      originalPrice: "RM5,040",
      savings: "2 Months for FREE",
      description: "Ultimate power & flexibility",
      features: [
        { text: "49,800 images / year", included: true, icon: "📸" },
        { text: "Cost / Image: RM0.084", included: true },
        { text: "API Access", included: true },
        { text: "AI Stylist Chatbot", included: true },
        { text: "Moodboard Tool", included: true },
        { text: "Priority Support", included: true },
        { text: "Commercial Use", included: true },
        { text: "RM0.25 / image for additional top-ups", included: true },
      ],
      action: "Enterprise Deal",
      highlight: true,
      gradient: true,
      popular: false,
    },
  ],
};

export default function PricingTable() {
  const [billing, setBilling] = useState("monthly");
  const [hoveredCard, setHoveredCard] = useState(null);
  const containerRef = useRef(null);

  // Stagger reveal animation on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".pricing-card"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0) scale(1)";
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "50px" }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [billing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16 text-center">
        {/* Header */}
        <div className="mb-12 lg:mb-16 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-4 lg:mb-6 tracking-tight">
            Choose Your Plan to Get Started
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-6 lg:mb-8 px-4">
            Unlock the power of AI-driven fashion matching with flexible pricing
            that grows with your needs
          </p>
        </div>

        {/* Enhanced Toggle Buttons */}
        <div className="mb-8 lg:mb-12 flex justify-center">
          <div className="relative bg-white rounded-full p-2 shadow-xl border border-gray-200">
            <div
              className={`absolute top-2 left-2 h-12 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-out shadow-lg ${
                billing === "monthly" ? "w-36" : "w-36 translate-x-36"
              }`}
            ></div>
            <button
              className={`relative z-10 px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                billing === "monthly"
                  ? "text-white"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              onClick={() => setBilling("monthly")}
            >
              📅 Monthly
            </button>
            <button
              className={`relative z-10 px-8 py-3 rounded-full font-bold transition-all duration-300 ${
                billing === "yearly"
                  ? "text-white"
                  : "text-gray-700 hover:text-blue-600"
              }`}
              onClick={() => setBilling("yearly")}
            >
              📆 Yearly
            </button>
            {billing === "yearly" && (
              <div className="absolute -top-3 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
                Save ~17%
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Plans Grid */}
        <div
          ref={containerRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-end ${
            billing === "yearly" ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {plansData[billing].map((plan, i) => (
            <div
              key={`${billing}-${i}`}
              className={`pricing-card relative group cursor-pointer transition-all duration-700 ease-out flex flex-col h-full ${
                plan.popular
                  ? "lg:transform lg:-translate-y-6 lg:scale-105"
                  : ""
              }`}
              style={{
                opacity: 0,
                transform: "translateY(50px) scale(0.9)",
                minHeight: "600px",
              }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs lg:text-sm font-bold px-3 lg:px-4 py-1 lg:py-2 rounded-full shadow-lg animate-pulse">
                    🔥 Most Popular
                  </div>
                </div>
              )}

              {/* Savings Badge */}
              {plan.savings && (
                <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 z-20">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 lg:px-3 py-1 lg:py-2 rounded-full shadow-lg transform rotate-12 animate-bounce">
                    {plan.savings}
                  </div>
                </div>
              )}

              <div
                className={`relative flex-1 flex flex-col rounded-3xl p-6 lg:p-8 shadow-xl border-2 transition-all duration-500 group-hover:shadow-2xl ${
                  plan.gradient
                    ? "bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 border-blue-300 text-white"
                    : plan.popular
                    ? "bg-white border-blue-200 group-hover:border-blue-400 shadow-blue-100/50"
                    : "bg-white border-gray-200 group-hover:border-gray-300"
                } ${
                  hoveredCard === i
                    ? "transform scale-[1.02] shadow-2xl"
                    : "group-hover:transform group-hover:scale-[1.02]"
                }`}
              >
                {/* Card Header */}
                <div className="text-center mb-6 flex-shrink-0">
                  <div className="flex items-center justify-center mb-4">
                    <div
                      className={`text-3xl lg:text-4xl p-3 rounded-2xl ${
                        plan.gradient ? "bg-white/20" : "bg-gray-50"
                      }`}
                    >
                      {plan.icon}
                    </div>
                  </div>
                  <h3
                    className={`text-xl lg:text-2xl font-bold mb-2 ${
                      plan.gradient ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-xs lg:text-sm mb-4 ${
                      plan.gradient ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price Section */}
                  <div className="mb-6">
                    {plan.originalPrice && (
                      <div
                        className={`text-sm line-through mb-1 ${
                          plan.gradient ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {plan.originalPrice} / {plan.period}
                      </div>
                    )}
                    <div className="flex items-baseline justify-center">
                      <span
                        className={`text-3xl lg:text-4xl font-extrabold ${
                          plan.gradient ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`ml-2 text-base lg:text-lg font-medium ${
                          plan.gradient ? "text-blue-100" : "text-gray-600"
                        }`}
                      >
                        / {plan.period}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex-1 mb-6 space-y-3">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start group/feature">
                        <div className="mr-3 mt-0.5 flex-shrink-0">
                          {feature.included ? (
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                feature.highlight
                                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                  : "bg-green-500"
                              }`}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                              <X className="w-3 h-3 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <span
                          className={`text-sm leading-relaxed group-hover/feature:translate-x-1 transition-transform duration-200 ${
                            plan.gradient
                              ? feature.included
                                ? "text-blue-50"
                                : "text-blue-200 opacity-60"
                              : feature.included
                              ? "text-gray-700"
                              : "text-gray-400"
                          } ${feature.highlight ? "font-semibold" : ""}`}
                        >
                          {feature.icon && (
                            <span className="mr-2">{feature.icon}</span>
                          )}
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Action Button */}
                <div className="mt-auto">
                  <button
                    className={`w-full py-3 lg:py-4 px-4 lg:px-6 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                      plan.gradient
                        ? "bg-white text-blue-600 hover:bg-gray-50 hover:text-blue-700"
                        : plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    } group/button`}
                  >
                    <span className="flex items-center justify-center">
                      {plan.action}
                      <div className="ml-2 transform group-hover/button:translate-x-1 transition-transform duration-200">
                        {plan.gradient ? (
                          <Crown className="w-4 h-4 lg:w-5 lg:h-5" />
                        ) : (
                          <Zap className="w-4 h-4 lg:w-5 lg:h-5" />
                        )}
                      </div>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              30-day money-back guarantee
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Cancel anytime
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              Secure payment
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

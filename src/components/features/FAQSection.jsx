import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import ContactForm from "../ContactForm";

export default function FAQSection() {
  const ref = useRef(null);
  const [openItems, setOpenItems] = useState({});
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // stagger reveal on scroll
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll(".faq-item"));
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

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const faqData = [
    {
      question: "What is MatchIN?",
      answer:
        "MatchIN is a revolutionary AI fashion matching platform that helps you discover perfect outfit combinations using advanced artificial intelligence. Upload your garments and get personalized styling suggestions that match your styles and preferences.",
    },
    {
      question: "How does it work?",
      answer:
        "Simply upload photos of your clothing items and describe your style preferences. Our AI analyzes your garments and creates stunning outfit combinations. The system understands fashion rules, color coordination, and style compatibility to suggest looks that work perfectly together.",
    },
    {
      question: "How is it better than other fashion apps?",
      answer:
        "MatchIN excels in understanding personal style, seasonal trends, and occasion-appropriate matching. Our AI considers fabric types, colors, patterns, and fit to create cohesive outfits. Unlike basic matching apps, we provide styling rationale and suggest alternatives for versatile wardrobe planning.",
    },
    {
      question: "Can I use it for professional styling?",
      answer:
        "Yes! MatchIN is perfect for personal stylists, fashion consultants, and retail professionals. Many users leverage it for client consultations, wardrobe planning, and creating lookbooks. The high-quality outfit suggestions are suitable for professional styling services.",
    },
    {
      question: "What types of garments can it handle?",
      answer:
        "MatchIN handles all clothing categories including tops, bottoms, dresses, outerwear, shoes, and accessories. It excels at understanding different styles from casual to formal wear, seasonal pieces, and special occasion outfits while maintaining fashion-forward combinations.",
    },
    {
      question: "Where can I try MatchIN?",
      answer:
        "You can try MatchIN through our web platform. Simply upload your garment photos, set your style preferences, and watch as our AI creates personalized outfit combinations with incredible accuracy and style consistency.",
    },
    {
      question: "What are credits and how do they work?",
      answer:
        "2 credits generate 1 high-quality image. Credits are automatically refilled at the start of each billing cycle - monthly for monthly plans, all at once for yearly plans.",
    },
    {
      question: "Can I change my plan anytime?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.",
    },
    {
      question: "Do unused credits roll over?",
      answer:
        "Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period. We recommend choosing a plan based on your actual usage needs.",
    },
    {
      question: "What payment methods are supported?",
      answer:
        "We support Credit cards, Debit cards, FX Payment, Touch'n Go, Paypal, and various other payment methods. All payments are processed through secure third-party payment platforms.",
    },
    {
      question: "What is your 30-day money-back guarantee?",
      answer:
        "We offer a full 30-day money-back guarantee on all paid plans. If you're not completely satisfied with MatchIN for any reason, simply contact our support team within 30 days of your purchase, and we'll process a full refund - no questions asked. This gives you risk-free opportunity to explore all features and see if MatchIN meets your styling needs.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime with just a few clicks. Go to your account settings, select 'Billing & Subscription', and click 'Cancel Subscription'. Your subscription will remain active until the end of your current billing period, and you'll continue to have full access to all features until then. No cancellation fees or penalties apply.",
    },
    {
      question: "What happens when I cancel my subscription?",
      answer:
        "When you cancel, your subscription remains active until the end of your current billing period. You'll keep all your credits and can continue using MatchIN normally. After the period ends, your account switches to the free tier, and you'll retain access to your saved outfits and basic features. You can reactivate your subscription anytime without losing your data.",
    },
    {
      question: "How do refunds work?",
      answer:
        "Refunds are processed within 5-7 business days back to your original payment method. For the 30-day guarantee, we provide full refunds regardless of usage. For mid-cycle cancellations, we offer prorated refunds for unused time on annual plans. Monthly subscriptions are refunded if cancelled within 48 hours of purchase. All refund requests are handled promptly by our support team.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Absolutely! Customer satisfaction is our top priority. Within 30 days of purchase, you can request a full refund for any reason - whether you didn't find the styling suggestions helpful, the platform didn't meet your expectations, or you simply changed your mind. We believe you should only pay for services that truly add value to your life.",
    },
    {
      question: "What if I accidentally purchased the wrong plan?",
      answer:
        "No worries! Contact our support team immediately, and we'll help you switch to the right plan. If you contact us within 24 hours of purchase, we can often make the change without any additional charges. For plan upgrades, you'll only pay the prorated difference. For downgrades, we'll process a refund for the difference.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative mx-auto max-w-4xl px-6 py-24 md:py-32"
    >
      {/* Header */}
      <div className="mb-16 text-center">
        <h2
          className="text-3xl font-extrabold tracking-tight md:text-4xl mb-4"
          style={{ color: "#1f1f1f" }}
        >
          Frequently Asked Questions
        </h2>
        <p
          className="text-base md:text-lg max-w-2xl mx-auto"
          style={{ color: "#8a8988" }}
        >
          Find answers to common questions about our pricing, credits, and
          policies.
        </p>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className="faq-item border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              transitionDelay: `${index * 50}ms`,
            }}
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <span
                className="text-lg font-semibold tracking-tight pr-4"
                style={{ color: "#1f1f1f" }}
              >
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                  openItems[index] ? "rotate-180" : ""
                }`}
                style={{ color: "#8a8988" }}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems[index] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 pb-5 pt-0">
                <div className="h-px bg-gray-200 mb-4"></div>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#6b7280" }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support Section */}
      <div className="mt-16 text-center">
        <p
          className="text-xl md:text-2xl font-medium mb-8 leading-relaxed"
          style={{ color: "#1a202c" }}
        >
          Have more questions? We're here to help
        </p>
        <button
          onClick={() => setIsContactFormOpen(true)}
          className="inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(59,130,246,0.4)] hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            color: "#ffffff",
          }}
        >
          Contact Support
        </button>
      </div>

      <style>{`
        .faq-item {
          transition: var(--easing, cubic-bezier(.21,.8,.35,1)) 0.3s;
        }
      `}</style>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </section>
  );
}

import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Gift, Zap, ShieldCheck, Star, Sparkles } from "lucide-react";

// NOTE: High-resolution e-commerce fashion banner images imported from local assets
import banner1 from "../../assets/banner-1.webp";
import banner2 from "../../assets/banner-2.webp";
import banner3 from "../../assets/banner-3.webp";

// NOTE: Dynamic carousel slides featuring background imagery, titles, and value propositions
const slides = [
  {
    title: "Welcome to Cartzy Shopping",
    description: "Discover curated collections across trending fashion, footwear, and luxury accessories with member benefits.",
    icon: ShoppingBag,
    image: banner1,
    badge: "Trending 2026 Collection",
  },
  {
    title: "Exclusive Deals Just for You",
    description: "Unlock limited-time discounts up to 60% off on top global fashion and premier lifestyle brands.",
    icon: Gift,
    image: banner2,
    badge: "Seasonal Flash Sale",
  },
  {
    title: "Fast & Secure Checkout",
    description: "Experience effortless, instantaneous checkout with PayPal integration and bank-grade encryption.",
    icon: Zap,
    image: banner3,
    badge: "Seamless Payments",
  },
  {
    title: "Safe & Trusted Shopping",
    description: "100% verified authentic merchandise with hassle-free 30-day returns and dedicated support.",
    icon: ShieldCheck,
    image: banner1,
    badge: "Buyer Protection Guarantee",
  },
];

function AuthLayout() {
  const [index, setIndex] = useState(0);

  // Automatically cycle through showcase slides every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = slides[index].icon;

  return (
    // NOTE: min-h-screen lg:h-screen and overflow-hidden ensure the login layout
    // fits 100% edge-to-edge with the browser window without any unwanted vertical scrollbar on desktop.
    <div className="flex min-h-screen lg:h-screen w-full overflow-hidden">
      
      {/* NOTE: Left-side hero showcase panel with high-res photography aligned to window edge */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 h-full p-8 xl:p-12 overflow-hidden bg-zinc-950">
        
        {/* Background Image with smooth crossfade transitions */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={slides[index].image}
              alt="Cartzy Lifestyle"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              // NOTE: object-[78%_center] aligns directly with the models on the right side of the banner,
              // ensuring the photograph is properly positioned and visible within the panel.
              className="h-full w-full object-cover object-[78%_center]"
            />
          </AnimatePresence>

          {/* Cinematic dark gradients for contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-zinc-950/40 to-transparent" />

          {/* Subtle warm ambient lighting glow */}
          <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        </div>

        {/* Top Header: Brand Logo & Season Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-500/30">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">Cartzy</span>
              <span className="block text-[10px] font-bold tracking-widest uppercase text-amber-400">
                Premium Store
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs font-medium text-zinc-200 backdrop-blur-md border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            New Collection
          </span>
        </div>

        {/* Center Animated Feature Card (Glassmorphism) */}
        <div className="relative z-10 my-auto max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-white/15 bg-white/10 p-7 xl:p-8 shadow-2xl backdrop-blur-xl"
            >
              {/* Feature Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-semibold text-amber-300 border border-amber-400/30 mb-4">
                <CurrentIcon className="h-3.5 w-3.5 text-amber-400" />
                <span>{slides[index].badge}</span>
              </div>

              {/* Slide Title */}
              <h2 className="text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight text-white mb-2.5">
                {slides[index].title}
              </h2>

              {/* Slide Description */}
              <p className="text-sm leading-relaxed text-zinc-300 mb-5">
                {slides[index].description}
              </p>

              {/* Social Proof / Star Reviews */}
              <div className="flex items-center gap-3 pt-3.5 border-t border-white/10">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-zinc-300">
                  4.9/5 from 10,000+ satisfied shoppers
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-2 mt-5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Trust & Authenticity Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-5 border-t border-white/10 text-white">
          <div>
            <p className="text-lg font-bold text-amber-400">100%</p>
            <p className="text-xs text-zinc-400">Authentic Brands</p>
          </div>
          <div>
            <p className="text-lg font-bold text-amber-400">24/7</p>
            <p className="text-xs text-zinc-400">Priority Support</p>
          </div>
          <div>
            <p className="text-lg font-bold text-amber-400">Fast</p>
            <p className="text-xs text-zinc-400">Express Delivery</p>
          </div>
        </div>
      </div>

      {/* NOTE: Right-side form panel flush with screen height, scrollable only if needed on small displays */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen lg:h-full bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

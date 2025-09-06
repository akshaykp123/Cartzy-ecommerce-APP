import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ShoppingBag, Gift, Zap, ShieldCheck } from "lucide-react";

const messages = [
  { text: "Welcome to Cartzy Shopping", icon: ShoppingBag },
  { text: "Exclusive Deals Just for You", icon: Gift },
  { text: "Fast & Secure Checkout", icon: Zap },
  { text: "Safe & Trusted Shopping", icon: ShieldCheck },
];

function AuthLayout() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = messages[index].icon;

  return (
    <div className="flex min-h-screen w-full">
      {/* Left interactive panel with persistent Cartzy title */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 px-12 py-16 
        bg-gradient-to-br from-black via-gray-900 to-black animate-gradient space-y-12">
        
        {/* Persistent site name */}
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">Cartzy</h1>

        <div className="max-w-md space-y-8 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center space-y-6"
            >
              <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.6 }}
              >
                <CurrentIcon className="w-16 h-16 text-yellow-400 drop-shadow-lg" />
              </motion.div>
              <h2 className="text-2xl font-bold tracking-tight leading-snug">
                {messages[index].text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {messages.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-yellow-400" : "bg-gray-500"}`}
                animate={{ scale: i === index ? 1.3 : 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right panel with full-page padding for login/register */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

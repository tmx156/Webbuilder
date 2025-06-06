import { motion } from "framer-motion";
import SignupForm from "./signup-form";
import WebGLBackground from "./webgl-background";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-200 via-peach-200 to-rose-200 overflow-hidden">
      {/* Subtle animated overlay */}
      <div className="absolute inset-0 -z-10">
        <WebGLBackground />
      </div>
      
      {/* Brand name at top */}
      <motion.div 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h3 className="text-lg md:text-xl font-light tracking-[0.2em] text-gray-700 uppercase">
          LEVELONETALENT
        </h3>
      </motion.div>

      <div className="container mx-auto px-4 flex items-center justify-between min-h-screen">
        {/* Left side - Text and Form */}
        <div className="w-full lg:w-1/2 space-y-8 pt-20 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-amber-900 leading-tight mb-4">
              MODELS WANTED
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-light mb-8">
              All ages, All backgrounds. One chance to shine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            <SignupForm />
          </motion.div>
        </div>

        {/* Right side - Model Image */}
        <motion.div 
          className="hidden lg:block w-1/2 h-screen relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b169?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=1200" 
            alt="Professional model portrait" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
}

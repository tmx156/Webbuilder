import { motion } from "framer-motion";
import SignupForm from "./signup-form";
import WebGLBackground from "./webgl-background";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380" 
          alt="Diverse fashion models in editorial style" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* WebGL-style animated overlay */}
      <div className="absolute inset-0 -z-10">
        <WebGLBackground />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white drop-shadow-2xl mb-4"
          style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          MODELS WANTED
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-8 drop-shadow-lg"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          All ages. All backgrounds. One chance to shine.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <SignupForm />
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import SignupForm from "./signup-form";
import WebGLBackground from "./webgl-background";

// Add categories data for the boxes at the bottom
const categories = [
  {
    id: "child-teen",
    title: "Child & Teen",
    description: "Fresh faces, big dreams",
  },
  {
    id: "male",
    title: "Male",
    description: "Editorial. Commercial. Iconic.",
  },
  {
    id: "female",
    title: "Female",
    description: "From beauty to catwalk.",
  },
  {
    id: "mature",
    title: "Mature",
    description: "Style has no age.",
  }
];

export default function HeroSection({ categoryOverride }: { categoryOverride?: string }) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image - Extended to cover both sections */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380')"
        }}
        aria-label="Diverse fashion models in editorial style"
      ></div>
      
      {/* WebGL-style animated overlay - Extended to cover both sections */}
      <div className="absolute inset-0 -z-10">
        <WebGLBackground />
      </div>
      
      {/* Main Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-4">
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
            <SignupForm categoryOverride={categoryOverride} />
          </motion.div>
        </div>
      </section>
      
      {/* Category boxes in a separate section below the hero */}
      <section className="py-4 relative z-10">
        <div className="grid grid-cols-4 gap-2 px-4 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-black/50 transition-all duration-300"
            >
              <div className="p-3 text-white text-center">
                <h3 className="text-sm md:text-base font-medium">{category.title}</h3>
                <p className="text-xs text-white/80 hidden md:block">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

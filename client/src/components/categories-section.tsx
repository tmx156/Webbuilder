import { motion, useScroll, useTransform, useSpring, useInView, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const categories = [
  {
    id: "child-teen",
    title: "Child & Teen",
    description: "Baby, toddlers, children, teens. Our child and teen division specializes in nurturing young talent with a focus on positive experiences and age-appropriate opportunities.",
    image: "https://i.imgur.com/WzMXrI5.jpeg",
    accent: "#f472b6"
  },
  {
    id: "male",
    title: "Male",
    description: "All ages. Our male models represent diverse looks and styles for fashion, commercial and editorial campaigns worldwide.",
    image: "https://i.imgur.com/35FAqwA.jpeg",
    accent: "#60a5fa"
  },
  {
    id: "female",
    title: "Female",
    description: "All ages, all sizes, all shapes. Our female models grace magazine covers, runway shows, and campaigns for the world's most prestigious brands.",
    image: "https://i.imgur.com/mBR8EGf.jpeg",
    accent: "#a855f7"
  },
  {
    id: "mature",
    title: "Mature",
    description: "Style has no age. Our mature division celebrates elegance and sophistication, representing distinguished models for luxury and lifestyle brands.",
    image: "https://i.imgur.com/yOBm9Wh.jpeg",
    accent: "#2dd4bf"
  }
];

function CategoryCard({ category, index }: { category: any, index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      key={category.id}
      ref={cardRef}
      className="group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      whileHover={{ y: -8 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-3xl transition-all duration-300 border-b-4 relative" style={{ borderColor: category.accent }}>
        {/* Animated border glow effect */}
        <motion.div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
          style={{ 
            boxShadow: `0 0 30px ${category.accent}40, 0 0 60px ${category.accent}20`,
          }}
          animate={{
            boxShadow: [
              `0 0 30px ${category.accent}40, 0 0 60px ${category.accent}20`,
              `0 0 40px ${category.accent}60, 0 0 80px ${category.accent}30`,
              `0 0 30px ${category.accent}40, 0 0 60px ${category.accent}20`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />

        {/* Animated bottom border shimmer */}
        <motion.div 
          className="absolute bottom-0 left-0 h-1 rounded-full"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${category.accent}, transparent)`,
            width: "100%"
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.5
          }}
        />

        {/* Image side */}
        <div className="h-80 overflow-hidden md:order-last relative">
          {/* Hover effect overlay */}
          <div className="absolute inset-0 z-10 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          
          {/* Animated accent corner */}
          <motion.div 
            className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-20 group-hover:opacity-40"
            style={{ backgroundColor: category.accent }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          
          <img 
            src={category.image}
            alt={`${category.title} model`}
            className="w-full h-full object-cover object-center scale-90"
            style={{ objectPosition: "center 30%" }}
          />
        </div>
        
        {/* Content side */}
        <div className="bg-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Animated light streaks */}
          <motion.div 
            className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{ 
              background: `linear-gradient(45deg, transparent 30%, ${category.accent}80 50%, transparent 70%)`
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.8
            }}
          />

          {/* Category label */}
          <div className="mb-6">
            <motion.span 
              className="uppercase text-xs tracking-widest font-semibold bg-gray-100 px-3 py-1 rounded-sm relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              {category.title}
              {/* Label shimmer effect */}
              <motion.div 
                className="absolute inset-0 opacity-30"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${category.accent}60, transparent)`
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3
                }}
              />
            </motion.span>
          </div>
          
          {/* Title */}
          <div>
            <h3 className="text-4xl font-serif font-bold mb-6">
              {category.title}
            </h3>
            
            {/* Animated Divider */}
            <motion.div 
              className="h-1 mb-6 rounded-full relative overflow-hidden"
              style={{ backgroundColor: `${category.accent}20` }}
              initial={{ width: 0 }}
              animate={isInView ? { width: "4rem" } : { width: 0 }}
              transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
            >
              {/* Animated accent fill */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: category.accent }}
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 + 0.8 }}
              />
              
              {/* Continuous shimmer effect */}
              <motion.div 
                className="absolute inset-0 rounded-full opacity-60"
                style={{ 
                  background: `linear-gradient(90deg, transparent, white, transparent)`
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4 + 1
                }}
              />
            </motion.div>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-8">
              {category.description}
            </p>
            
            {/* Explore link with animated underline */}
            <div className="inline-block group/link">
              <span className="text-sm uppercase tracking-widest font-medium pb-1 relative">
                Explore Models
                {/* Animated underline */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 rounded-full"
                  style={{ backgroundColor: category.accent }}
                  initial={{ width: "100%" }}
                  whileHover={{ 
                    width: ["100%", "0%", "100%"],
                    transition: { duration: 0.6 }
                  }}
                />
                
                {/* Hover glow effect */}
                <motion.div 
                  className="absolute -inset-2 rounded opacity-0 group-hover/link:opacity-100 transition-opacity duration-300"
                  style={{ 
                    backgroundColor: `${category.accent}10`,
                    boxShadow: `0 0 20px ${category.accent}30`
                  }}
                />
              </span>
            </div>
          </div>
          
          {/* Issue number with pulse effect */}
          <div className="absolute top-10 right-10">
            <motion.span 
              className="text-9xl font-serif opacity-5 font-bold"
              animate={{
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: index * 0.5
              }}
            >
              {index + 1}
            </motion.span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CategoriesSection() {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Generate random positions for dots but keep them stable
  const [dotsPositions] = useState(() => 
    Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2
    }))
  );

  return (
    <section 
      className="py-32 px-6 relative overflow-hidden" 
      ref={sectionRef}
    >
      {/* Static background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-purple-50 to-blue-50 -z-20" />
      
      {/* Static dots background - no animation, hidden on mobile */}
      <div className="hidden md:block absolute inset-0 -z-10 opacity-60">
        {dotsPositions.map((dot, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-pink-300 to-purple-300"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              top: `${dot.y}%`,
              left: `${dot.x}%`,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>
      
      {/* Static floating bubble elements - hidden on mobile */}
      <div className="hidden md:block absolute inset-0 opacity-10 -z-10">
        <div className="absolute w-full h-full">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-pink-300 to-purple-300"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
                filter: 'blur(50px)',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"></div>
      
      {/* Static abstract shape - hidden on mobile */}
      <div className="hidden md:block absolute top-40 right-10 w-64 h-64 rounded-full bg-pink-100 filter blur-3xl opacity-30 -z-10" />
      
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
            Discover Your Lane
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            Every model has a unique path. Find yours with our specialized categories and expert guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

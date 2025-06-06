import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    title: "Featured in Vogue",
    description: "LevelOneTalent helped me land my first major editorial spread with top photographers.",
    stat: "200%",
    statLabel: "Booking increase",
    bgColor: "bg-gradient-to-br from-orange-100 to-amber-100"
  },
  {
    id: 2,
    title: "Runway Success", 
    description: "From application to Fashion Week in just 6 months. Now walking for major brands.",
    stat: "6",
    statLabel: "Months to runway",
    bgColor: "bg-gradient-to-br from-rose-100 to-pink-100"
  },
  {
    id: 3,
    title: "Brand Ambassador",
    description: "Now representing luxury brands worldwide and building my personal brand.",
    stat: "10+",
    statLabel: "Brand partnerships",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-100"
  }
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section className="relative py-20 px-6 overflow-hidden" ref={ref}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white via-orange-50 to-rose-50"
        style={{ y: backgroundY }}
      />
      
      <motion.div 
        className="relative z-10 max-w-6xl mx-auto"
        style={{ y: contentY }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real results from real models who started their journey with us
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="group"
              initial={{ opacity: 0, y: 80, rotateX: 45 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: 45 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                y: -15,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
            >
              <div className={`${testimonial.bgColor} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden border border-white/50`}>
                {/* Floating decoration */}
                <motion.div
                  className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-300/20 to-rose-300/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: index * 2
                  }}
                />

                <div className="relative z-10">
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-amber-900 mb-1">
                      {testimonial.stat}
                    </div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">
                      {testimonial.statLabel}
                    </div>
                  </motion.div>

                  <h3 className="text-xl font-serif font-bold text-gray-800 mb-3 text-center">
                    {testimonial.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed text-center">
                    {testimonial.description}
                  </p>

                  <motion.div
                    className="mt-6 w-12 h-1 bg-gradient-to-r from-orange-400 to-rose-400 mx-auto rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: index * 0.2 + 0.8, duration: 0.6 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional visual elements */}
        <motion.div
          className="flex justify-center mt-16 space-x-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

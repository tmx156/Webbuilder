import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    title: "Featured in Vogue",
    description: "LevelOneTalent helped me land my first major editorial spread.",
    icon: "📸",
    color: "bg-rose-400"
  },
  {
    id: 2,
    title: "Runway Success", 
    description: "From application to Fashion Week in just 6 months!",
    icon: "🏆",
    color: "bg-mint-400"
  },
  {
    id: 3,
    title: "Brand Ambassador",
    description: "Now representing luxury brands worldwide.",
    icon: "⭐",
    color: "bg-purple-400"
  }
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-peach-100 to-rose-100" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2 
          className="text-4xl font-serif font-bold text-gray-800 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          Success Stories
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="glassmorphism rounded-2xl p-6 transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`flex items-center justify-center w-16 h-16 ${testimonial.color} rounded-full mx-auto mb-4 text-2xl`}>
                {testimonial.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {testimonial.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {testimonial.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

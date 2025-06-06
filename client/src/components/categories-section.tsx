import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    id: "child-teen",
    title: "Child & Teen",
    description: "Fresh faces, big dreams",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    gradient: "from-mint-400/20 to-mint-500/30",
    icon: "⭐",
    iconColor: "text-mint-500"
  },
  {
    id: "male",
    title: "Male",
    description: "Editorial. Commercial. Iconic.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    gradient: "from-blue-400/20 to-blue-500/30",
    icon: "👑",
    iconColor: "text-blue-500"
  },
  {
    id: "female",
    title: "Female",
    description: "From beauty to catwalk.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    gradient: "from-rose-400/20 to-rose-500/30",
    icon: "💎",
    iconColor: "text-rose-500"
  },
  {
    id: "mature",
    title: "Mature",
    description: "Style has no age.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    gradient: "from-purple-400/20 to-purple-500/30",
    icon: "💖",
    iconColor: "text-purple-500"
  }
];

export default function CategoriesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-peach-50" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Discover Your Lane
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every model has a unique path. Find yours with our specialized categories and expert guidance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`bg-gradient-to-br ${category.gradient} rounded-3xl p-6 shadow-lg hover:shadow-2xl border border-white/50 overflow-hidden relative transition-all duration-300`}>
                <img 
                  src={category.image}
                  alt={`${category.title} model`}
                  className="w-32 h-32 mx-auto mb-6 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                
                <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2 text-center">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {category.description}
                </p>
                
                <motion.div 
                  className="absolute top-4 right-4 text-2xl"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className={category.iconColor}>{category.icon}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

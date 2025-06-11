import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import SignupForm from "./signup-form";
import TestimonialForm from "./testimonial-form";

interface Testimonial {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  accent: string;
  brand: string;
  location: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Martin",
    title: "Print Publication Success",
    description: "My son just appeared in his first print publication! The whole team, especially Paul, have been amazing from day one.",
    image: "https://i.imgur.com/dKBE3pC.png",
    accent: "from-pink-400 to-rose-300",
    brand: "Print Publication",
    location: "Liverpool"
  },
  {
    id: 2,
    name: "Alexander",
    title: "Magazine Success", 
    description: "Just shot my first magazine spread—never thought I’d see myself in print. Massive thanks to Sarah and the amazing team at LevelOneTalent!",
    image: "https://www.printingbrooklyn.com/wp-content/uploads/2016/06/fashion-lookbook-design-1.jpg",
    accent: "from-blue-400 to-indigo-300",
    brand: "Magazine",
    location: "Bolton"
  },
  {
    id: 3,
    name: "Marcus",
    title: "Brand Ambassador Success",
    description: "Thanks to Steve and everyone at LevelOneTalent, I’m now a brand ambassador for a men’s smartwear label. The opportunities just keep coming.",
    image: "https://i.imgur.com/gctJ1ID.png",
    accent: "from-purple-400 to-violet-300",
    brand: "Brand Ambassador",
    location: "London"
  }
];

const additionalTestimonials: Testimonial[] = [
  {
    id: 4,
    name: "Isabella",
    title: "Look Book Success",
    description: "From the first call to my latest booking for a look book, everything has been smooth. The LevelOneTalent team is brilliant.",
    image: "https://i.imgur.com/ntxQR8g.jpeg",
    accent: "from-amber-400 to-yellow-300",
    brand: "Look Book",
    location: "Bradford"
  },
  {
    id: 5,
    name: "Ava",
    title: "Short Film Success",
    description: "A few months after signing up, I landed a role in a short film. It wouldn’t have happened without Layla’s support and guidance. So grateful!",
    image: "https://i.imgur.com/1rUiuFm.png",
    accent: "from-teal-400 to-cyan-300",
    brand: "Short Film",
    location: "Newcastle"
  },
  {
    id: 6,
    name: "Olivia",
    title: "Online Officewear Campaign Success",
    description: "Paul and Sarah truly believed in me from the start. Just wrapped a campaign for a women’s online officewear brand—couldn’t be happier",
    image: "https://i.imgur.com/HGPtWsT.png",
    accent: "from-indigo-400 to-purple-300",
    brand: "Smartwear",
    location: "Oxford"
  },
  {
    id: 7,
    name: "David",
    title: "Lifestyle Magazine Success",
    description: "As a mature model, I never expected to see myself in a lifestyle magazine. Andrea and the crew gave me the confidence to go for it.",
    image: "https://i.imgur.com/dFHmTqE.png",
    accent: "from-green-400 to-emerald-300",
    brand: "Lifestyle Magazine",
    location: "Manchester"
  },
  {
    id: 8,
    name: "Emma",
    title: "Editorial Excellence",
    description: "Landing my first editorial spread felt surreal. Layla’s guidance and the team's support made it all possible—can’t thank them enough!",
    image: "https://i.imgur.com/tvcns7A.png",
    accent: "from-red-400 to-pink-300",
    brand: "Editorial",
    location: "Leeds"
  }
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const TestimonialCard = ({ testimonial, index, delay = 0 }: { testimonial: Testimonial; index: number; delay?: number }) => (
    <motion.div
      key={testimonial.id}
      className="group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay }}
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col relative md:hover:-translate-y-2 md:transition-transform md:duration-300">
        {/* Background gradient overlay */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${testimonial.accent}`}></div>
        
        {/* Top section with image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={testimonial.image}
            alt={testimonial.name}
            className={`w-full h-full object-cover ${
              testimonial.id === 5 ? 'object-[center_25%]' : 
              testimonial.id === 6 ? 'object-[center_30%]' : 
              testimonial.id === 8 ? 'object-[center_20%]' : 
              'object-top'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Brand badge */}
          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
            {testimonial.brand}
          </div>
          
          {/* Location badge */}
          <div className="absolute bottom-4 left-4 bg-black/70 rounded-full px-3 py-1 text-xs font-medium text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {testimonial.location}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 flex flex-col flex-grow relative">
          {/* Quote mark */}
          <div className="absolute top-4 right-4 text-4xl text-gray-200 font-serif z-10">
            "
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {testimonial.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow italic">
            "{testimonial.description}"
          </p>
          
          {/* Model info */}
          <div className="flex items-center mt-auto">
            <div className="mr-4">
              <p className="font-medium text-gray-900">{testimonial.name}</p>
              <div className={`h-0.5 w-12 bg-gradient-to-r ${testimonial.accent} mt-1`}></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <section 
        className="py-32 px-6 relative overflow-hidden bg-gray-50"
      >
        <div className="max-w-6xl mx-auto" ref={ref}>
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 mb-4">
              REAL STORIES
            </span>
            <h2 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4 tracking-tight">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Hear from the models who have transformed their careers with our guidance
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              >
                <TestimonialCard testimonial={testimonial} index={index} />
              </motion.div>
            ))}
          </div>
        
          {/* Call to action */}
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button 
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Read More Success Stories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => {
            if (!showForm) setShowModal(false);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white rounded-2xl w-full relative shadow-2xl ${showForm ? 'max-w-lg' : 'max-w-7xl max-h-[90vh] overflow-y-auto'}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {!showForm ? (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 bg-white z-10 px-8 pt-8 pb-4 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                        More Success Stories
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Discover how our models achieved their dreams
                      </p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {additionalTestimonials.map((testimonial, index) => (
                      <TestimonialCard 
                        key={testimonial.id}
                        testimonial={testimonial} 
                        index={index} 
                        delay={index * 0.1}
                      />
                    ))}
                  </div>

                  {/* CTA at bottom of modal */}
                  <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <p className="text-gray-600 mb-4">Ready to start your modeling journey?</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Apply Now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <TestimonialForm 
                onClose={() => {
                  setShowForm(false);
                  setShowModal(false);
                }}
                onBack={() => setShowForm(false)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

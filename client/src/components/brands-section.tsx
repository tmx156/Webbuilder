import { motion } from "framer-motion";

// Brand logos data
const brands = [
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
  },
  {
    name: "H&M",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/1200px-H%26M-Logo.svg.png",
  },
  {
    name: "JD Sports",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/JD_Sports_logo.svg/1200px-JD_Sports_logo.svg.png",
  },
  {
    name: "ITV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/ITV_logo_2013.svg/1200px-ITV_logo_2013.svg.png",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
  },
  {
    name: "Disney",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1200px-Disney%2B_logo.svg.png",
  },
  {
    name: "Zara",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1200px-Adidas_Logo.svg.png",
  },
];

export default function BrandsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-rose-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-rose-100 rounded-full text-sm font-medium text-rose-700 mb-4">
            TRUSTED BY INDUSTRY LEADERS
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Our Models Represent Global Brands
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-500 to-orange-400 mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Gradient fades on sides for infinite scroll effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Marquee-style scrolling logos */}
          <div className="overflow-hidden py-10">
            <div className="flex items-center space-x-16 animate-marquee">
              {brands.map((brand) => (
                <div key={brand.name} className="flex-shrink-0">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-all duration-300"
                    width="120"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
              {/* Duplicate logos for continuous scroll effect */}
              {brands.map((brand) => (
                <div key={`${brand.name}-duplicate`} className="flex-shrink-0">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-all duration-300"
                    width="120"
                    height="64"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 italic">
            Our models have been featured in campaigns for these brands and many more
          </p>
          <div className="mt-8">
            <a 
              href="#" 
              className="inline-flex items-center px-6 py-3 border border-rose-200 rounded-full text-sm font-medium text-gray-700 hover:bg-rose-50 transition-colors duration-300"
            >
              View Success Stories
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
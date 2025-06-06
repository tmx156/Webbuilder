import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter } from "react-icons/fa";

const socialLinks = [
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaTiktok, href: "#", label: "TikTok" },
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaTwitter, href: "#", label: "Twitter" }
];

const footerLinks = [
  { label: "No registration fees", href: "#" },
  { label: "Privacy Policy", href: "#" }
];

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <footer className="relative py-16 px-6 overflow-hidden" ref={ref}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-rose-900"
        style={{ y: backgroundY }}
      />
      
      {/* Floating background elements */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-rose-400/10 rounded-full blur-2xl"
        animate={{ 
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-rose-400/10 to-amber-400/10 rounded-full blur-2xl"
        animate={{ 
          x: [0, -25, 0],
          y: [0, 15, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-white">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">LevelOneTalent</h3>
          <p className="text-orange-100 max-w-2xl mx-auto text-sm md:text-base">
            Connecting diverse talent with the world's leading fashion brands. 
            Your journey to becoming a professional model starts here.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                className="group flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:bg-white/20"
                initial={{ scale: 0, rotate: -180 }}
                animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.15, 
                  y: -3,
                  backgroundColor: "rgba(255, 255, 255, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <IconComponent className="text-white text-lg" />
              </motion.a>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="text-center border-t border-white/20 pt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 text-sm">
            {footerLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-orange-200 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
          
          <motion.div
            className="text-orange-200 text-xs md:text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            © 2024 LevelOneTalent. All rights reserved.
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}

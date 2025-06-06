import { motion } from "framer-motion";
import { FaInstagram, FaTiktok, FaFacebook, FaTwitter, FaShieldAlt } from "react-icons/fa";

const socialLinks = [
  { icon: FaInstagram, href: "#", color: "from-pink-500 to-rose-500" },
  { icon: FaTiktok, href: "#", color: "from-gray-800 to-gray-900" },
  { icon: FaFacebook, href: "#", color: "from-blue-600 to-blue-700" },
  { icon: FaTwitter, href: "#", color: "from-blue-400 to-blue-500" }
];

const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Contact", href: "#" }
];

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif font-bold mb-4">LevelOneTalent</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connecting diverse talent with the world's leading fashion brands. 
            Your journey to becoming a professional model starts here.
          </p>
        </div>
        
        <div className="flex justify-center gap-8 mb-12">
          {socialLinks.map((social, index) => {
            const IconComponent = social.icon;
            return (
              <motion.a
                key={index}
                href={social.href}
                className={`group flex items-center justify-center w-16 h-16 bg-gradient-to-r ${social.color} rounded-full transition-all duration-300 hover:shadow-lg`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent className="text-white text-2xl group-hover:animate-bounce" />
              </motion.a>
            );
          })}
        </div>
        
        <div className="text-center border-t border-gray-700 pt-8">
          <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm">
            {footerLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
          <p className="text-gray-400 text-sm mb-2">
            <FaShieldAlt className="inline mr-2" />
            No registration fees • Professional guidance • Industry connections
          </p>
          <p className="text-gray-500 text-xs">
            © 2024 LevelOneTalent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

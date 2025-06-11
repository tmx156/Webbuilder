import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';

interface NavigationItem {
  title: string;
  href: string;
}

interface NavigationMenuProps {
  logo?: string;
  logoText?: string;
  items?: NavigationItem[];
}

export default function NavigationMenu({
  logo,
  logoText = "LEVELONETALENT",
  items = [
    { title: "Home", href: "/" },
    { title: "Models", href: "/models" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" }
  ]
}: NavigationMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [animatedLogo, setAnimatedLogo] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Logo animation effect
  useEffect(() => {
    // Initialize with empty array
    setAnimatedLogo([]);
    
    // Animate each letter one by one
    const logoChars = logoText.split('');
    let timer: ReturnType<typeof setTimeout>;
    
    logoChars.forEach((char, index) => {
      timer = setTimeout(() => {
        setAnimatedLogo(prev => [...prev, char]);
        
        // Check if animation is complete
        if (index === logoChars.length - 1) {
          setTimeout(() => setIsAnimating(false), 500);
        }
      }, 100 * index);
    });
    
    return () => clearTimeout(timer);
  }, [logoText]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-sm shadow-lg border-b border-stone-200" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          {logo ? (
            <img src={logo} alt="LevelOneTalent Logo" className="h-8 md:h-10" />
          ) : (
            <div className="relative">
              <span 
                className={`text-lg md:text-xl tracking-widest font-light overflow-hidden ${
                  scrolled ? "text-[#8B3A3A]" : "text-[#8B3A3A]"
                }`}
              >
                {animatedLogo.map((char, index) => (
                  <span 
                    key={index} 
                    className="inline-block animate-fadeIn"
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      opacity: isAnimating ? 0 : 1,
                      transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
                      transition: `opacity 0.5s ease, transform 0.5s ease`,
                      transitionDelay: `${index * 0.1}s`
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {items.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className={`text-base tracking-wide hover:text-opacity-80 transition-colors duration-200 ${
                scrolled ? "text-[#8B3A3A]" : "text-[#8B3A3A]"
              }`}
            >
              {item.title}
            </Link>
          ))}
          <button 
            className={`px-6 py-2 rounded-full font-medium text-white text-sm transition-all duration-300 ${
              scrolled ? "bg-[#F8B195] shadow-md" : "bg-[#F8B195]"
            }`}
          >
            APPLY NOW
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden focus:outline-none transition-colors duration-200 ${
            scrolled ? "text-[#8B3A3A]" : "text-[#8B3A3A]"
          }`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-md shadow-lg pt-2 pb-4">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {items.map((item, index) => (
              <Link 
                key={index} 
                href={item.href}
                className="py-2 text-base tracking-wide"
                style={{ color: '#8B3A3A' }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            <button 
              className="mt-2 px-6 py-2 rounded-full font-medium text-white text-sm w-full"
              style={{ backgroundColor: '#F8B195' }}
            >
              APPLY NOW
            </button>
          </div>
        </div>
      )}
    </nav>
  );
} 
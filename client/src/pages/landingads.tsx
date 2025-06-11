import React, { useState, useEffect, useRef } from 'react';
import SignupFormLanding from '../components/signup-form-landing';
import WebGLLuxuryEffect from '../components/webgl-luxury-effect';

// Enhanced Logo Header Component
const EnhancedLogoHeader = () => {
  const [animatedLogo, setAnimatedLogo] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const logoText = "LEVELONETALENT";

  useEffect(() => {
    setAnimatedLogo([]);
    const logoChars = logoText.split('');
    let timer: ReturnType<typeof setTimeout>;
    const isMobile = window.innerWidth < 768;
    const animationDelay = 120;
    const finalDelay = isMobile ? 400 : 800;
    logoChars.forEach((char, index) => {
      timer = setTimeout(() => {
        setAnimatedLogo(prev => [...prev, char]);
        if (index === logoChars.length - 1) {
          setTimeout(() => setIsAnimating(false), finalDelay);
        }
      }, animationDelay * index);
    });
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-3 transition-all duration-500 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-orange-200/30" 
        : "bg-transparent"
    }`}>
      <div className="container mx-auto flex justify-center md:justify-start">
        <div className="relative">
          <span 
            className={`text-xl md:text-lg lg:text-xl tracking-[0.3em] font-light overflow-hidden transition-all duration-500 ${
              scrolled ? "text-[#8B3A3A]" : "text-[#8B3A3A]"
            }`}
            style={{
              textShadow: scrolled 
                ? '2px 2px 4px rgba(139, 58, 58, 0.1)' 
                : '2px 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.6)',
              fontWeight: '300',
              letterSpacing: '0.3em'
            }}
          >
            {animatedLogo.map((char, index) => (
              <span 
                key={index} 
                className="inline-block"
                style={{ 
                  opacity: isAnimating ? 0 : 1,
                  transform: isAnimating ? 'translateY(20px) rotateX(90deg)' : 'translateY(0) rotateX(0deg)',
                  transition: `all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
                  transitionDelay: `${index * 0.12}s`,
                  transformOrigin: 'center bottom',
                  display: 'inline-block',
                  animation: !isAnimating ? `glow 3s ease-in-out infinite alternate` : 'none',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {char}
              </span>
            ))}
          </span>
          <div 
            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#F8B195] to-[#F67E7E] transition-all duration-1000"
            style={{
              width: isAnimating ? '0%' : '100%',
              boxShadow: '0 0 10px rgba(248, 177, 149, 0.6)',
              transitionDelay: `${logoText.length * 0.12 + 0.5}s`
            }}
          />
          <div 
            className="absolute inset-0 -z-10 blur-xl opacity-20 bg-gradient-to-r from-[#F8B195] to-[#F67E7E] transition-opacity duration-2000"
            style={{
              opacity: isAnimating ? 0 : 0.3,
              transitionDelay: `${logoText.length * 0.12 + 1}s`
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes glow {
          0% { text-shadow: 2px 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,255,0.6); }
          100% { text-shadow: 2px 2px 8px rgba(0,0,0,0.3), 0 0 25px rgba(248, 177, 149, 0.8), 0 0 35px rgba(248, 177, 149, 0.4); }
        }
      `}</style>
    </header>
  );
};

export default function LandingAdsPage() {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [formActive, setFormActive] = useState(false);
  const defaultMobileImage = "https://i.imgur.com/WIHorDD.jpeg";
  const [mobileBackgroundImage, setMobileBackgroundImage] = useState(defaultMobileImage);
  const formRef = useRef<HTMLDivElement>(null);
  const [currentGender, setCurrentGender] = useState<string>("");
  const [currentAge, setCurrentAge] = useState<string>("");

  const categories = [
    { id: "child-teen", title: "Child & Teen", description: "Fresh faces, big dreams", image: "https://i.imgur.com/WzMXrI5.jpeg" },
    { id: "male", title: "Male", description: "Editorial. Commercial. Iconic.", image: "https://i.imgur.com/35FAqwA.jpeg" },
    { id: "female", title: "Female", description: "From beauty to catwalk.", image: "https://i.imgur.com/mBR8EGf.jpeg" },
    { id: "mature", title: "Mature", description: "Style has no age", image: "https://i.imgur.com/yOBm9Wh.jpeg" }
  ];

  const modelImageUrl = "https://i.imgur.com/WzMXrI5.jpeg";
  const desktopImageUrl = "https://i.imgur.com/xuKHrEC.jpeg";
  const femaleImageUrl = "https://i.imgur.com/mBR8EGf.jpeg";
  const maleImageUrl = "https://i.imgur.com/35FAqwA.jpeg";
  const matureImageUrl = "https://i.imgur.com/yOBm9Wh.jpeg";
  const kidsImageUrl = "https://i.imgur.com/WzMXrI5.jpeg";

  const isMobileOrTablet = () => window.innerWidth < 1024;

  const handleGenderChange = (gender: string) => {
    setCurrentGender(gender);
    if (isMobileOrTablet()) {
      const ageNum = parseInt(currentAge, 10);
      if (!isNaN(ageNum) && ageNum >= 0 && ageNum <= 9) {
        setMobileBackgroundImage(kidsImageUrl);
        return;
      }
      if (gender === 'female') {
        if (!isNaN(ageNum) && ageNum > 50) {
          setMobileBackgroundImage(matureImageUrl);
        } else {
          setMobileBackgroundImage(femaleImageUrl);
        }
      } else if (gender === 'male') {
        setMobileBackgroundImage(maleImageUrl);
      } else if (gender === 'other') {
        setMobileBackgroundImage(defaultMobileImage);
        return;
      } else {
        setMobileBackgroundImage(defaultMobileImage);
      }
    }
  };

  const handleAgeChange = (age: string) => {
    setCurrentAge(age);
    if (isMobileOrTablet()) {
      const ageNum = parseInt(age, 10);
      if (!isNaN(ageNum) && ageNum >= 0 && ageNum <= 9) {
        setMobileBackgroundImage(kidsImageUrl);
        return;
      }
      if (currentGender === 'female') {
        if (!isNaN(ageNum) && ageNum > 50) {
          setMobileBackgroundImage(matureImageUrl);
        } else {
          setMobileBackgroundImage(femaleImageUrl);
        }
      } else if (currentGender === 'male') {
        setMobileBackgroundImage(maleImageUrl);
      } else if (currentGender === 'other') {
        setMobileBackgroundImage(defaultMobileImage);
        return;
      } else {
        setMobileBackgroundImage(defaultMobileImage);
      }
    }
  };

  const handleFormSubmitted = () => {
    setMobileBackgroundImage(defaultMobileImage);
    setCurrentGender("");
    setCurrentAge("");
  };

  useEffect(() => {
    const images = [modelImageUrl, desktopImageUrl, femaleImageUrl, maleImageUrl];
    let loadedCount = 0;
    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        setImagesLoaded(true);
      }
    };
    images.forEach(url => {
      const img = new window.Image();
      img.onload = handleImageLoad;
      img.src = url;
    });
    return () => { 
      images.forEach(url => {
        const img = new window.Image();
        img.onload = null;
      });
    };
  }, []);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const handleFocus = (e: FocusEvent) => {
      setFormActive(true);
      if (window.innerWidth < 768) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
          setTimeout(() => {
            target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
            setTimeout(() => {
              const viewportHeight = window.visualViewport?.height || window.innerHeight;
              const elementRect = target.getBoundingClientRect();
              const desiredPosition = viewportHeight * 0.3;
              if (elementRect.top > desiredPosition) {
                window.scrollBy({
                  top: elementRect.top - desiredPosition,
                  behavior: 'smooth'
                });
              }
            }, 300);
          }, 100);
        }
      }
    };
    const handleBlur = (e: FocusEvent) => {
      if (form && !form.contains(e.relatedTarget as Node)) {
        setFormActive(false);
      }
    };
    form.addEventListener('focusin', handleFocus);
    form.addEventListener('focusout', handleBlur);
    return () => {
      form.removeEventListener('focusin', handleFocus);
      form.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative" style={{ backgroundColor: 'transparent' }}>
      <EnhancedLogoHeader />
      <div className="absolute inset-0 w-full h-full z-5">
        {imagesLoaded ? (
          <>
            <img
              src={mobileBackgroundImage}
              alt="Model background"
              className="w-full h-full object-cover md:hidden transition-all duration-1000"
              style={{ objectPosition: "center center", objectFit: "cover" }}
            />
            <div
              className="hidden md:block w-full h-full"
              style={{
                backgroundImage: `url(${desktopImageUrl})`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'cover',
                backgroundPosition: '-11vw center',
                width: '100%',
                height: '100%',
                position: 'absolute',
                inset: 0,
                zIndex: 0
              }}
            />
          </>
        ) : (
          <div className="w-full h-full bg-[#FFE4D0]"></div>
        )}
      </div>
      <div className="absolute inset-0 w-full h-full z-10">
        <WebGLLuxuryEffect />
      </div>
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/10 via-transparent to-black/20 z-15"></div>
      {formActive && (
        <div className="fixed inset-0 bg-black/40 z-20 transition-opacity duration-300"></div>
      )}
      <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-between min-h-screen relative z-30">
        <div className="flex-1 flex flex-col items-center justify-center text-center w-full mt-16 md:mt-16">
          <div className="h-[20vh] md:h-[6vh]"></div>
          <h2 className="whitespace-nowrap text-4xl sm:text-5xl md:text-4xl lg:text-5xl font-serif font-black mb-2 md:mb-4 drop-shadow-lg" 
              style={{ 
                color: '#8B3A3A', 
                marginBottom: '10px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.5)',
                fontWeight: '900'
              }}>
            MODELS WANTED
          </h2>
          <p className="text-base sm:text-lg md:text-lg lg:text-xl mb-6 md:mb-6 font-bold drop-shadow-md max-w-4xl" 
             style={{ 
               color: '#8B3A3A',
               textShadow: '1px 1px 3px rgba(0,0,0,0.3), 0 0 8px rgba(255,255,255,0.4)',
               fontWeight: '700'
             }}>
            All ages. All backgrounds. One chance to shine.
          </p>
          <div
            ref={formRef}
            className={`w-full max-w-sm sm:max-w-md md:max-w-md lg:max-w-lg mx-auto p-8 sm:p-6 md:p-6 lg:p-7 rounded-3xl backdrop-blur-md bg-white/30 md:bg-white/0 border border-white/40 md:border-white/5 shadow-2xl mt-8 sm:mt-4 md:mt-4 lg:mt-5 transition-all duration-300 ${formActive ? 'scale-105 shadow-3xl z-40' : ''}`}
            style={{ 
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.25) 100%)',
              ...(window.innerWidth >= 768 ? { background: 'rgba(255,255,255,0.05)' } : {})
            }}
          >
            <h3 className="text-2xl md:text-xl lg:text-2xl font-serif font-black mb-4 md:mb-4 lg:mb-5 drop-shadow-md" 
                style={{ 
                  color: '#8B3A3A',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  fontWeight: '900'
                }}>
              Sign up
            </h3>
            <div className="space-y-5 md:space-y-4 lg:space-y-5">
              <SignupFormLanding onGenderChange={handleGenderChange} onAgeChange={handleAgeChange} onFormSubmitted={handleFormSubmitted} categoryOverride="landingads" />
            </div>
          </div>
        </div>

        {/* Compact Discover section for desktop */}
        <div className="w-full mt-4 md:mt-8 lg:mt-10 mb-4 md:mb-8 lg:mb-10">
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-serif font-black text-center mb-4 md:mb-6 lg:mb-8 drop-shadow-lg" 
              style={{ 
                color: '#8B3A3A',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.5)',
                fontWeight: '900'
              }}>
            DISCOVER YOUR LANE
          </h2>
          
          {/* Refined category cards for desktop */}
          <div className="flex flex-row justify-center w-full gap-2 md:gap-4 lg:gap-6 max-w-6xl mx-auto px-4 md:px-6">
            {categories.map((category) => (
              <div key={category.id} className="flex flex-col items-center w-1/4 md:w-auto md:flex-shrink-0">
                {/* Compact images for desktop */}
                <div className="rounded-3xl overflow-hidden mb-1 md:mb-3 lg:mb-4 w-full aspect-square md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-lg border-2 border-white/30 transition-transform duration-300 hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                </div>
                <h3 className="text-sm md:text-sm lg:text-base font-black text-center drop-shadow-md mb-1 md:mb-1 lg:mb-2" 
                    style={{ 
                      color: '#8B3A3A',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                      fontWeight: '900'
                    }}>
                  {category.title}
                </h3>
                <p className="text-xs md:text-xs lg:text-sm font-bold drop-shadow-sm text-center max-w-32 md:max-w-28 lg:max-w-32" 
                   style={{ 
                     color: '#8B3A3A',
                     textShadow: '1px 1px 1px rgba(0,0,0,0.2)',
                     fontWeight: '700'
                   }}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
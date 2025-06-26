import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaShieldAlt, FaCamera, FaArrowRight } from "react-icons/fa";
// Facebook Pixel tracking - no import needed

interface SignupData {
  name: string;
  email: string;
  age: string;
  gender: string;
  mobile: string;
  postcode: string;
  photo?: string | null;
  category?: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    age: "",
    gender: "",
    mobile: "",
    postcode: "",
    photo: null,
    category: ""
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Detect mobile keyboard open/close
  useEffect(() => {
    const handleResize = () => {
      // Check if we're on mobile
      if (window.innerWidth <= 768) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          // More accurate keyboard detection
          const keyboardHeight = window.innerHeight - visualViewport.height;
          const hasKeyboard = keyboardHeight > 100; // Lower threshold for better detection
          setIsMobileKeyboardOpen(hasKeyboard);
        }
      } else {
        setIsMobileKeyboardOpen(false);
      }
    };

    // Listen to both resize and visual viewport changes
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle input focus
  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
    
    // On mobile, add a small delay to ensure keyboard detection works
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          const keyboardHeight = window.innerHeight - visualViewport.height;
          const hasKeyboard = keyboardHeight > 100;
          setIsMobileKeyboardOpen(hasKeyboard);
        }
      }, 300);
    }
  };

  const handleInputBlur = () => {
    setFocusedInput(null);
    // Small delay before hiding keyboard state to prevent flickering
    setTimeout(() => {
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'SELECT') {
        setIsMobileKeyboardOpen(false);
      }
    }, 100);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      if (photoFile) {
        try {
          const compressedBase64 = await compressAndConvertToBase64(photoFile);
          data.photo = compressedBase64;
        } catch (error) {
          console.error("Error compressing image:", error);
          toast({
            title: "Warning",
            description: "There was an issue processing your image. Try a smaller image.",
            variant: "destructive",
          });
        }
      }
      
      const response = await apiRequest("POST", "/api/signups", data);
      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Your application has been submitted. We'll be in touch soon!",
      });

      // Track with Stape API
      try {
        // ✅ Facebook Pixel tracking only
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_category: 'Model Application',
            content_name: 'Model Signup',
            value: 2, // £2 lead value
            currency: 'GBP'
          });
          window.fbq('trackCustom', 'ModelSignup', {
            signup_method: 'old_form',
            category: formData.category || 'fb3'
          });
          console.log('✅ Old Form tracked via Facebook Pixel');
        }
      } catch (error) {
        console.error('Stape tracking failed:', error);
      }

      setFormData({ 
        name: "", 
        email: "", 
        age: "", 
        gender: "", 
        mobile: "", 
        postcode: "", 
        photo: null, 
        category: "" 
      });
      setPhotoFile(null);
      setFormStep(1);
      queryClient.invalidateQueries({ queryKey: ["/api/signups"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const compressAndConvertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          let width = img.width;
          let height = img.height;
          const maxSize = 800;
          
          if (width > height && width > maxSize) {
            height = Math.round(height * (maxSize / width));
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round(width * (maxSize / height));
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        
        img.onerror = () => {
          reject(new Error('Error loading image'));
        };
      };
      
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 1) {
      if (!formData.name.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your name.",
          variant: "destructive",
        });
        return;
      }
      setFormStep(2);
      return;
    }
    
    if (!formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    signupMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof SignupData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }
      
      setPhotoFile(file);
    }
  };

  return (
    <>
      {/* Mobile overlay when keyboard is open */}
      <AnimatePresence>
        {isMobileKeyboardOpen && window.innerWidth <= 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => {
              // Blur active element to close keyboard
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Form container with mobile keyboard snap */}
      <motion.div 
        ref={formRef}
        className={`glassmorphism shadow-2xl w-full transition-all duration-300 ${
          isMobileKeyboardOpen && window.innerWidth <= 768 
            ? 'fixed left-4 right-4 top-4 z-50 rounded-2xl p-4 max-h-[50vh] overflow-y-auto' 
            : 'relative rounded-2xl p-6 md:p-8 max-w-md mx-auto'
        }`}
        animate={{
          y: 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Mobile form header with close button */}
        {isMobileKeyboardOpen && window.innerWidth <= 768 && (
          <motion.div 
            className="flex justify-between items-center mb-3 pb-2 border-b border-white/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-base font-semibold text-gray-800">
              {focusedInput ? `Enter ${focusedInput}` : 'Sign up'}
            </h3>
            <button
              type="button"
              onClick={() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}

        <h2 className={`text-2xl font-serif font-bold mb-6 text-gray-800 ${
          isMobileKeyboardOpen && window.innerWidth <= 768 ? 'hidden' : ''
        }`}>
          Start Your Journey
        </h2>
      
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {formStep === 1 ? (
              <motion.div 
                key="step1"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => handleInputFocus("name")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={signupMutation.isPending}
                />
                
                {/* Gender Selection */}
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  onFocus={() => handleInputFocus("gender")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  disabled={signupMutation.isPending}
                >
                  <option value="" disabled>Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
                
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileHover={{ scale: signupMutation.isPending ? 1 : 1.05 }}
                  whileTap={{ scale: signupMutation.isPending ? 1 : 0.95 }}
                  disabled={signupMutation.isPending}
                >
                  <span>NEXT</span>
                  <FaArrowRight className="ml-2" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => handleInputFocus("email")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={signupMutation.isPending}
                />
                
                <motion.input
                  type="text"
                  placeholder="AGE (BETWEEN 3-40 YEARS)"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  onFocus={() => handleInputFocus("age")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={signupMutation.isPending}
                />
                
                <motion.input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  onFocus={() => handleInputFocus("mobile")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={signupMutation.isPending}
                />
                
                <motion.input
                  type="text"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  onFocus={() => handleInputFocus("postcode")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                  disabled={signupMutation.isPending}
                />
                
                <div className="relative">
                  <motion.label
                    htmlFor="photo-upload"
                    className="p-4 w-full rounded-xl border-0 bg-white/40 backdrop-blur-sm text-gray-600 flex items-center justify-between cursor-pointer hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="truncate">{photoFile ? photoFile.name : "UPLOAD RECENT PHOTO"}</span>
                    <FaCamera className="text-xl" />
                  </motion.label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={signupMutation.isPending}
                  />
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    className="w-1/3 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormStep(1)}
                    disabled={signupMutation.isPending}
                  >
                    BACK
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    className="w-2/3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: signupMutation.isPending ? 1 : 1.05 }}
                    whileTap={{ scale: signupMutation.isPending ? 1 : 0.95 }}
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "SUBMITTING..." : "GET DISCOVERED"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        
        <p className="text-sm text-gray-700 mt-4 text-center">
          <FaShieldAlt className="inline mr-2" />
          We'll guide you step by step
        </p>
      </motion.div>
    </>
  );
}

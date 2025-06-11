import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FaShieldAlt, FaCamera, FaArrowRight } from "react-icons/fa";

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
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mobile keyboard detection with improved logic
  useEffect(() => {
    let initialViewportHeight = window.innerHeight;
    
    const handleViewportChange = () => {
      if (window.innerWidth <= 768) {
        const currentHeight = window.visualViewport?.height || window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        
        // Keyboard is considered open if height difference is significant
        const keyboardOpen = heightDifference > 150;
        setIsMobileKeyboardOpen(keyboardOpen);
      } else {
        setIsMobileKeyboardOpen(false);
      }
    };

    // Set initial height
    initialViewportHeight = window.innerHeight;
    
    // Listen to visual viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }
    
    // Fallback for older browsers
    window.addEventListener('resize', handleViewportChange);
    
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      window.removeEventListener('resize', handleViewportChange);
    };
  }, []);

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputFocus = (inputName: string) => {
    setFocusedInput(inputName);
  };

  const handleInputBlur = () => {
    // Delay clearing focused input to prevent flickering
    setTimeout(() => {
      if (!document.activeElement || 
          (document.activeElement.tagName !== 'INPUT' && 
           document.activeElement.tagName !== 'SELECT')) {
        setFocusedInput(null);
      }
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your application has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['signups'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 1) {
      if (!formData.name.trim() || !formData.gender) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setFormStep(2);
    } else {
      if (!formData.email.trim() || !formData.age.trim() || !formData.mobile.trim() || !formData.postcode.trim()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      signupMutation.mutate(formData);
    }
  };

  const dismissKeyboard = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="relative">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileKeyboardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={dismissKeyboard}
          />
        )}
      </AnimatePresence>

      {/* Form container */}
      <div 
        ref={formRef}
        className={`glassmorphism shadow-2xl w-full max-w-md mx-auto rounded-2xl p-6 md:p-8 ${
          isMobileKeyboardOpen 
            ? 'fixed top-4 left-4 right-4 z-50 max-h-[70vh] overflow-y-auto md:relative md:top-auto md:left-auto md:right-auto md:z-auto md:max-h-none md:overflow-visible' 
            : 'relative'
        }`}
      >
        {/* Mobile header when keyboard is open */}
        <AnimatePresence>
          {isMobileKeyboardOpen && (
            <motion.div 
              className="flex justify-between items-center mb-4 pb-3 border-b border-white/20 md:hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {focusedInput ? `Enter ${focusedInput}` : 'Sign up'}
              </h3>
              <button
                type="button"
                onClick={dismissKeyboard}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main title */}
        <h2 
          className={`text-2xl font-serif font-bold mb-6 text-gray-800 transition-opacity duration-300 ${
            isMobileKeyboardOpen ? 'md:block hidden' : 'block'
          }`}
        >
          Start Your Journey
        </h2>
      
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {formStep === 1 ? (
              <motion.div 
                key="step1"
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  onFocus={() => handleInputFocus("Full Name")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <motion.select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  onFocus={() => handleInputFocus("Gender")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                >
                  <option value="" disabled>Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </motion.select>
                
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onFocus={() => handleInputFocus("Email")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <motion.input
                  type="text"
                  placeholder="AGE (BETWEEN 3-40 YEARS)"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  onFocus={() => handleInputFocus("Age")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <motion.input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  onFocus={() => handleInputFocus("Mobile")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <motion.input
                  type="text"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  onFocus={() => handleInputFocus("Postcode")}
                  onBlur={handleInputBlur}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 focus:scale-[1.02] transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <div className="relative">
                  <motion.label
                    htmlFor="photo-upload"
                    className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-600 flex items-center justify-between cursor-pointer hover:bg-white/50 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="truncate text-base">
                      {photoFile ? photoFile.name : "UPLOAD RECENT PHOTO"}
                    </span>
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
        
        <motion.p 
          className={`text-sm text-gray-700 mt-4 text-center transition-all duration-300 ${
            isMobileKeyboardOpen ? 'md:block hidden' : 'block'
          }`}
          layout
        >
          <FaShieldAlt className="inline mr-2" />
          We'll guide you step by step
        </motion.p>
      </div>
    </div>
  );
}

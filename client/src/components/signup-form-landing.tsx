import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaShieldAlt, FaCamera, FaArrowRight, FaSpinner, FaArrowLeft } from "react-icons/fa";
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

interface SignupFormLandingProps {
  onGenderChange?: (gender: string) => void;
  onAgeChange?: (age: string) => void;
  onFormSubmitted?: () => void;
  categoryOverride?: string;
}

export default function SignupFormLanding({ onGenderChange, onAgeChange, onFormSubmitted, categoryOverride }: SignupFormLandingProps) {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    age: "",
    gender: "",
    mobile: "",
    postcode: "",
    photo: null,
    category: categoryOverride || "landing"
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate total steps and progress percentage
  const totalSteps = 7;
  const progressPercentage = (formStep / totalSteps) * 100;

  // Helper function to check if current step is valid
  const isCurrentStepValid = () => {
    switch (formStep) {
      case 1: return formData.name.trim() !== "";
      case 2: return formData.gender !== "";
      case 3: return formData.email.trim() !== "";
      case 4: return formData.age.trim() !== "";
      case 5: return formData.mobile.trim() !== "";
      case 6: return formData.postcode.trim() !== "";
      case 7: return true; // Photo is optional
      default: return false;
    }
  };

  // Function to handle going back to previous step
  const handleBackStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      setIsSubmitting(true);
      
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
      setIsSubmitting(false);
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
            content_name: 'Landing Form',
            value: 2, // £2 lead value
            currency: 'GBP'
          });
          window.fbq('trackCustom', 'ModelSignup', {
            signup_method: 'landing_form',
            category: formData.category || 'fb3'
          });
          console.log('✅ Landing Form tracked via Facebook Pixel');
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
        category: categoryOverride || "landing"
      });
      setPhotoFile(null);
      setFormStep(1);
      queryClient.invalidateQueries({ queryKey: ["/api/signups"] });
      if (onFormSubmitted) onFormSubmitted();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
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
    if (field === 'gender' && onGenderChange) {
      onGenderChange(value || '');
    }
    if (field === 'age' && onAgeChange) {
      onAgeChange(value || '');
    }
  };

  // Add scroll handler for mobile keyboard
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    // Add a small delay to ensure the keyboard is shown
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024;
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setPhotoFile(file);
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium" style={{ color: '#8B3A3A' }}>
            Step {formStep} of {totalSteps}
          </span>
          <span className="text-xs font-medium" style={{ color: '#8B3A3A' }}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: '#F8B195' }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
        {/* Back button - shows from step 2 onwards */}
        {formStep > 1 && (
          <motion.button
            type="button"
            className="self-start flex items-center text-sm font-medium mb-2 px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
            style={{ color: '#8B3A3A' }}
            onClick={handleBackStep}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft className="mr-2 text-xs" />
            <span>Back</span>
          </motion.button>
        )}

        <AnimatePresence mode="wait">
          {formStep === 1 && (
            <motion.div 
              key="step1"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={signupMutation.isPending}
              />
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.name.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your name.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(2);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 2 && (
            <motion.div 
              key="step2"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label htmlFor="gender-select" className="sr-only">Select your gender</label>
              <select
                id="gender-select"
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                disabled={signupMutation.isPending}
                aria-label="Select your gender"
              >
                <option value="" disabled>Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.gender) {
                    toast({
                      title: "Missing Information",
                      description: "Please select your gender.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(3);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 3 && (
            <motion.div 
              key="step3"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={signupMutation.isPending}
              />
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.email.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your email address.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(4);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 4 && (
            <motion.div 
              key="step4"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.input
                type="text"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Age"
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={signupMutation.isPending}
              />
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.age.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your age.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(5);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 5 && (
            <motion.div 
              key="step5"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.input
                type="tel"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={signupMutation.isPending}
              />
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.mobile.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your mobile number.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(6);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 6 && (
            <motion.div 
              key="step6"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.input
                type="text"
                placeholder="Postcode"
                value={formData.postcode}
                onChange={(e) => handleInputChange("postcode", e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 focus:ring-0 text-sm h-14 text-lg md:h-10 md:text-sm"
                whileFocus={{ scale: 1.02 }}
                disabled={signupMutation.isPending}
              />
              <motion.button
                type="button"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isCurrentStepValid() 
                    ? 'shadow-lg ring-2 ring-orange-300/50' 
                    : 'opacity-60'
                }`}
                style={{ 
                  backgroundColor: isCurrentStepValid() ? '#F8B195' : '#D1A584',
                  boxShadow: isCurrentStepValid() ? '0 4px 15px rgba(248, 177, 149, 0.4)' : 'none'
                }}
                whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
                whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
                disabled={signupMutation.isPending || !isCurrentStepValid()}
                onClick={() => {
                  if (!formData.postcode.trim()) {
                    toast({
                      title: "Missing Information",
                      description: "Please enter your postcode.",
                      variant: "destructive",
                    });
                    return;
                  }
                  setFormStep(7);
                }}
              >
                <div className="flex items-center justify-center">
                  <span>Next</span>
                  {isCurrentStepValid() && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2"
                    >
                      <FaArrowRight className="text-xs" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
          {formStep === 7 && (
            <motion.div 
              key="step7"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <motion.label
                  htmlFor="photo-upload"
                  className="w-full px-3 py-2 rounded-xl bg-white/80 border-0 text-sm flex items-center justify-between cursor-pointer h-14 text-lg md:h-10 md:text-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="truncate text-gray-600">{photoFile ? photoFile.name : "Upload Photo"}</span>
                  <FaCamera className="text-sm" />
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
              <motion.button
                type="submit"
                className={`w-full py-2 rounded-xl font-medium text-white text-sm transition-all duration-200 ${
                  isSubmitting 
                    ? 'opacity-80' 
                    : 'shadow-lg ring-2 ring-orange-300/50'
                }`}
                style={{ 
                  backgroundColor: '#F8B195',
                  boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(248, 177, 149, 0.4)'
                }}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
              >
                <div className="flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <FaSpinner className="text-sm" />
                      </motion.div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      <p className="text-center text-xs mt-2" style={{ color: '#8B3A3A' }}>
        We'll guide you step by step
      </p>
    </div>
  );
} 
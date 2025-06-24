import { useState } from "react";
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
  parentMobile?: string;
}

interface SignupFormProps {
  categoryOverride?: string;
}

export default function SignupForm({ categoryOverride }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    age: "",
    gender: "",
    mobile: "",
    postcode: "",
    photo: null,
    category: categoryOverride || 'fb3',
    parentMobile: ""
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formStep, setFormStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.gender) {
      toast({
        title: "Missing Information",
        description: "Please select your gender.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.age.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your age.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your mobile number.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.postcode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your postcode.",
        variant: "destructive",
      });
      return false;
    }
    if (parseInt(formData.age) < 18 && !formData.parentMobile?.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your parent's mobile number as you are under 18.",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.photo) {
      toast({
        title: "Missing Information",
        description: "Please upload an image.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formStep === 1) {
      if (validateStep1()) {
        setFormStep(2);
      }
    } else {
      if (validateStep2()) {
        signupMutation.mutate(formData);
      }
    }
  };

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      console.log('🚀 Starting form submission with data:', data);
      
      // Ensure parent mobile is included if under 18
      const submissionData = { ...data };
      if (parseInt(data.age) < 18 && !data.parentMobile) {
        console.warn('⚠️ User is under 18 but parent mobile is missing');
      }
      
      const response = await fetch('/api/signups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`Failed to submit form: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Success response:', result);
      return result;
    },
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: "Your application has been submitted successfully.",
      });

      // ✅ Facebook Pixel tracking only
      try {
        if (typeof window.fbq === 'function') {
          // Fire Lead event (Facebook standard)
          window.fbq('track', 'Lead', {
            content_category: 'Model Application',
            content_name: formData.category || 'Model Signup',
            value: 2, // £2 lead value
            currency: 'GBP'
          });

          // Fire custom event for detailed tracking
          window.fbq('trackCustom', 'ModelSignup', {
            signup_method: 'website_form',
            category: formData.category || 'fb3',
            has_phone: !!formData.mobile,
            age_group: parseInt(formData.age) < 18 ? 'minor' : 'adult'
          });

          console.log('✅ Model Signup tracked via Facebook Pixel');
        } else {
          console.warn('⚠️ Facebook Pixel not loaded');
        }
      } catch (error) {
        console.error('❌ Facebook Pixel tracking error:', error);
      }

      setFormData({
        name: "",
        email: "",
        age: "",
        gender: "",
        mobile: "",
        postcode: "",
        photo: null,
        category: categoryOverride || 'fb3',
        parentMobile: ""
      });
      setFormStep(1);
      queryClient.invalidateQueries({ queryKey: ['signups'] });

      // Track sign-up with Snapchat Pixel
      if (window.snaptr) {
        const [firstName, ...lastNameParts] = formData.name.split(' ');
        const lastName = lastNameParts.join(' ');
        
        window.snaptr('track', 'SIGN_UP', {
          'sign_up_method': 'web_form',
          'uuid_c1': formData.email,
          'user_email': formData.email,
          'user_phone_number': formData.mobile,
          'firstname': firstName,
          'lastname': lastName,
          'age': formData.age,
          'geo_postal_code': formData.postcode
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="form-container">
      <div className="glassmorphism shadow-2xl w-full max-w-md mx-auto rounded-2xl p-6 md:p-8 relative">
        <h2 className="text-2xl font-serif font-bold mb-6 text-gray-800">
          Sign up
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
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <input
                  type="text"
                  placeholder="Age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                  disabled={signupMutation.isPending}
                  required
                />
                
                {/* Parent Mobile - Only show if age is under 18 */}
                {formData.age && parseInt(formData.age) < 18 && (
                  <motion.input
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    type="tel"
                    placeholder="Parent's Mobile Number (Required for under 18)"
                    value={formData.parentMobile || ""}
                    onChange={(e) => handleInputChange("parentMobile", e.target.value)}
                    className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
                    disabled={signupMutation.isPending}
                    required
                  />
                )}
                
                <input
                  type="text"
                  placeholder="Postcode"
                  value={formData.postcode}
                  onChange={(e) => handleInputChange("postcode", e.target.value)}
                  className="p-4 w-full rounded-xl border border-transparent bg-white/40 backdrop-blur-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white/60 transition-all duration-300 text-base"
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
                    {signupMutation.isPending ? "SUBMITTING..." : "SIGN UP"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        
        <p className="text-sm text-gray-700 mt-4 text-center">
          <FaShieldAlt className="inline mr-2" />
          No fees. We only earn when you do.
        </p>
      </div>
    </div>
  );
}

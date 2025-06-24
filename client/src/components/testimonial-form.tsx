import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { FaShieldAlt } from "react-icons/fa";
import React from "react";
// Facebook Pixel tracking - no import needed

interface FormData {
  name: string;
  email: string;
  mobile: string;
  age: string;
  gender: string;
  postcode: string;
  photo: File | null;
  parentMobile?: string;
}

interface TestimonialFormProps {
  onClose: () => void;
  onBack: () => void;
}

const questions = [
  {
    id: 'name',
    label: "Full Name",
    placeholder: "Enter your full name",
    type: 'text',
    required: true
  },
  {
    id: 'email',
    label: "Email Address",
    placeholder: "your@email.com",
    type: 'email',
    required: true
  },
  {
    id: 'mobile',
    label: "Mobile Number",
    placeholder: "+1 (555) 000-0000",
    type: 'tel',
    required: true
  },
  {
    id: 'age',
    label: "Age",
    placeholder: "18",
    type: 'number',
    min: '16',
    required: true
  },
  {
    id: 'gender',
    label: "Gender",
    type: 'select',
    options: [
      { value: '', label: 'Select gender' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'non-binary', label: 'Non-binary' },
      { value: 'other', label: 'Other' }
    ],
    required: true
  },
  {
    id: 'postcode',
    label: "Postcode",
    placeholder: "10001",
    type: 'text',
    required: true
  },
  {
    id: 'photo',
    label: "Portfolio Photo",
    type: 'file',
    required: true
  }
];

export default function TestimonialForm({ onClose, onBack }: TestimonialFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    postcode: "",
    photo: null,
    parentMobile: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [parentMobileInserted, setParentMobileInserted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Build dynamic questions based on whether parent mobile is needed
  const dynamicQuestions = React.useMemo(() => {
    const baseQuestions = [...questions];
    
    // If we've determined we need parent mobile, insert it after age
    if (parentMobileInserted) {
      const ageIndex = baseQuestions.findIndex(q => q.id === 'age');
      baseQuestions.splice(ageIndex + 1, 0, {
        id: 'parentMobile',
        label: "Parent's Mobile Number",
        placeholder: "+1 (555) 000-0000",
        type: 'tel',
        required: true
      });
    }
    
    return baseQuestions;
  }, [parentMobileInserted]);

  const currentQuestion = dynamicQuestions[currentStep];
  const progress = ((currentStep + 1) / dynamicQuestions.length) * 100;

  const handleNext = () => {
    setFieldError(null);
    const value = formData[currentQuestion.id as keyof FormData];
    
    // Validation for current field
    if (currentQuestion.id === 'mobile' && !/^[0-9]+$/.test(value as string)) {
      setFieldError('Mobile Number must contain only numbers.');
      return;
    }
    if (currentQuestion.id === 'parentMobile' && !/^[0-9]+$/.test(value as string)) {
      setFieldError('Parent\'s Mobile Number must contain only numbers.');
      return;
    }
    if (currentQuestion.id === 'email' && !/^\S+@\S+\.\S+$/.test(value as string)) {
      setFieldError('Please enter a valid email address.');
      return;
    }
    if (currentQuestion.id === 'postcode' && !/^[a-zA-Z0-9]+$/.test(value as string)) {
      setFieldError('Postcode must contain only letters and numbers.');
      return;
    }
    if (currentQuestion.id === 'age' && (!/^[0-9]{1,2}$/.test(value as string))) {
      setFieldError('Age must be a number with a maximum of 2 digits.');
      return;
    }
    
    // Check if current field is valid
    if (!isCurrentFieldValid()) {
      return;
    }
    
    // Special handling for age field
    if (currentQuestion.id === 'age') {
      const age = parseInt(value as string);
      if (age < 18 && !parentMobileInserted) {
        // Need to insert parent mobile question
        setParentMobileInserted(true);
        // Move to next step which will be parent mobile
        setCurrentStep(currentStep + 1);
        return;
      }
    }
    
    // Move to next step
    if (currentStep < dynamicQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
    
    // If user is changing age and previously had parent mobile requirement
    if (currentQuestion.id === 'age' && parentMobileInserted) {
      const newAge = parseInt(value);
      // If age is now 18 or over, we should remove parent mobile requirement
      if (!isNaN(newAge) && newAge >= 18) {
        setParentMobileInserted(false);
        // Clear parent mobile data
        setFormData(prev => ({ ...prev, parentMobile: "" }));
      }
    }
  };

  const handleInputChangeWithClear = (value: string) => {
    setFieldError(null);
    handleInputChange(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

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

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      setIsSubmitting(true);
      setSubmitError(null);
      
      try {
        let photoBase64 = null;
        if (data.photo) {
          try {
            photoBase64 = await compressAndConvertToBase64(data.photo);
          } catch (error) {
            console.error("Error compressing image:", error);
            toast({
              title: "Warning",
              description: "There was an issue processing your image. Try a smaller image.",
              variant: "destructive",
            });
          }
        }

        const response = await fetch('/api/signups', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            age: data.age,
            gender: data.gender,
            postcode: data.postcode,
            parentMobile: data.parentMobile,
            photo: photoBase64,
            category: 'fb3'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit form');
        }

        return response.json();
      } catch (error: any) {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    },
    onSuccess: async () => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // ✅ Facebook Pixel tracking only
      try {
        if (typeof window.fbq === 'function') {
          // Fire Lead event (Facebook standard)
          window.fbq('track', 'Lead', {
            content_category: 'Model Application',
            content_name: 'Testimonial Modal',
            value: 2, // £2 lead value
            currency: 'GBP'
          });

          // Fire custom event for detailed tracking
          window.fbq('trackCustom', 'ModelSignup', {
            signup_method: 'testimonial_form',
            category: 'fb3',
            has_phone: !!formData.mobile,
            age_group: parseInt(formData.age) < 18 ? 'minor' : 'adult'
          });

          console.log('✅ Testimonial Form tracked via Facebook Pixel');
        } else {
          console.warn('⚠️ Facebook Pixel not loaded');
        }
      } catch (error) {
        console.error('❌ Facebook Pixel tracking error:', error);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/signups'] });
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      setSubmitError(error.message);
    },
  });

  const handleSubmit = async () => {
    if (!isCurrentFieldValid()) return;
    signupMutation.mutate(formData);
  };

  const isCurrentFieldValid = () => {
    const value = formData[currentQuestion.id as keyof FormData];
    if (currentQuestion.id === 'photo') {
      return value !== null;
    }
    if (currentQuestion.id === 'mobile' || currentQuestion.id === 'parentMobile') {
      return /^[0-9]+$/.test(value as string) && value !== '' && value !== null;
    }
    if (currentQuestion.id === 'email') {
      return /^\S+@\S+\.\S+$/.test(value as string) && value !== '' && value !== null;
    }
    if (currentQuestion.id === 'postcode') {
      return /^[a-zA-Z0-9]+$/.test(value as string) && value !== '' && value !== null;
    }
    if (currentQuestion.id === 'age') {
      return /^[0-9]{1,2}$/.test(value as string) && value !== '' && value !== null;
    }
    return value !== '' && value !== null;
  };

  if (submitSuccess) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Application Submitted</h3>
        <p className="text-gray-600 text-sm">We'll be in touch within 48 hours if we think you're a good fit.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header with progress bar */}
      <div className="px-8 pt-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight mb-1">
            Sign Up
            <span className="block w-12 h-0.5 mt-1 bg-rose-300 rounded-full mx-auto opacity-80"></span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <span className={`text-xs font-semibold ${currentStep < 2 ? 'text-rose-500' : 'text-gray-400'}`}>Personal Details</span>
          <span className={`text-xs font-semibold ${currentStep >= 2 && currentStep < 4 ? 'text-rose-500' : 'text-gray-400'}`}>Contact Info</span>
          <span className={`text-xs font-semibold ${currentStep >= 4 && currentStep < 6 ? 'text-rose-500' : 'text-gray-400'}`}>Gender</span>
          <span className={`text-xs font-semibold ${currentStep >= 6 ? 'text-rose-500' : 'text-gray-400'}`}>Photo</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Question Label */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-3">
                {currentQuestion.label}
                {currentQuestion.required && <span className="text-rose-400 ml-1">*</span>}
              </label>

              {/* Input Field */}
              {currentQuestion.type === 'select' ? (
                <select
                  value={formData[currentQuestion.id as keyof FormData] as string || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                >
                  {currentQuestion.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : currentQuestion.type === 'file' ? (
                <div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <div className="cursor-pointer">
                      {formData.photo ? (
                        <div className="p-4 rounded-2xl border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-base text-gray-700">{formData.photo.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">Change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-center transition-all">
                          <svg className="w-8 h-8 mx-auto text-rose-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-base text-gray-700 font-medium">Upload portfolio photo</p>
                          <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ) : currentQuestion.id === 'mobile' ? (
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeWithClear(val);
                  }}
                  min={currentQuestion.min}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              ) : currentQuestion.id === 'parentMobile' ? (
                <input
                  type="tel"
                  value={formData.parentMobile || ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    handleInputChangeWithClear(val);
                  }}
                  placeholder="Parent's mobile (required for under 18)"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              ) : currentQuestion.id === 'email' ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChangeWithClear(e.target.value)}
                  min={currentQuestion.min}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              ) : currentQuestion.id === 'postcode' ? (
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                    handleInputChangeWithClear(val);
                  }}
                  min={currentQuestion.min}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              ) : currentQuestion.id === 'age' ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9]/g, '');
                    if (val.length > 2) val = val.slice(0, 2);
                    handleInputChangeWithClear(val);
                  }}
                  placeholder="Age"
                  min={currentQuestion.min}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              ) : (
                <input
                  type={currentQuestion.type}
                  value={formData[currentQuestion.id as keyof FormData] as string || ''}
                  onChange={(e) => handleInputChangeWithClear(e.target.value)}
                  min={currentQuestion.min}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-0 focus:outline-none transition-all bg-white text-gray-900 text-base"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isCurrentFieldValid()) {
                      handleNext();
                    }
                  }}
                />
              )}

              {fieldError && (
                <div className="mt-2 text-rose-500 text-sm font-medium">{fieldError}</div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-base font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Back
          </button>

          <div className="flex gap-3">
            {currentStep === dynamicQuestions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentFieldValid() || isSubmitting}
                className={`px-6 py-2 rounded-xl text-base font-medium transition-all ${
                  isCurrentFieldValid() && !isSubmitting
                    ? 'bg-gradient-to-r from-rose-400 to-pink-400 text-white hover:from-rose-500 hover:to-pink-500'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentFieldValid()}
                className={`px-6 py-2 rounded-xl text-base font-medium transition-all relative overflow-hidden
                  ${isCurrentFieldValid()
                    ? 'text-white bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-rose-500 before:via-pink-500 before:to-rose-400 before:animate-gradient-x before:z-0'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                `}
                style={isCurrentFieldValid() ? { zIndex: 1 } : {}}
              >
                <span className={isCurrentFieldValid() ? 'relative z-10' : ''}>Next</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

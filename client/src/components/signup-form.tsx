import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FaShieldAlt } from "react-icons/fa";

interface SignupData {
  name: string;
  email: string;
  category?: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    category: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await apiRequest("POST", "/api/signups", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your application has been submitted. We'll be in touch soon!",
      });
      setFormData({ name: "", email: "", category: "" });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    signupMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 md:p-8 shadow-lg w-full max-w-sm">
      <h2 className="text-xl font-medium mb-6 text-gray-800 text-center">Sign up today!</h2>
      
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <motion.input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="p-3 rounded-lg border-0 bg-white/60 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/80 transition-all duration-300"
          whileFocus={{ scale: 1.02 }}
          disabled={signupMutation.isPending}
        />
        
        <motion.input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="p-3 rounded-lg border-0 bg-white/60 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white/80 transition-all duration-300"
          whileFocus={{ scale: 1.02 }}
          disabled={signupMutation.isPending}
        />
        
        <motion.button
          type="submit"
          className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: signupMutation.isPending ? 1 : 1.02 }}
          whileTap={{ scale: signupMutation.isPending ? 1 : 0.98 }}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
        </motion.button>
      </form>
      
      <p className="text-sm text-gray-600 mt-4 text-center">
        We'll guide you step by step
      </p>
    </div>
  );
}

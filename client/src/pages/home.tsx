import HeroSection from "@/components/hero-section";
import CategoriesSection from "@/components/categories-section";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-rose-50 to-white overflow-x-hidden">
      <HeroSection />
      <CategoriesSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}

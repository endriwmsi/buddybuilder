import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Features from "@/components/landing-page/features";
import ProductShowcase from "@/components/landing-page/product-showcase";
import Testimonials from "@/components/landing-page/testimonials";
import Pricing from "@/components/landing-page/pricing";
import FAQ from "@/components/landing-page/faq";
import FinalCTA from "@/components/landing-page/final-cta";
import Footer from "@/components/landing-page/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Header />
      <main>
        <Hero />
        <Features />
        <ProductShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

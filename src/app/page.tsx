import Cta from "@/components/landing-page/layout/cta";
import Hero from "@/components/landing-page/layout/hero";
import Faq from "@/components/landing-page/layout/faq";
import Testimonials from "@/components/landing-page/layout/testimonials";
import Pricing from "@/components/landing-page/layout/pricing";
import Product from "@/components/landing-page/layout/product";
import { MouseSpotlight } from "@/components/landing-page/layout/mouse-spotlight";
import Features from "@/components/landing-page/layout/features";
import Header from "@/components/landing-page/layout/header";
import Footer from "@/components/landing-page/layout/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <MouseSpotlight />
      <Header />
      <Hero />
      <Features />
      <Product />
      <Testimonials />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}

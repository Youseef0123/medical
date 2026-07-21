import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Newsletter } from "@/components/sections/Newsletter";
import { Certifications } from "@/components/sections/Certifications";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Products />
        <Testimonials />
        <WhyChooseUs />
        <Newsletter />
        <Certifications />
      </main>
      <Footer />
    </>
  );
}

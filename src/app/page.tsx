import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Products } from "@/components/sections/Products";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Products />
        {/* <Testimonials /> */}
        <WhyChooseUs />
        <Contact />
        {/* <Newsletter /> */}
        {/* <Certifications /> */}
      </main>
      <Footer />
    </>
  );
}

import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Benefits from "@/components/site/Benefits";
import About from "@/components/site/About";
import GlobalPresence from "@/components/site/GlobalPresence";
import Industries from "@/components/site/Industries";
import HowToConnect from "@/components/site/HowToConnect";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <Benefits />
      <About />
      <GlobalPresence />
      <Industries />
      <HowToConnect />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;

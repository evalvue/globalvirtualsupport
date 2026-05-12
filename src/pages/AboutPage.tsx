import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import About from "@/components/site/About";
import Benefits from "@/components/site/Benefits";

const AboutPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="About us" title="A global virtual workforce, built for results" subtitle="Founded to give US businesses access to world-class talent without overhead. We blend people, process and technology." />
    <About />
    <Benefits />
  </SiteLayout>
);

export default AboutPage;
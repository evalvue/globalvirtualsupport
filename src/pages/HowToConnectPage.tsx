import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import HowToConnect from "@/components/site/HowToConnect";
import Contact from "@/components/site/Contact";

const HowToConnectPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="How to connect" title="Get started in 4 simple steps" subtitle="From first call to a fully ramped team in days — not months." />
    <HowToConnect />
    <Contact />
  </SiteLayout>
);

export default HowToConnectPage;
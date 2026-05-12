import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import Services from "@/components/site/Services";
import HowToConnect from "@/components/site/HowToConnect";

const ServicesPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="Our services" title="Everything you need, one partner" subtitle="BPO, dispatching, logistics, virtual assistants and web development — all delivered by a global team that scales with you." />
    <Services />
    <HowToConnect />
  </SiteLayout>
);

export default ServicesPage;
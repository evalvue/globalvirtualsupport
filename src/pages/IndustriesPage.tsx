import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import Industries from "@/components/site/Industries";

const IndustriesPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="Industries we serve" title="Built for the way you work" subtitle="From trucking and logistics to e-commerce, healthcare, real estate and SaaS — our virtual teams plug straight into your workflow." />
    <Industries />
  </SiteLayout>
);

export default IndustriesPage;
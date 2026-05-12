import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import GlobalPresence from "@/components/site/GlobalPresence";

const GlobalPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="Global presence" title="Always one call away" subtitle="Our distributed delivery centers and 24/7 coverage mean someone is always working on your business." />
    <GlobalPresence />
  </SiteLayout>
);

export default GlobalPage;
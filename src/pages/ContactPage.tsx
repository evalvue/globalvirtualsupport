import SiteLayout from "@/components/site/SiteLayout";
import PageHeader from "@/components/site/PageHeader";
import Contact from "@/components/site/Contact";

const ContactPage = () => (
  <SiteLayout>
    <PageHeader eyebrow="Contact us" title="Let's talk" subtitle="Tell us what you need — we respond within 24 hours, every day." />
    <Contact />
  </SiteLayout>
);

export default ContactPage;
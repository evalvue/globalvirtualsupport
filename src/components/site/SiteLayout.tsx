import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen">
    <Navbar />
    <div className="pt-20">{children}</div>
    <Footer />
  </main>
);

export default SiteLayout;
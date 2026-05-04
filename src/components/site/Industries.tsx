import { Truck, ShoppingBag, Stethoscope, Building, Plane, Home } from "lucide-react";

const items = [
  { icon: Truck, name: "Trucking & Freight" },
  { icon: Building, name: "Real Estate" },
  { icon: ShoppingBag, name: "E-commerce" },
  { icon: Stethoscope, name: "Healthcare" },
  { icon: Plane, name: "Travel & Hospitality" },
  { icon: Home, name: "Home Services" },
];

const Industries = () => {
  return (
    <section id="industries" className="relative py-24 px-6">
      <div className="container mx-auto text-center">
        <p className="text-sm font-medium text-primary mb-3 tracking-wider uppercase">Industries we serve</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-12">Trusted across <span className="text-gradient">every vertical</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((i) => (
            <div key={i.name} className="glass rounded-xl p-6 hover:border-primary/40 transition-all hover:-translate-y-1">
              <i.icon className="w-7 h-7 text-primary mx-auto mb-3" />
              <p className="text-sm font-medium">{i.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products & Solutions | PNT Robotics",
  description: "Explore our diverse range of robotic solutions categorized by Defense, Industrial, Healthcare, and Commercial applications.",
};

type Product = {
  name: string;
  specs: string[];
  description?: string;
  image?: string;
};

type Category = {
  title: string;
  icon: string;
  products: Product[];
};

const CATEGORIES: Category[] = [
  {
    title: "Defense & Security",
    icon: "🛡️",
    products: [
      {
        name: "SensorScout (Indian Army)",
        specs: ["Sensor-fusion navigation", "GPS-denied environment capability", "Man Pack & Car Pack versions"],
        image: "https://images.unsplash.com/photo-1574629810360-19e48dfd2777?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Kamikaze Drone",
        specs: ["3kg Payload", "1.5km LOS range", "Real-time video feedback"],
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Naval Systems (Indian Navy)",
        specs: ["Riskiest Ship Assessment (Radar/AIS data)", "Helicopter's Approach AI", "Ship Navigation Assistant"],
        image: "https://images.unsplash.com/photo-1543884589-9a0db89dcd60?auto=format&fit=crop&q=80&w=800",
      }
    ]
  },
  {
    title: "Industrial Automation",
    icon: "⚙️",
    products: [
      {
        name: "Grounding Robot & Universal Robot",
        specs: ["9m vertical reach", "Encrypted Bluetooth control", "4-wheel drive system"],
        image: "https://images.unsplash.com/photo-1565439390145-2f9cdfb1f173?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "RIRO",
        specs: ["Autonomous rack-in/rack-out", "Self-charging", "SCADA integration"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Battery Lifting Robot",
        specs: ["200kg lift capacity", "150kg payload trolley", "Precision handling"],
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "GSM Power Alert Module",
        specs: ["3-level detection", "Automated instant alerts", "Remote monitoring"],
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
      }
    ]
  },
  {
    title: "Healthcare & Service",
    icon: "🏥",
    products: [
      {
        name: "Coro-Bot",
        specs: ["Food & medicine dispensing", "Remote thermal monitoring", "Contactless operations"],
        image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Wockhardt Delivery Robot",
        specs: ["30kg payload", "Desk-to-desk autonomous navigation", "Flame-resistant battery"],
        image: "https://images.unsplash.com/photo-1664360341773-455bc5ce99cc?auto=format&fit=crop&q=80&w=800",
      }
    ]
  },
  {
    title: "Commercial & R&D",
    icon: "🔬",
    products: [
      {
        name: "ADO Humanoid",
        specs: ["AI-powered interactions", "Interactive advertisement", "Dynamic engagement"],
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Custom Robotic Arm",
        specs: ["Precision assembly", "Welding capabilities", "High repeatability"],
        image: "https://images.unsplash.com/photo-1580983546059-408bb334d9a6?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "AGVs (Autonomous Guided Vehicles)",
        specs: ["LIDAR-based navigation", "Depth cameras", "Dynamic obstacle avoidance"],
        image: "https://images.unsplash.com/photo-1620283085439-39620a1e21c4?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Unilever Handwash Rig",
        specs: ["Programmable cycles", "R&D stain removal evaluation", "Consistent repeatable testing"],
        image: "https://images.unsplash.com/photo-1584820927498-cafe8c1d96b0?auto=format&fit=crop&q=80&w=800",
      },
      {
        name: "Agriculture Robot",
        specs: ["Autonomous seed sowing", "Precision spraying", "Weed cutting module"],
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
      }
    ]
  }
];

export default function ProductsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-blue-600 bg-blue-100 dark:text-cyan-400 dark:bg-cyan-900/30 border border-blue-200 dark:border-cyan-800/50 mb-6">
              Our Fleet
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white">
              Products & Solutions
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Discover our comprehensive range of specialized robotic systems, designed and deployed for India's leading organizations.
            </p>
          </div>

          <div className="space-y-24">
            {CATEGORIES.map((category, idx) => (
              <section key={idx}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-3xl shadow-sm border border-blue-200 dark:border-slate-700">
                    {category.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product, pIdx) => (
                    <div key={pIdx} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                      {product.image && (
                        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-8 flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                        <ul className="space-y-3">
                          {product.specs.map((spec, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-sm">
                              <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <span className="leading-snug">{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every minute for SEO

export const metadata = {
  title: "Products & Solutions | PNT Robotics",
  description: "Explore our diverse range of robotic solutions categorized by Defense, Industrial, Healthcare, and Commercial applications.",
};

type Product = {
  id: string;
  name: string;
  category: string;
  specs: string[];
  image_url?: string;
};

type Category = {
  title: string;
  icon: string;
  products: Product[];
};

const CATEGORY_ICONS: Record<string, string> = {
  "Defense & Security": "🛡️",
  "Industrial Automation": "⚙️",
  "Healthcare & Service": "🏥",
  "Commercial & R&D": "🔬"
};

export default async function ProductsPage() {
  // Fetch from Supabase
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  // Group by category
  const categoriesMap = new Map<string, Product[]>();
  
  if (products) {
    products.forEach((product: Product) => {
      if (!categoriesMap.has(product.category)) {
        categoriesMap.set(product.category, []);
      }
      categoriesMap.get(product.category)!.push(product);
    });
  }

  const groupedCategories: Category[] = Array.from(categoriesMap.entries()).map(([title, products]) => ({
    title,
    icon: CATEGORY_ICONS[title] || "📦",
    products
  }));

  // Fallback if db is empty so it doesn't look broken
  const displayCategories = groupedCategories.length > 0 ? groupedCategories : [];

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
            {displayCategories.length === 0 ? (
                <div className="text-center py-24 text-slate-500">
                    <p className="text-xl">Loading catalog...</p>
                    <p className="text-sm mt-2">Products will appear here once added from the admin panel.</p>
                </div>
            ) : displayCategories.map((category, idx) => (
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
                      {product.image_url ? (
                        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 shrink-0">
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center text-slate-400 text-sm">
                            No image available
                        </div>
                      )}
                      <div className="p-8 flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                        <ul className="space-y-3">
                          {product.specs && product.specs.map((spec, sIdx) => (
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

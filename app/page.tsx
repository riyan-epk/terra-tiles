import { getCurrentTenant } from "../lib/tenant/resolve";
import { repo } from "../lib/tenant/repository";
import { TenantProvider } from "../lib/tenant/TenantProvider";
import Navigation from "./components/Navigation";
import SmoothScroll from "./components/SmoothScroll";
import Hero from "./components/Hero";
import About from "./components/About";
import Categories from "./components/Categories";
import ProductShowcase from "./components/ProductShowcase";
import TileInfo from "./components/TileInfo";
import RoomPreview from "./components/RoomPreview";
import Testimonials from "./components/Testimonials";
import InquiryForms from "./components/InquiryForms";
import Footer from "./components/Footer";

export default async function Home() {
  const tenant = await getCurrentTenant();
  const [products, categories] = await Promise.all([
    repo.getProducts(tenant.id),
    repo.getCategories(tenant.id),
  ]);

  return (
    <TenantProvider value={{ tenant, products, categories }}>
      <main>
        <SmoothScroll />
        <Navigation />
        <Hero />
        <About />
        <Categories />
        <ProductShowcase />
        <TileInfo />
        <RoomPreview />
        <Testimonials />
        <InquiryForms />
        <Footer />
      </main>
    </TenantProvider>
  );
}

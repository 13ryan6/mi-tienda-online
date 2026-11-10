import { getCatalog } from '@/lib/catalog';
import ProductCard from '@/components/ProductCard';
import SiteBehavior from '@/components/SiteBehavior';
import Loader from '@/components/sections/Loader';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import ProductsSection from '@/components/sections/ProductsSection';
import CartBar from '@/components/sections/CartBar';
import CartaDigital from '@/components/sections/CartaDigital';
import Testimonios from '@/components/sections/Testimonios';
import Contacto from '@/components/sections/Contacto';
import Footer from '@/components/sections/Footer';
import WhatsAppFloat from '@/components/sections/WhatsAppFloat';
import Lightbox from '@/components/sections/Lightbox';

// Regenera la página cada 5 minutos (ISR): los cambios del catálogo en Supabase se reflejan sin redesplegar.
export const revalidate = 300;

export default async function Home() {
  const { products } = await getCatalog();
  return (
    <>
      <Loader />
      <Navbar />
      <Hero />
      <HowItWorks />
      <ProductsSection>
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} index={i} />
        ))}
      </ProductsSection>
      <CartBar />
      <CartaDigital />
      <Testimonios />
      <Contacto />
      <Footer />
      <WhatsAppFloat />
      <Lightbox />
      <SiteBehavior />
    </>
  );
}

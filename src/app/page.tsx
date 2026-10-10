import { HeroBanner } from "@/components/hero/hero-banner";
import { ShopByCategory } from "@/components/categories/shop-by-category";
import { WhyChooseUs } from '@/components/trust/why-choose-us'

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ShopByCategory />
	  <WhyChooseUs />
    </>
  );
}
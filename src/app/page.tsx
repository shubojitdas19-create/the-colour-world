import { HeroBanner } from "@/components/hero/hero-banner";
import { ShopByCategory } from "@/components/categories/shop-by-category";
import { WhyChooseUs } from '@/components/trust/why-choose-us';
import { TrendingColours } from '@/components/colours/trending-colours';
import { Transformations } from '@/components/trust/transformations';
import { HomepageFooter } from '@/components/homepage-footer'; // <-- Import it here

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ShopByCategory />
      <WhyChooseUs />
      <TrendingColours />
      <Transformations />
      <HomepageFooter /> {/* <-- Add it here */}
    </>
  );
}
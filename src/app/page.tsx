import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Problems } from "@/components/landing/problems";
import { Solutions } from "@/components/landing/solutions";
import { Features } from "@/components/landing/features";
import { Pricing } from "@/components/landing/pricing";
import { Footer } from "@/components/landing/footer";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { BlogSection } from "@/components/landing/blog";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Problems />
      <Solutions />
      <Features />
      <Testimonials />
      <Pricing />
      <FAQ />
      <BlogSection />
      <Footer />
    </main>
  );
}

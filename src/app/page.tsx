import Header from "@/components/layout/Header";
import DotNav from "@/components/ui/DotNav";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Solution from "@/components/sections/Solution";
import Pricing from "@/components/sections/Pricing";
import Process from "@/components/sections/Process";
import Portfolio from "@/components/sections/Portfolio";
import FAQ from "@/components/sections/FAQ";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <DotNav />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Pricing />
        <Process />
        <Portfolio />
        <FAQ />
        <CTA />
      </main>
    </>
  );
}

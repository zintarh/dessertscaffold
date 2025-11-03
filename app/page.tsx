import AnimatedSection from "./components/front/AnimatedSection";
import FAQSection from "./components/front/FAQSection";
import Footer from "./components/front/Footer";
import HeroSection from "./components/front/HeroSection";
import Navbar from "./components/front/Navbar";
import OnePlatformSection from "./components/front/OnePlatformSection";
import TestimonialSection from "./components/front/TestimonialSection";
import PageAnimation from "./components/PageAnimation";

export default function Home() {
  return (
    <div className="min-h-screen">
      <PageAnimation>
        <AnimatedSection animationType="fadeIn" delay={100} duration={600}>
          <Navbar />
        </AnimatedSection>

        <AnimatedSection animationType="scaleIn" delay={200} duration={1000}>
          <HeroSection />
        </AnimatedSection>

        <AnimatedSection animationType="fadeInLeft" delay={300} duration={1200}>
          <OnePlatformSection />
        </AnimatedSection>

        <AnimatedSection
          animationType="fadeInRight"
          delay={400}
          duration={1200}
        >
          <TestimonialSection />
        </AnimatedSection>

        <AnimatedSection animationType="fadeInUp" delay={500} duration={1000}>
          <FAQSection />
        </AnimatedSection>

        <AnimatedSection animationType="fadeIn" delay={600} duration={800}>
          <Footer />
        </AnimatedSection>
      </PageAnimation>
    </div>
  );
}

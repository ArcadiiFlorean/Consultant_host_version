import React from "react";
import Header from "./Header/Header";
import Hero from "./Hero";
import AboutMe from "./AboutMe";
import SupportFeatures from "./SupportFeatures";
import Help from "./Help";
import FAQSection from "./FAQSection";
import Testimonials from "./Testimonials";
import ContactOptions from "./ContactOptions";
import Footer from "./Footer";


function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <AboutMe />
      <SupportFeatures />
      <Help />
      <FAQSection />
      <Testimonials />
      <ContactOptions />
      <Footer />
    </>
  );
}

export default HomePage;

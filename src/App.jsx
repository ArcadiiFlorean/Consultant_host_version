import React from "react";
import { Routes, Route } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Header from "./components/Header/Header";
import Hero from "./components/Hero";
import AboutMe from "./components/AboutMe";
import Help from "./components/Help";
import SupportPackages from "./components/SupportPackages";
import FAQSection from "./components/FAQSection";
import Testimonials from "./components/Testimonials";
import ContactOptions from "./components/ContactOptions";
import Footer from "./components/Footer";
import BookingWizard from './components/BookingWizard/BookingWizard';
import ThankYou from "./components/ThankYou";
import StepPayment from "./components/BookingWizard/steps/StepPayment";
import BookingSuccess from './components/BookingSuccess';
import EbookPage from "./components/EbookPage";
import SEOHead from "./components/SEO/SEOHead";

// Stripe public key
const stripePromise = loadStripe("pk_test_51RX5afGbmcCvmvOdy7YGcVdAVtbtFRb8K44iUc8PfSENZfS4VDgb8oRr1Ev8bL0s761UjSESgbeUErjbAFbf9szi000m7J4TA6");

// HomePage cu SEO optimizat
function HomePage() {
  return (
    <>
      <SEOHead 
        title="Consultant Alăptare Online - Susținere Mame România, Moldova, Anglia"
        description="Consultanță expertă în alăptare și îngrijirea nou-născutului online. Susținere pre și postnatală în română și rusă. Servicii pentru mame din România, Moldova și Anglia."
        keywords="consultant alăptare online, îngrijire nou născut, susținere prenatală, consultant lactație română rusă, alăptare moldova, consultant mame anglia"
      />
      <Header />
      <Hero />
      <AboutMe />
      <Help />
      <SupportPackages />
      <FAQSection />
      <Testimonials />
      <ContactOptions />
      <Footer />
    </>
  );
}

// EbookPage cu SEO specific
function EbookPageWrapper() {
  return (
    <>
      <SEOHead 
        title="Ghid Gratuit - Alăptarea și Îngrijirea Nou-Născutului"
        description="Descarcă gratuit ghidul complet pentru alăptare și îngrijirea nou-născutului. Sfaturi practice pentru susținerea pre și postnatală în română și rusă."
        keywords="ghid alăptare gratuit, îngrijire nou născut, susținere prenatală, carte alăptare română rusă, manual îngrijire bebeluș"
        type="article"
      />
      <EbookPage />
    </>
  );
}

// BookingWizard cu SEO specific
function BookingWizardWrapper() {
  return (
    <>
      <SEOHead 
        title="Rezervă Consultanță Online - Alăptare și Îngrijire Nou-Născut"
        description="Rezervă consultanță online pentru alăptare, îngrijirea nou-născutului și susținere pre/postnatală. Servicii în română și rusă pentru România, Moldova, Anglia."
        keywords="rezervare consultanță alăptare online, îngrijire bebeluș online, susținere prenatală română rusă, consultant mame moldova anglia"
      />
      <BookingWizard />
    </>
  );
}

// ThankYou cu SEO
function ThankYouWrapper() {
  return (
    <>
      <SEOHead 
        title="Mulțumim - Rezervarea Ta a Fost Confirmată"
        description="Rezervarea ta pentru consultanță a fost confirmată cu succes. Vei fi contactat în curând pentru detalii suplimentare."
        keywords="confirmare rezervare, consultanță confirmată"
      />
      <ThankYou />
    </>
  );
}

// BookingSuccess cu SEO
function BookingSuccessWrapper() {
  return (
    <>
      <SEOHead 
        title="Succes - Plata Procesată cu Succes"
        description="Plata ta a fost procesată cu succes. Vei primi confirmarea pe email și vei fi contactat pentru programarea consultanței."
        keywords="plata confirmată, succes rezervare, consultanță plătită"
      />
      <BookingSuccess />
    </>
  );
}

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/BookingWizard" element={<BookingWizardWrapper />} />
        <Route path="/thankyou" element={<ThankYouWrapper />} />
        <Route path="/payment" element={<StepPayment />} />
        <Route path="/booking-success" element={<BookingSuccessWrapper />} />
        <Route path="/ebook" element={<EbookPageWrapper />} />
      </Routes>
    </Elements>
  );
}

export default App;
import React from "react";
import Header from "./Header/Header";
import Footer from "./Footer";
import DocumentsPublic from "./DocumentsPublic";

const EbookPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef6f2] via-[#fdf4ef] to-[#fcf1eb]">
      <Header />

      {/* Hero Section pentru Ebook Page */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background decorativ */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#b06b4c]/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-amber-200/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-rose-200/30 rounded-full animate-pulse delay-300"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-sm text-[#b06b4c] font-medium mb-8 shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Resurse gratuite pentru mame
          </div>

          {/* Titlu principal */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#b06b4c] leading-tight mb-6">
            📚 Biblioteca Ta de
            <span className="relative inline-block ml-4">
              <span className="text-amber-900">Resurse</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Descarcă ghiduri practice, formulare utile și resurse educaționale
            pentru a-ți sprijini călătoria în alăptare. Toate documentele sunt
            gratuite și create special pentru tine!
          </p>

          {/* Statistici rapide */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-[#b06b4c] mb-2">
                PDF, DOC
              </div>
              <div className="text-gray-600">Format</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-[#b06b4c] mb-2">24/7</div>
              <div className="text-gray-600">Accesibil</div>
            </div>
          </div>

          {/* Call to action pentru navigare rapidă */}
          <div className="bg-gradient-to-r from-amber-100 to-rose-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 mb-4">
              💡 <strong>Sfat:</strong> Descarcă documentele și păstrează-le pe
              telefon pentru acces rapid oricând ai nevoie!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Ghiduri pas cu pas
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Formulare practice
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Planuri alimentare
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Secțiunea de documente */}
    <DocumentsPublic /> 

      <Footer />
    </div>
  );
};

export default EbookPage;

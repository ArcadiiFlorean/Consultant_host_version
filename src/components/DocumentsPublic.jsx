import React, { useState, useEffect } from 'react';

const DocumentsPublic = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const DOCUMENTS_API = 'https://marina-cociug.com/api/documents_public_api.php';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Încarc documentele de la:', DOCUMENTS_API);

      const response = await fetch(DOCUMENTS_API, { method: 'GET' });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📋 Date primite:', data);

      if (data.success) {
        setDocuments(data.data || []);
        console.log('✅ Documente încărcate:', data.data.length);
      } else {
        throw new Error(data.error || 'Eroare la încărcarea documentelor');
      }
    } catch (err) {
      console.error('❌ Eroare fetch documente:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (document) => {
    if (!document.is_free) {
      alert(`Acest document costă ${document.price} RON. Funcționalitatea de plată va fi implementată.`);
      return;
    }
    
    // Pentru moment, doar alertă - vom implementa descărcarea după
    alert(`Descărcare: ${document.title} - Documentul va fi descărcat în curând.`);
    console.log('📥 Document pentru descărcare:', document);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#b06b4c]"></div>
          <p className="mt-4 text-gray-600">Se încarcă documentele...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-6">
          <div className="text-center bg-red-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Eroare la încărcarea documentelor</h3>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchDocuments}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              Încearcă din nou
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white to-amber-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#b06b4c] mb-4">
            📁 Documentele Tale
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descarcă toate resursele de care ai nevoie pentru o călătorie liniștită în alăptare
          </p>
        </div>

        {/* Statistici */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-[#b06b4c] mb-1">{documents.length}</div>
            <div className="text-gray-600 text-sm">Total documente</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {documents.filter(doc => doc.is_free).length}
            </div>
            <div className="text-gray-600 text-sm">Gratuite</div>
          </div>
        </div>

        {/* Lista documentelor */}
        {documents.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-2xl p-12 max-w-2xl mx-auto">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Nu există documente disponibile</h3>
            <p className="text-gray-500">Documentele vor apărea aici după ce sunt adăugate.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {documents.map((document) => (
              <div
                key={document.id}
                className={`bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 relative ${
                  document.is_featured ? 'ring-2 ring-amber-400' : ''
                }`}
              >
                {/* Badge featured */}
                {document.is_featured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                    ⭐ RECOMANDAT
                  </div>
                )}

                {/* Badge preț */}
                <div className="absolute top-4 left-4">
                  {document.is_free ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      💚 GRATUIT
                    </span>
                  ) : (
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      💰 {document.price} RON
                    </span>
                  )}
                </div>

                {/* Conținut */}
                <div className="text-center mb-6 mt-8">
                  <div className="text-6xl mb-4">{document.file_icon || '📄'}</div>
                  <h3 className="text-xl font-bold text-[#b06b4c] mb-2">
                    {document.title}
                  </h3>
                  {document.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {document.description}
                    </p>
                  )}
                </div>

                {/* Detalii */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{document.formatted_size}</span>
                    <span>📥 {document.downloads_count}</span>
                  </div>
                </div>

                {/* Buton */}
                <button
                  onClick={() => handleDownload(document)}
                  className="w-full bg-gradient-to-r from-[#b06b4c] to-amber-600 hover:from-amber-600 hover:to-[#b06b4c] text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300"
                >
                  {document.is_free ? '📥 Descarcă Gratuit' : `💰 Cumpără ${document.price} RON`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DocumentsPublic;
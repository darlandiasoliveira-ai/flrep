import React, { useState, useEffect } from 'react';
import { brands } from '../data';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Image as ImageIcon } from 'lucide-react';

export default function Products() {
  const [catalogs, setCatalogs] = useState<any[]>([]);

  useEffect(() => {
    const qCatalogs = collection(db, 'catalogs');
    const unsubscribeCatalogs = onSnapshot(qCatalogs, (snapshot) => {
      const cats: any[] = [];
      snapshot.forEach((docSnap) => {
        cats.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCatalogs(cats);
    }, (error) => {
      console.error("Error fetching catalogs:", error);
    });

    return () => unsubscribeCatalogs();
  }, []);

  return (
    <div className="flex flex-col">
    <section id="produtos" className="py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
            <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">O que Vendemos</h2>
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Nossas Marcas Representadas</h3>
          <p className="text-slate-600 text-lg">
            Confira as marcas que representamos. Clique em uma marca para visualizar o catálogo de produtos e fotos disponíveis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, index) => {
            return (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-royal-100 transition-all group flex flex-col h-full"
              >
                <div className="w-24 h-24 mb-6 p-4 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <img 
                    src={brand.logo} 
                    alt={`Logo ${brand.name}`} 
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGExYjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{brand.name}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                  Especialidade: {brand.specialty}
                </p>
                <Link to={`/marcas/${brand.slug}`} className="inline-flex items-center text-royal-700 font-bold text-sm group-hover:text-royal-600 mt-auto w-max">
                  Ver marca e produtos
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {catalogs.length > 0 && (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Catálogos Disponíveis</h3>
            <p className="text-slate-600 text-lg">
              Acesse os catálogos completos das nossas marcas parceiras.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogs.map(catalog => (
                <a 
                  key={catalog.id} 
                  href={catalog.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col items-center text-center hover:border-royal-300 hover:shadow-md transition-all h-full"
                >
                  {catalog.coverImageUrl ? (
                    <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                      <img src={catalog.coverImageUrl} alt={catalog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-royal-50 text-royal-700 rounded-full flex items-center justify-center mt-6 mb-4 group-hover:bg-royal-100 group-hover:scale-110 transition-transform">
                      {catalog.fileUrl?.includes('.pdf') ? (
                        <span className="font-bold text-lg">PDF</span>
                      ) : (
                        <ImageIcon className="w-8 h-8" />
                      )}
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col items-center justify-center w-full">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 truncate w-full px-2">{catalog.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{
                      brands.find(b => b.slug === catalog.brandSlug)?.name || 'Catálogo'
                    }</p>
                    <span className="text-sm font-medium text-royal-600 group-hover:text-royal-800 flex items-center gap-1 mt-auto">
                      Acessar Catálogo &rarr;
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>
    )}
    </div>
  );
}

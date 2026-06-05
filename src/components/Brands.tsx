import React from 'react';
import { brands } from '../data';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';

export default function Brands() {
  return (
    <section id="representadas" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="max-w-2xl">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
              <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">Garantia de Qualidade</h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Marcas Representadas</h3>
            <p className="text-slate-600 text-lg">
              Nosso poder comercial é baseado nas grandes fábricas que confiam seus produtos em nossas mãos para distribuição e venda técnica.
            </p>
          </div>
          <Link to="/#contato" className="hidden lg:inline-flex border-2 border-royal-700 text-royal-700 px-8 py-3 rounded-full font-bold hover:bg-royal-50 transition-colors shadow-sm whitespace-nowrap">
            Quero que representem minha marca
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border-t border-l border-slate-100 rounded-lg overflow-hidden">
          {brands.map((brand, index) => (
            <motion.div 
              key={brand.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-r border-b border-slate-100 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center p-8 text-center group cursor-pointer aspect-square"
            >
              <div className="w-20 h-20 mb-4 p-2 bg-white rounded-lg shadow-sm border border-slate-100 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <img 
                  src={brand.logo} 
                  alt={`Logo ${brand.name}`} 
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    // Fallback se a imagem não existir
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGExYjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <h4 className="font-bold text-slate-800 leading-tight mb-2 group-hover:text-royal-700 transition-colors">{brand.name}</h4>
              <p className="text-xs text-slate-500 line-clamp-2">{brand.specialty}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center lg:hidden">
            <Link to="/#contato" className="inline-flex w-full sm:w-auto justify-center border-2 border-royal-700 text-royal-700 px-8 py-3 rounded-full font-bold hover:bg-royal-50 transition-colors">
            Quero que representem minha marca
          </Link>
        </div>
      </div>
    </section>
  );
}

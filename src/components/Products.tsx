import React from 'react';
import { products } from '../data';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';

export default function Products() {
  return (
    <section id="produtos" className="py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
            <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">O que Vendemos</h2>
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Nosso Portfólio de Soluções</h3>
          <p className="text-slate-600 text-lg">
            Oferecemos uma linha residencial e corporativa completa, incluindo guarda-roupas, cozinhas, estantes e racks, desenvolvidos pelas melhores fábricas do país.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-royal-100 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-royal-50 text-royal-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-royal-700 group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{product.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-grow">
                  {product.description}
                </p>
                <Link to="/#contato" className="inline-flex items-center text-royal-700 font-bold text-sm group-hover:text-royal-600 mt-auto w-max">
                  Solicitar Cotação
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <button className="inline-flex items-center justify-center bg-royal-700 text-white px-8 py-3.5 rounded-full font-bold hover:bg-royal-800 transition-colors shadow-lg hover:shadow-royal-700/30">
            Baixar Catálogo Completo (PDF)
          </button>
        </div>
      </div>
    </section>
  );
}

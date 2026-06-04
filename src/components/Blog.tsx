import React from 'react';
import { blogPosts } from '../data';
import * as motion from 'motion/react-client';

export default function Blog() {
  return (
    <section id="blog" className="py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
            <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">Visão de Mercado</h2>
            <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Blog de Notícias do Setor</h3>
          <p className="text-slate-600 text-lg">
            Fique por dentro das últimas atualizações, tecnologias e tendências econômicas que impactam a sua indústria.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-royal-100 transition-all group cursor-pointer flex flex-col h-full"
            >
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-royal-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <div className="w-full h-full bg-slate-200 group-hover:scale-105 transition-transform duration-500 relative flex items-center justify-center">
                   <span className="text-slate-400 text-sm font-medium">Imagem Destacada</span>
                </div>
                <div className="absolute top-4 left-4 z-20 bg-accent-400 text-royal-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  Negócios
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-royal-600 text-xs font-semibold mb-3 uppercase tracking-wider">{post.date}</p>
                <h4 className="font-bold text-xl text-slate-900 mb-4 group-hover:text-royal-700 transition-colors leading-snug">{post.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{post.excerpt}</p>
                <span className="inline-flex items-center text-royal-700 font-bold text-sm mt-auto w-max">
                  Ler artigo
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { ArrowRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="inicio" className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-royal-800 relative overflow-hidden">
      {/* Detalhe abstrato de fundo */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-royal-700 slant-clip hidden lg:block opacity-50" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
      <div className="absolute -left-32 -top-32 w-96 h-96 bg-royal-600 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-royal-900/50 text-accent-400 font-semibold text-xs tracking-wider uppercase mb-6 border border-royal-600/30 shadow-sm">
              Especialistas no Setor Moveleiro
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Trazendo os <span className="text-accent-400">melhores móveis</span> para o seu negócio.
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
              Aumente sua rentabilidade com nosso mix completo de produtos. Há mais de duas décadas construindo pontes eficientes entre as grandes indústrias e os lojistas de Sergipe e Alagoas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/produtos" className="bg-accent-400 text-royal-900 px-8 py-3.5 rounded-full font-bold hover:bg-accent-500 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-accent-500/20 hover:-translate-y-0.5">
                Conheça os Produtos <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/#contato" className="bg-royal-700/50 border border-royal-600 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-royal-700 transition-all flex items-center justify-center">
                Falar com Consultor
              </Link>
            </div>
          </motion.div>
          
          <div className="hidden lg:flex h-[400px] relative items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, x: 20, y: -20 }} 
              animate={{ opacity: 1, x: 0, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }} 
              className="absolute top-10 right-10 z-10 hover:z-30 transition-all duration-300 transform hover:scale-105"
              title="Atendemos Sergipe"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg" alt="Sergipe" className="w-[300px] h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-[-8deg] border-4 border-white/10" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20, y: 20 }} 
              animate={{ opacity: 1, x: 0, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.6 }} 
              className="absolute bottom-10 left-10 z-20 hover:z-30 transition-all duration-300 transform hover:scale-105"
              title="Atendemos Alagoas"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg" alt="Alagoas" className="w-[300px] h-auto object-cover rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform rotate-[6deg] border-4 border-white/10" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

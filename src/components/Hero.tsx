import React from 'react';
import { ArrowRight, TrendingUp, Users } from 'lucide-react';
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
          
          <div className="hidden lg:grid grid-cols-2 gap-6 relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-royal-900/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 mt-16 flex flex-col justify-center items-center text-center shadow-2xl">
              <div className="w-14 h-14 bg-royal-700/50 rounded-2xl flex items-center justify-center mb-6 border border-royal-600">
                <TrendingUp className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-white font-bold text-3xl mb-2">+45%</h3>
              <p className="text-slate-400 text-sm font-medium">Incremento médio em vendas nos parceiros ativos.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-royal-700/60 backdrop-blur-sm p-8 rounded-3xl border border-white/10 mb-16 flex flex-col justify-center items-center text-center shadow-2xl relative z-10 -ml-8">
              <div className="w-14 h-14 bg-royal-800/50 rounded-2xl flex items-center justify-center mb-6 border border-royal-700">
                <Users className="w-7 h-7 text-accent-400" />
              </div>
              <h3 className="text-white font-bold text-3xl mb-2">500+</h3>
              <p className="text-slate-300 text-sm font-medium">Lojistas parceiros nos estados de Sergipe e Alagoas.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Target, Award, Clock } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function About() {
  return (
    <section id="sobre" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-slate-100 rounded-[2rem] overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-royal-800 to-royal-600 opacity-95"></div>
              <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center p-12 text-center border-[12px] border-white/5 rounded-[2rem] m-6">
                 <Target className="w-16 h-16 text-accent-400 mb-6 opacity-90" />
                 <p className="text-white font-medium text-xl leading-snug">
                  "Representamos as principais indústrias moveleiras, garantindo as melhores condições e mix de produtos para o seu negócio."
                 </p>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 bg-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-50">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-accent-400 rounded-full flex items-center justify-center shrink-0">
                  <Award className="w-8 h-8 text-royal-900" />
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-900">20+</p>
                  <p className="text-slate-500 font-semibold text-sm uppercase tracking-wider">Anos de Mercado</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
              <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">Quem Somos</h2>
            </div>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Especialistas no Mercado Moveleiro</h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Trabalhamos incansavelmente para trazer as melhores soluções do mercado para a sua empresa. Nossa equipe de especialistas entende exatamente as demandas contínuas do seu setor e atua como uma parceira estratégica real, desde a busca pelas novidades no ramo de móveis até a entrega.
            </p>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Não apenas vendemos produtos; entregamos qualidade técnica, confiança em reposições rápidas e resultados duradouros para assegurar sua operação comercial.
            </p>

            <div className="mb-10 flex flex-col sm:flex-row items-center gap-6 p-6 bg-royal-50 rounded-2xl border border-royal-100">
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-royal-900 mb-2">Forte Atuação Regional</h4>
                <p className="text-sm text-royal-700 leading-relaxed">Nossa equipe é especializada e atende comercialmente lojas parceiras nos estados de <strong>Sergipe</strong> e <strong>Alagoas</strong>, garantindo visitas frequentes e total entendimento do mercado local.</p>
              </div>
              <div className="flex gap-4 shrink-0 justify-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Bandeira_de_Sergipe.svg" alt="Bandeira de Sergipe" className="w-[4.5rem] h-12 object-cover rounded shadow ring-1 ring-black/5 hover:scale-105 transition-transform" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/8/88/Bandeira_de_Alagoas.svg" alt="Bandeira de Alagoas" className="w-[4.5rem] h-12 object-cover rounded shadow ring-1 ring-black/5 hover:scale-105 transition-transform" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-royal-50 text-royal-700 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">Foco Direcionado</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Atendimento consultivo e altamente técnico para maximizar seu lucro.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-royal-50 text-royal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">Suporte Ágil</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Logística e acompanhamento minucioso para entregas previsíveis.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

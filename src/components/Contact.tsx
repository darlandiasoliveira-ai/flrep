import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  return (
    <section id="contato" className="py-24 bg-white relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-royal-50/50 hidden lg:block -z-10 rounded-bl-[10vw]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-1 bg-accent-400 rounded-full"></div>
              <h2 className="text-royal-700 font-bold tracking-widest uppercase text-xs">Fale Conosco</h2>
            </div>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Pronto para elevar seu negócio?</h3>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed max-w-xl">
              Deixe-nos saber como podemos ajudar. Preencha o formulário ou entre em contato diretamente pelos nossos canais de atendimento preferenciais.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-royal-700">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">Telefone / WhatsApp</h4>
                  <p className="text-slate-600">(11) 99999-9999</p>
                  <p className="text-slate-600">(11) 3333-3333</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-royal-700">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">E-mail</h4>
                  <p className="text-slate-600">contato@flrepresentacoes.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-royal-700">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">Cobertura Regional</h4>
                  <p className="text-slate-600">Amplo atendimento presencial em<br />todo Sergipe (SE) e Alagoas (AL)</p>
                </div>
              </div>
            </div>
            
            <a href="#" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5">
              <Phone className="w-5 h-5 fill-white" />
              Chamar no WhatsApp
            </a>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-2xl relative">
            <h4 className="text-2xl font-bold text-slate-900 mb-8">Envie uma mensagem direta</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Nome Completo</label>
                  <input type="text" id="name" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" placeholder="Seu nome" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="company" className="block text-sm font-semibold text-slate-700 mb-2">Sua Empresa</label>
                  <input type="text" id="company" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" placeholder="Nome da empresa" />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">E-mail Profissional</label>
                <input type="email" id="email" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" placeholder="voce@empresa.com.br" required />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Telefone Comercial</label>
                <input type="tel" id="phone" className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all text-slate-900 placeholder:text-slate-400" placeholder="(xx) xxxx-xxxx" required />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Mensagem ou Solicitação</label>
                <textarea id="message" rows={4} className="w-full px-4 py-3.5 bg-slate-50 rounded-xl border border-transparent focus:bg-white focus:ring-2 focus:ring-royal-500/20 focus:border-royal-500 outline-none transition-all resize-none text-slate-900 placeholder:text-slate-400" placeholder="Nos conte qual produto tem interesse..." required></textarea>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-royal-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-royal-800 transition-all shadow-lg hover:shadow-royal-700/30 disabled:opacity-70 hover:-translate-y-0.5 mt-4">
                {isSubmitting ? (
                  <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>Enviar Cotação <Send className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

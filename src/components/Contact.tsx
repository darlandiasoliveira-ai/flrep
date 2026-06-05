import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

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
                  <h4 className="font-bold text-slate-900 mb-2 text-lg">Telefones</h4>
                  <p className="text-slate-600 mb-2">(79) 3214-4729</p>
                  <a href="https://wa.me/5579991235894" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-royal-600 hover:text-royal-800 transition-colors mb-2">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    (79) 9 9123-5894 - Florisvaldo
                  </a>
                  <a href="https://wa.me/5579998901011" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-royal-600 hover:text-royal-800 transition-colors mb-2">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    (79) 9 9890-1011 - Escritório
                  </a>
                  <a href="https://wa.me/5579991740051" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-royal-600 hover:text-royal-800 transition-colors">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                    (79) 9 9174-0051 - Darlan
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-white border border-slate-100 shadow-sm rounded-2xl flex items-center justify-center shrink-0 text-royal-700">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1 text-lg">E-mail</h4>
                  <a href="mailto:flrepresentacoes@gmail.com" className="text-royal-600 hover:text-royal-800 transition-colors">flrepresentacoes@gmail.com</a>
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
            
            <a href="https://wa.me/5579998901011" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded-full font-bold hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-0.5">
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

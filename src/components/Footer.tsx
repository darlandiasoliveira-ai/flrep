import React from 'react';
import { Briefcase, Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-royal-900 text-slate-300 pt-20 pb-10 border-t border-royal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="FL Representações" className="h-12 md:h-16 w-36 md:w-48 object-cover object-center bg-white border-2 border-white rounded shadow-md" />
            </Link>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Construindo parcerias sólidas e impulsionando negócios através de soluções em representação comercial no setor moveleiro.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/fl_representacoes/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-royal-800 flex items-center justify-center hover:bg-accent-400 hover:text-royal-900 transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wide text-sm">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-accent-400 transition-colors text-sm">Início</Link></li>
              <li><Link to="/sobre" className="hover:text-accent-400 transition-colors text-sm">Sobre Nós</Link></li>
              <li><Link to="/produtos" className="hover:text-accent-400 transition-colors text-sm">Produtos</Link></li>
              <li><Link to="/#representadas" className="hover:text-accent-400 transition-colors text-sm">Representadas</Link></li>
              <li><Link to="/blog" className="hover:text-accent-400 transition-colors text-sm">Blog de Notícias</Link></li>
              <li><Link to="/admin" className="hover:text-accent-400 transition-colors text-sm font-bold text-royal-200">Painel Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wide text-sm">Contato</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start text-sm">
                <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <span>Atendimento especializado para<br />lojistas em Sergipe e Alagoas</span>
              </li>
              <li className="flex gap-3 items-start text-sm">
                <Phone className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5">
                  <span>(79) 3214-4729</span>
                  <a href="https://wa.me/5579991235894" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    (79) 9 9123-5894 - Florisvaldo
                  </a>
                  <a href="https://wa.me/5579998901011" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    (79) 9 9890-1011 - Escritório
                  </a>
                  <a href="https://wa.me/5579991740051" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-accent-400 transition-colors">
                    <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                    (79) 9 9174-0051 - Darlan
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-center text-sm">
                <Mail className="w-5 h-5 text-accent-400 shrink-0" />
                <a href="mailto:flrepresentacoes@gmail.com" className="hover:text-accent-400 transition-colors">flrepresentacoes@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-royal-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} FL Representações. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Politicas</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

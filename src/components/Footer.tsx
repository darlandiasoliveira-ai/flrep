import React from 'react';
import { Briefcase, Mail, Phone, MapPin, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-royal-900 text-slate-300 pt-20 pb-10 border-t border-royal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="FL Representações" className="h-12 md:h-16 w-36 md:w-48 object-cover object-center bg-white border-2 border-white rounded shadow-md" />
            </Link>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed">
              Construindo parcerias sólidas e impulsionando negócios através de soluções em representação comercial no setor moveleiro.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-royal-800 flex items-center justify-center hover:bg-accent-400 hover:text-royal-900 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-royal-800 flex items-center justify-center hover:bg-accent-400 hover:text-royal-900 transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-royal-800 flex items-center justify-center hover:bg-accent-400 hover:text-royal-900 transition-colors"><Facebook className="w-5 h-5" /></a>
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
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wide text-sm">Representadas</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-accent-400 transition-colors text-sm">Marca Alpha</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors text-sm">TechSolutions</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors text-sm">EcoConstruct</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors text-sm">GlobalParts</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors text-sm font-semibold">Seja uma Representada</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wide text-sm">Contato</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start text-sm">
                <MapPin className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                <span>Atendimento especializado para<br />lojistas em Sergipe e Alagoas</span>
              </li>
              <li className="flex gap-3 items-center text-sm">
                <Phone className="w-5 h-5 text-accent-400 shrink-0" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex gap-3 items-center text-sm">
                <Mail className="w-5 h-5 text-accent-400 shrink-0" />
                <span>contato@flrepresentacoes.com.br</span>
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

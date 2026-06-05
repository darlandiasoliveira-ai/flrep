import React, { useState, useEffect } from 'react';
import { Menu, X, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Produtos', href: '/produtos' },
    { name: 'Representadas', href: '/#representadas' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/#contato' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-royal-800 shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="absolute inset-0 bg-royal-800 opacity-95 md:hidden -z-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative z-20">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="FL Representações" className="h-12 md:h-16 w-40 md:w-56 object-cover object-center bg-white border-2 border-white rounded shadow-md" />
          </Link>
          
          <nav className="hidden md:flex gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.href} className="text-slate-200 hover:text-accent-400 font-medium transition-colors cursor-pointer text-sm">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link to="/#contato" className="bg-accent-400 text-royal-900 px-6 py-2 rounded-full font-bold hover:bg-accent-500 transition-colors shadow-md text-sm">
              Solicitar Contato
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-royal-800 shadow-xl py-4 border-t border-royal-700">
          <div className="flex flex-col px-4 gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-200 hover:text-accent-400 font-medium block py-3 border-b border-royal-700"
              >
                {link.name}
              </Link>
            ))}
            <Link 
                to="/#contato" 
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 text-center bg-accent-400 text-royal-900 px-6 py-3 rounded-md font-bold hover:bg-accent-500 transition-colors shadow-md text-sm"
              >
                Solicitar Contato
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

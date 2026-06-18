import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import * as motion from 'motion/react-client';
import { ChevronRight } from 'lucide-react';

export default function HomeHighlights() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const qHigh = query(collection(db, 'highlights'), orderBy('createdAt', 'desc'));
    const unsubHigh = onSnapshot(qHigh, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      setHighlights(items);
    });

    const qFeatured = query(collection(db, 'featuredProducts'), orderBy('createdAt', 'desc'));
    const unsubFeatured = onSnapshot(qFeatured, (snapshot) => {
      const items: any[] = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      setFeaturedProducts(items);
      setIsLoading(false);
    }, () => {
      setIsLoading(false);
    });

    return () => {
      unsubHigh();
      unsubFeatured();
    };
  }, []);

  if (isLoading) {
    return null; // hide section while loading
  }

  // Placeholders para mostrar como a área ficará na página inicial caso esteja vazia
  const displayHighlights = highlights.length > 0 ? highlights : [
    {
      id: 'placeholder-1',
      title: 'Seu Banner Aqui (Adicione no Painel)',
      imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
      linkUrl: ''
    },
    {
      id: 'placeholder-2',
      title: 'Arraste para o lado para ver mais banners',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      linkUrl: ''
    }
  ];

  const displayFeaturedProducts = featuredProducts.length > 0 ? featuredProducts : [
    {
      id: 'prod-placeholder-1',
      title: 'Produto de Exemplo 1',
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      linkUrl: ''
    },
    {
      id: 'prod-placeholder-2',
      title: 'Produto de Exemplo 2',
      imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
      linkUrl: ''
    },
    {
      id: 'prod-placeholder-3',
      title: 'Produto de Exemplo 3',
      imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
      linkUrl: ''
    },
    {
      id: 'prod-placeholder-4',
      title: 'Produto de Exemplo 4',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      linkUrl: ''
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banners Carrossel (Novidades) */}
        {displayHighlights.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Novidades</h2>
              <div className="h-1 flex-1 bg-slate-200 rounded-full max-w-xs"></div>
            </div>
            
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 hide-scrollbar">
              {displayHighlights.map((highlight) => {
                const isExternal = highlight.linkUrl?.startsWith('http');
                const imageEl = (
                  <div className="w-[85vw] md:w-[60vw] lg:w-[45vw] lg:max-w-3xl shrink-0 snap-center rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative group aspect-[21/9]">
                    <img 
                      src={highlight.imageUrl} 
                      alt={highlight.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      {highlight.title && (
                        <h3 className="text-white text-xl md:text-2xl font-bold">{highlight.title}</h3>
                      )}
                    </div>
                  </div>
                );

                if (highlight.linkUrl) {
                  return isExternal ? (
                    <a key={highlight.id} href={highlight.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                      {imageEl}
                    </a>
                  ) : (
                    <Link key={highlight.id} to={highlight.linkUrl} className="block">
                      {imageEl}
                    </Link>
                  );
                }

                return <React.Fragment key={highlight.id}>{imageEl}</React.Fragment>;
              })}
            </div>
          </div>
        )}

        {/* Principais Produtos */}
        {displayFeaturedProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Principais Produtos</h2>
              <div className="h-1 flex-1 bg-slate-200 rounded-full max-w-xs"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {displayFeaturedProducts.map((product, index) => {
                const isExternal = product.linkUrl?.startsWith('http');
                const cardContent = (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-royal-100 transition-all group overflow-hidden flex flex-col h-full cursor-pointer"
                  >
                    <div className="aspect-square bg-slate-100 overflow-hidden relative">
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h4 className="text-sm md:text-base font-bold text-slate-900 group-hover:text-royal-700 transition-colors line-clamp-2 mb-2">
                        {product.title}
                      </h4>
                      <div className="mt-auto flex items-center justify-between text-royal-700 text-xs font-bold uppercase tracking-wider">
                        <span>Ver detalhes</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );

                if (product.linkUrl) {
                  return isExternal ? (
                    <a key={product.id} href={product.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
                      {cardContent}
                    </a>
                  ) : (
                    <Link key={product.id} to={product.linkUrl} className="block h-full">
                      {cardContent}
                    </Link>
                  );
                }

                return <div key={product.id} className="h-full">{cardContent}</div>;
              })}
            </div>
          </div>
        )}

      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
}

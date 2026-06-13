import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { brands } from '../data';
import * as motion from 'motion/react-client';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function BrandDetails() {
  const { slug } = useParams<{ slug: string }>();
  const brand = brands.find(b => b.slug === slug);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const q = query(collection(db, 'products'), where('brandSlug', '==', slug));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: any[] = [];
      snapshot.forEach((docSnap) => {
        prods.push({ id: docSnap.id, ...docSnap.data() });
      });
      // also include offline placeholder products for demo purposes if desired, 
      // but we will stick to only DB products as required.
      setProducts(prods);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (!brand) {
    return (
      <div className="py-24 text-center min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Marca não encontrada</h2>
        <Link to="/produtos" className="text-royal-600 hover:text-royal-800 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para Produtos
        </Link>
      </div>
    );
  }

  return (
    <section className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/produtos" className="inline-flex items-center text-slate-500 hover:text-royal-700 transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Marcas
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 bg-white border border-slate-100 rounded-xl p-6 shadow-sm flex items-center justify-center shrink-0">
            <img 
              src={brand.logo} 
              alt={`Logo ${brand.name}`} 
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjVmOSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NGExYjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5Mb2dvPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{brand.name}</h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Nesta página você pode visualizar o catálogo de produtos e os lançamentos da marca {brand.name}. {products.length === 0 && 'Em breve, as fotos dos produtos estarão disponíveis abaixo.'}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-1 bg-royal-700 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-900">Catálogo de Produtos</h2>
          </div>

          {isLoading ? (
             <div className="py-12 text-center text-slate-500">
               Carregando catálogo...
             </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-slate-100 overflow-hidden relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title || 'Produto'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 text-center border-t border-slate-100">
                    <h3 className="font-bold text-slate-800">{product.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-700 mb-2">Em breve Novos Produtos</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Estamos atualizando o catálogo da {brand.name}. Volte em breve para conferir as novidades.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

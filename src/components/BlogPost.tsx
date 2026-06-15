import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setPost({ id: doc.id, ...doc.data() });
      } else {
        setPost(null);
      }
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching blog post:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="text-royal-700 animate-pulse font-medium text-lg">Carregando artigo...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Artigo não encontrado</h1>
          <p className="text-slate-600 mb-8">O artigo que você está procurando pode ter sido removido ou o link está incorreto.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-royal-700 text-white px-6 py-3 rounded-full font-bold hover:bg-royal-800 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Voltar para o Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen pt-32 pb-24 bg-white" itemScope itemType="http://schema.org/BlogPosting">
      <Helmet>
        <title>{post.seoTitle || post.title} | FL Representações</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        {post.seoKeywords && <meta name="keywords" content={post.seoKeywords} />}
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={window.location.href} />
        
        {/* GEO-Specific Meta Data */}
        {post.geoTargeting && <meta name="geo.region" content="BR" />}
        {post.geoTargeting && <meta name="geo.placename" content={post.geoTargeting} />}
        
        {/* JSON-LD for Structured Data (GEO / SEO) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": window.location.href
            },
            "headline": post.title,
            "description": post.seoDescription || post.excerpt,
            "image": post.imageUrl ? [post.imageUrl] : [],
            "datePublished": post.createdAt ? post.createdAt.toDate().toISOString() : new Date().toISOString(),
            "dateModified": post.createdAt ? post.createdAt.toDate().toISOString() : new Date().toISOString(),
            "author": {
              "@type": "Organization",
              "name": "FL Representações",
              "url": window.location.origin
            },
            "publisher": {
              "@type": "Organization",
              "name": "FL Representações",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            },
            "keywords": post.seoKeywords || "",
            "contentLocation": post.geoTargeting ? {
              "@type": "Place",
              "name": post.geoTargeting
            } : undefined
          })}
        </script>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center text-royal-700 hover:text-royal-800 font-medium mb-8 group transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para todos os artigos
        </Link>
        
        <header className="mb-12">
          {post.geoTargeting && (
            <div className="flex items-center gap-2 text-accent-600 font-bold text-sm tracking-widest uppercase mb-4">
               <Tag className="w-4 h-4" />
               <span itemProp="contentLocation">{post.geoTargeting}</span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6" itemProp="headline">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              <time itemProp="datePublished" dateTime={post.createdAt ? post.createdAt.toDate().toISOString() : ''}>
                {post.createdAt ? post.createdAt.toDate().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recém publicado'}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              <span itemProp="author">Equipe FL Representações</span>
            </div>
          </div>
        </header>

        {post.imageUrl && (
          <figure className="mb-12 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover aspect-video" 
              itemProp="image"
            />
          </figure>
        )}

        {/* GEO Optimization Visual Elements */}
        {post.geoTakeaways && (
          <div className="mb-10 bg-royal-50 border border-royal-100 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-royal-900 mb-4">Principais Tópicos (Key Takeaways)</h3>
            <div className="prose prose-royal max-w-none text-royal-800">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.geoTakeaways}</ReactMarkdown>
            </div>
          </div>
        )}

        {post.geoStats && (
          <div className="mb-10 bg-slate-50 border-l-4 border-accent-400 p-6 md:p-8 rounded-r-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dados e Estatísticas</h3>
            <div className="prose prose-slate max-w-none text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.geoStats}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-a:text-royal-700 hover:prose-a:text-royal-800 prose-img:rounded-2xl" itemProp="articleBody">
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.content}</ReactMarkdown>
        </div>

        {post.geoFaq && (
          <div className="mt-12 mb-10 pt-10 border-t border-slate-200" itemScope itemType="https://schema.org/FAQPage">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Perguntas Frequentes</h3>
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{post.geoFaq}</ReactMarkdown>
            </div>
          </div>
        )}
        
        {post.seoKeywords && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Tags do Artigo</h4>
            <div className="flex flex-wrap gap-2">
              {post.seoKeywords.split(',').map((keyword: string, index: number) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-full text-sm font-medium">
                  {keyword.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

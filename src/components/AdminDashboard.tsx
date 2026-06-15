import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, Image as ImageIcon, Trash2, FolderEdit } from 'lucide-react';
import { brands } from '../data';
import { auth, db, storage } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import RichTextEditor from './RichTextEditor';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('brand_' + brands[0].slug);
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewImage(downloadURL);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem", error);
      alert("Erro ao fazer upload. Verifique as permissões do Firebase Storage.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };
  const [newSlug, setNewSlug] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSeoTitle, setNewSeoTitle] = useState('');
  const [newSeoDescription, setNewSeoDescription] = useState('');
  const [newSeoKeywords, setNewSeoKeywords] = useState('');
  const [newGeoTargeting, setNewGeoTargeting] = useState('');
  const [newGeoTakeaways, setNewGeoTakeaways] = useState('');
  const [newGeoStats, setNewGeoStats] = useState('');
  const [newGeoFaq, setNewGeoFaq] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== 'darlandiasoliveira@gmail.com') {
        navigate('/admin/login');
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  useEffect(() => {
    if (isLoading) return;
    
    if (activeTab.startsWith('brand_')) {
      const brandSlug = activeTab.replace('brand_', '');
      const q = query(collection(db, 'products'), where('brandSlug', '==', brandSlug));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const prods: any[] = [];
        snapshot.forEach((docSnap) => {
          prods.push({ id: docSnap.id, ...docSnap.data() });
        });
        setProducts(prods);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'products');
      });

      return () => unsubscribe();
    } else if (activeTab === 'blog') {
      const q = query(collection(db, 'blogPosts'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const posts: any[] = [];
        snapshot.forEach((docSnap) => {
          posts.push({ id: docSnap.id, ...docSnap.data() });
        });
        setBlogPosts(posts);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'blogPosts');
      });

      return () => unsubscribe();
    }
  }, [activeTab, isLoading]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImage) return;

    try {
      const currentBrandSlug = activeTab.replace('brand_', '');
      await addDoc(collection(db, 'products'), {
        title: newTitle,
        imageUrl: newImage,
        brandSlug: currentBrandSlug,
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewImage('');
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
      alert('Erro ao adicionar produto. Verifique as permissões.');
    }
  };

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSlug || !newExcerpt || !newContent) return;

    try {
      const postData: any = {
        title: newTitle,
        slug: newSlug,
        excerpt: newExcerpt,
        content: newContent,
        createdAt: serverTimestamp()
      };
      
      if (newImage) postData.imageUrl = newImage;
      if (newSeoTitle) postData.seoTitle = newSeoTitle;
      if (newSeoDescription) postData.seoDescription = newSeoDescription;
      if (newSeoKeywords) postData.seoKeywords = newSeoKeywords;
      if (newGeoTargeting) postData.geoTargeting = newGeoTargeting;
      if (newGeoTakeaways) postData.geoTakeaways = newGeoTakeaways;
      if (newGeoStats) postData.geoStats = newGeoStats;
      if (newGeoFaq) postData.geoFaq = newGeoFaq;

      await addDoc(collection(db, 'blogPosts'), postData);
      setNewTitle('');
      setNewSlug('');
      setNewExcerpt('');
      setNewContent('');
      setNewImage('');
      setNewSeoTitle('');
      setNewSeoDescription('');
      setNewSeoKeywords('');
      setNewGeoTargeting('');
      setNewGeoTakeaways('');
      setNewGeoStats('');
      setNewGeoFaq('');
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'blogPosts');
      alert('Erro ao adicionar artigo. Verifique as permissões.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este produto?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
      alert('Erro ao excluir produto.');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja remover este artigo?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `blogPosts/${id}`);
      alert('Erro ao excluir artigo.');
    }
  };

  const currentBrand = brands.find(b => b.slug === activeTab.replace('brand_', ''));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row pt-20 pb-12">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col shrink-0 min-h-[calc(100vh-5rem)]">
        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <FolderEdit className="w-5 h-5 text-royal-700" /> Painel Admin
        </h2>
        
        <div className="space-y-1 flex-1">
          <button
            onClick={() => setActiveTab('blog')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-4 ${
              activeTab === 'blog' 
                ? 'bg-royal-50 text-royal-700 border border-royal-100' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Artigos do Blog
          </button>
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Marcas Representadas</div>
          {brands.map(brand => (
            <button
              key={brand.id}
              onClick={() => setActiveTab('brand_' + brand.slug)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'brand_' + brand.slug 
                  ? 'bg-royal-50 text-royal-700 border border-royal-100' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors text-sm font-medium pt-8"
        >
          <LogOut className="w-4 h-4" /> Sair do Sistema
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'blog' ? (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-center">
                  <FolderEdit className="w-8 h-8 text-royal-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gerenciar Blog</h1>
                  <p className="text-slate-500 text-sm">Adicione artigos com informações para SEO e GEO</p>
                </div>
              </div>

              <div className="mb-8">
                {!isAdding ? (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 bg-royal-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-royal-800 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Escrever Artigo
                  </button>
                ) : (
                  <form onSubmit={handleAddBlogPost} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Novo Artigo</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                          <input 
                            type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Slug (URL)</label>
                          <input 
                            type="text" required value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                            placeholder="exemplo-de-artigo"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Resumo (Excerpt)</label>
                        <textarea 
                          required value={newExcerpt} onChange={(e) => setNewExcerpt(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Conteúdo do Artigo (Atualizado - Novo Editor Tiptap)</label>
                        <RichTextEditor value={newContent} onChange={setNewContent} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imagem de Destaque (Upload ou URL)</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingImage ? 'Enviando...' : 'Fazer Upload'}
                          </button>
                          <input 
                            type="url" 
                            value={newImage} 
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="Ou cole a URL da imagem aqui"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                          />
                        </div>
                        {newImage && <img src={newImage} alt="Preview" className="mt-2 h-32 object-cover rounded-lg border border-slate-200" />}
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                      </div>
                      <div className="border-t border-slate-200 mt-4 pt-4">
                        <h4 className="font-semibold text-slate-800 mb-3">Informações de SEO e GEO</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SEO Title</label>
                            <input 
                              type="text" value={newSeoTitle} onChange={(e) => setNewSeoTitle(e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SEO Keywords</label>
                            <input 
                              type="text" value={newSeoKeywords} onChange={(e) => setNewSeoKeywords(e.target.value)}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                              placeholder="moveis, atacado, nordeste"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-1">SEO Description</label>
                          <textarea 
                            value={newSeoDescription} onChange={(e) => setNewSeoDescription(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-1">GEO Targeting (Localização)</label>
                          <input 
                            type="text" value={newGeoTargeting} onChange={(e) => setNewGeoTargeting(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                            placeholder="Sergipe e Alagoas, nordeste do Brasil"
                          />
                        </div>
                      </div>

                      <div className="border-t border-slate-200 mt-6 pt-6">
                        <h4 className="font-semibold text-slate-800 mb-3">Otimização para IAs (GEO)</h4>
                        <p className="text-sm text-slate-500 mb-4">Campos específicos para melhorar a visibilidade do artigo em respostas de ferramentas baseadas em IA (Google AI Overviews, ChatGPT, etc).</p>
                        
                        <div className="space-y-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Principais Tópicos (Key Takeaways)</label>
                            <RichTextEditor value={newGeoTakeaways} onChange={setNewGeoTakeaways} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Estatísticas e Dados (Citações de Autoridade)</label>
                            <RichTextEditor value={newGeoStats} onChange={setNewGeoStats} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">FAQ (Perguntas e Respostas Frequentes)</label>
                            <RichTextEditor value={newGeoFaq} onChange={setNewGeoFaq} />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-slate-200">
                        <button type="submit" className="bg-royal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-royal-800">
                          Publicar Artigo
                        </button>
                        <button type="button" onClick={() => setIsAdding(false)} className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Artigos Publicados ({blogPosts.length})</h3>
              
              {blogPosts.length > 0 ? (
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <div key={post.id} className="bg-white border flex justify-between items-center border-slate-200 rounded-xl p-4">
                      <div>
                        <h4 className="font-bold text-slate-800">{post.title}</h4>
                        <p className="text-xs text-slate-500">Slug: {post.slug} | Data: {post.createdAt ? post.createdAt.toDate().toLocaleDateString('pt-BR') : 'Aguardando...'}</p>
                      </div>
                      <button onClick={() => handleDeletePost(post.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <p className="text-slate-500">Nenhum artigo publicado ainda.</p>
                </div>
              )}
             </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-center">
                  <img src={currentBrand?.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Gerenciar: {currentBrand?.name}</h1>
                  <p className="text-slate-500 text-sm">Adicione ou remova fotos de produtos desta marca</p>
                </div>
              </div>

              <div className="mb-8">
                {!isAdding ? (
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 bg-royal-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-royal-800 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Adicionar Produto
                  </button>
                ) : (
                  <form onSubmit={handleAddProduct} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4">Novo Produto</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título do Produto</label>
                        <input 
                          type="text" 
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                          placeholder="Ex: Guarda-roupa 6 portas"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do Produto (Upload ou URL)</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingImage ? 'Enviando...' : 'Fazer Upload'}
                          </button>
                          <input 
                            type="url" 
                            required
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                            placeholder="Ou cole a URL da imagem aqui"
                          />
                        </div>
                        {newImage && <img src={newImage} alt="Preview" className="mt-2 h-32 object-cover rounded-lg border border-slate-200" />}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="submit"
                          className="bg-royal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-royal-800 transition-colors"
                        >
                          Salvar Produto
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsAdding(false)}
                          className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              <h3 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Produtos Cadastrados ({products.length})</h3>
              
              {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white border text-center border-slate-200 rounded-xl overflow-hidden group">
                      <div className="aspect-square bg-slate-100 overflow-hidden relative">
                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors mb-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="text-white text-xs font-medium">Remover</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-bold text-slate-800">{product.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <ImageIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Nenhum produto cadastrado nesta marca ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Upload, Image as ImageIcon, Trash2, FolderEdit, Edit2 } from 'lucide-react';
import { brands } from '../data';
import { auth, db, storage } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
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
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCatalog, setIsAddingCatalog] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newProductImages, setNewProductImages] = useState<string[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newCatalogTitle, setNewCatalogTitle] = useState('');
  const [newCatalogFile, setNewCatalogFile] = useState('');
  const [newCatalogCover, setNewCatalogCover] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMultiImages, setIsUploadingMultiImages] = useState(false);
  const [isUploadingCatalog, setIsUploadingCatalog] = useState(false);
  const [isUploadingCatalogCover, setIsUploadingCatalogCover] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const multiFileInputRef = React.useRef<HTMLInputElement>(null);
  const catalogInputRef = React.useRef<HTMLInputElement>(null);
  const catalogCoverInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleMultiImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingMultiImages(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const storageRef = ref(storage, `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
        const snapshot = await uploadBytesResumable(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });
      const downloadURLs = await Promise.all(uploadPromises);
      setNewProductImages(prev => [...prev, ...downloadURLs]);
    } catch (error) {
      console.error("Erro ao fazer upload das imagens", error);
      alert("Erro ao fazer upload. Verifique as permissões do Firebase Storage.");
    } finally {
      setIsUploadingMultiImages(false);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  const handleCatalogUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCatalog(true);
    try {
      const storageRef = ref(storage, `catalogs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewCatalogFile(downloadURL);
    } catch (error) {
      console.error("Erro ao fazer upload do catálogo", error);
      alert("Erro ao fazer upload. Verifique as permissões do Firebase.");
    } finally {
      setIsUploadingCatalog(false);
      if (catalogInputRef.current) catalogInputRef.current.value = '';
    }
  };

  const handleCatalogCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCatalogCover(true);
    try {
      const storageRef = ref(storage, `catalogs-covers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
      const snapshot = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setNewCatalogCover(downloadURL);
    } catch (error) {
      console.error("Erro ao fazer upload da capa", error);
      alert("Erro ao fazer upload. Verifique as permissões do Firebase.");
    } finally {
      setIsUploadingCatalogCover(false);
      if (catalogCoverInputRef.current) catalogCoverInputRef.current.value = '';
    }
  };

  const handleAddCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatalogTitle || !newCatalogFile) return;

    try {
      const currentBrandSlug = activeTab.replace('brand_', '');
      await addDoc(collection(db, 'catalogs'), {
        title: newCatalogTitle,
        fileUrl: newCatalogFile,
        coverImageUrl: newCatalogCover,
        brandSlug: currentBrandSlug,
        createdAt: serverTimestamp()
      });
      setNewCatalogTitle('');
      setNewCatalogFile('');
      setNewCatalogCover('');
      setIsAddingCatalog(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'catalogs');
      console.error("Erro ao adicionar catálogo", error);
      alert(`Erro ao adicionar catálogo. ${error}`);
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este catálogo?')) {
      try {
        await deleteDoc(doc(db, 'catalogs', id));
      } catch (error) {
        console.error("Erro ao remover catálogo", error);
      }
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

      const qCatalogs = query(collection(db, 'catalogs'), where('brandSlug', '==', brandSlug));
      const unsubscribeCatalogs = onSnapshot(qCatalogs, (snapshot) => {
        const cats: any[] = [];
        snapshot.forEach((docSnap) => {
          cats.push({ id: docSnap.id, ...docSnap.data() });
        });
        setCatalogs(cats);
      }, (error) => {
        console.error("Error listing catalogs: ", error);
      });

      return () => {
        unsubscribe();
        unsubscribeCatalogs();
      };
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
    } else if (activeTab === 'home_highlights') {
      const qHighlights = query(collection(db, 'highlights'));
      const unsubHighlight = onSnapshot(qHighlights, (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
        setHighlights(items);
      });

      const qFeatured = query(collection(db, 'featuredProducts'));
      const unsubFeatured = onSnapshot(qFeatured, (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
        setFeaturedProducts(items);
      });

      return () => {
        unsubHighlight();
        unsubFeatured();
      };
    }
  }, [activeTab, isLoading]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleAddHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage) return;

    try {
      if (editingHighlightId) {
        await updateDoc(doc(db, 'highlights', editingHighlightId), {
          title: newTitle || '',
          imageUrl: newImage,
          linkUrl: newLinkUrl || '',
        });
      } else {
        await addDoc(collection(db, 'highlights'), {
          title: newTitle || '',
          imageUrl: newImage,
          linkUrl: newLinkUrl || '',
          createdAt: serverTimestamp()
        });
      }
      setNewTitle('');
      setNewImage('');
      setNewLinkUrl('');
      setIsAdding(false);
      setEditingHighlightId(null);
    } catch (error: any) {
      console.error(error);
      alert((editingHighlightId ? 'Erro ao atualizar destaque: ' : 'Erro ao adicionar destaque: ') + (error.message || error));
    }
  };

  const handleAddFeaturedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage || !newTitle) return;

    try {
      await addDoc(collection(db, 'featuredProducts'), {
        title: newTitle,
        imageUrl: newImage,
        linkUrl: newLinkUrl || '',
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewImage('');
      setNewLinkUrl('');
      setIsAddingCatalog(false); // using this state to toggle the second section form
    } catch (error: any) {
      console.error(error);
      alert('Erro ao adicionar produto em destaque: ' + (error.message || error));
    }
  };

  const handleDeleteHighlight = async (id: string) => {
    if (!window.confirm('Tem certeza?')) return;
    try { await deleteDoc(doc(db, 'highlights', id)); } catch(e) {}
  };

  const handleDeleteFeaturedProduct = async (id: string) => {
    if (!window.confirm('Tem certeza?')) return;
    try { await deleteDoc(doc(db, 'featuredProducts', id)); } catch(e) {}
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || (newProductImages.length === 0 && !newImage)) {
      alert("Título e pelo menos uma imagem são obrigatórios.");
      return;
    }

    try {
      const currentBrandSlug = activeTab.replace('brand_', '');
      
      const productImages = newProductImages.length > 0 ? newProductImages : [newImage];
      
      await addDoc(collection(db, 'products'), {
        title: newTitle,
        imageUrl: productImages[0], // fallback for older UI
        images: productImages,
        brandSlug: currentBrandSlug,
        createdAt: serverTimestamp()
      });
      setNewTitle('');
      setNewImage('');
      setNewProductImages([]);
      setIsAdding(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
      alert('Erro ao adicionar produto. Verifique as permissões.');
    }
  };

  const resetBlogForm = () => {
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
    setEditingPostId(null);
    setIsAdding(false);
  };

  const handleEditPost = (post: any) => {
    setNewTitle(post.title || '');
    setNewSlug(post.slug || '');
    setNewExcerpt(post.excerpt || '');
    setNewContent(post.content || '');
    setNewImage(post.imageUrl || '');
    setNewSeoTitle(post.seoTitle || '');
    setNewSeoDescription(post.seoDescription || '');
    setNewSeoKeywords(post.seoKeywords || '');
    setNewGeoTargeting(post.geoTargeting || '');
    setNewGeoTakeaways(post.geoTakeaways || '');
    setNewGeoStats(post.geoStats || '');
    setNewGeoFaq(post.geoFaq || '');
    setEditingPostId(post.id);
    setIsAdding(true);
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
      };
      
      if (!editingPostId) {
        postData.createdAt = serverTimestamp();
      } else {
        postData.updatedAt = serverTimestamp();
      }
      
      postData.imageUrl = newImage || '';
      postData.seoTitle = newSeoTitle || '';
      postData.seoDescription = newSeoDescription || '';
      postData.seoKeywords = newSeoKeywords || '';
      postData.geoTargeting = newGeoTargeting || '';
      postData.geoTakeaways = newGeoTakeaways || '';
      postData.geoStats = newGeoStats || '';
      postData.geoFaq = newGeoFaq || '';

      if (editingPostId) {
        await updateDoc(doc(db, 'blogPosts', editingPostId), postData);
      } else {
        await addDoc(collection(db, 'blogPosts'), postData);
      }
      
      resetBlogForm();
    } catch (error) {
      handleFirestoreError(error, editingPostId ? OperationType.UPDATE : OperationType.CREATE, 'blogPosts');
      alert(`Erro ao ${editingPostId ? 'atualizar' : 'adicionar'} artigo. Verifique as permissões.`);
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
            onClick={() => setActiveTab('home_highlights')}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors mb-4 ${
              activeTab === 'home_highlights' 
                ? 'bg-royal-50 text-royal-700 border border-royal-100' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Página Inicial (Destaques)
          </button>
          
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
          {activeTab === 'home_highlights' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-royal-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Destaques da Página Inicial</h1>
                  <p className="text-slate-500 text-sm">Gerencie o Carrossel (Novidades) e os Principais Produtos</p>
                </div>
              </div>

              {/* BANNERS / CARROSSEL */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Banners do Carrossel ({highlights.length})</h3>
                  {!isAdding && (
                    <button 
                      onClick={() => { setIsAdding(true); setNewTitle(''); setNewImage(''); setNewLinkUrl(''); setEditingHighlightId(null); }}
                      className="text-sm font-medium text-royal-700 hover:text-royal-800 flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" /> Adicionar Banner
                    </button>
                  )}
                </div>

                {isAdding && (
                  <form onSubmit={handleAddHighlight} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h4 className="font-bold text-slate-900 mb-4">{editingHighlightId ? 'Editar Banner' : 'Novo Banner'}</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título / Descrição (Opcional)</label>
                        <input 
                          type="text" 
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link de Destino ao clicar (Opcional)</label>
                        <input 
                          type="text" 
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="/marcas/moval ou https://google.com"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do Banner</label>
                        <p className="text-xs text-slate-500 mb-2">Tamanho ideal recomendado: <strong>1920 x 820 pixels</strong> (Formato Horizontal 21:9). A imagem será cortada para se adaptar à tela corretamente.</p>
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
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-royal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-royal-800 transition-colors">
                          Salvar Banner
                        </button>
                        <button type="button" onClick={() => { setIsAdding(false); setEditingHighlightId(null); }} className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {highlights.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highlights.map((item) => (
                      <div key={item.id} className="bg-white border rounded-xl overflow-hidden group">
                        <div className="h-32 bg-slate-100 overflow-hidden relative">
                          <img src={item.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3 flex justify-between items-center">
                          <div className="truncate text-sm font-medium">{item.title || 'Sem título'}</div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingHighlightId(item.id);
                                setNewTitle(item.title || '');
                                setNewImage(item.imageUrl || '');
                                setNewLinkUrl(item.linkUrl || '');
                                setIsAdding(true);
                              }}
                              className="text-slate-500 hover:text-royal-700 p-1"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteHighlight(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">Nenhum banner cadastrado.</p>
                  </div>
                )}
              </div>

              {/* PRODUTOS EM DESTAQUE */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Principais Produtos ({featuredProducts.length})</h3>
                  {!isAddingCatalog && (
                    <button 
                      onClick={() => { setIsAddingCatalog(true); setNewTitle(''); setNewImage(''); setNewLinkUrl(''); }}
                      className="text-sm font-medium text-royal-700 hover:text-royal-800 flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" /> Adicionar Produto
                    </button>
                  )}
                </div>

                {isAddingCatalog && (
                  <form onSubmit={handleAddFeaturedProduct} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h4 className="font-bold text-slate-900 mb-4">Novo Produto em Destaque</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título do Produto</label>
                        <input 
                          type="text" 
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Link de Destino ao clicar (Opcional)</label>
                        <input 
                          type="text" 
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder="/marcas/moval"
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imagem do Produto</label>
                        <p className="text-xs text-slate-500 mb-2">Tamanho ideal recomendado: <strong>800 x 800 pixels</strong> (Formato Quadrado 1:1).</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => catalogCoverInputRef.current?.click()}
                            disabled={isUploadingCatalogCover}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingCatalogCover ? 'Enviando...' : 'Fazer Upload'}
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
                        {newImage && <img src={newImage} alt="Preview" className="mt-2 h-24 object-cover rounded-lg border border-slate-200" />}
                        <input type="file" accept="image/*" className="hidden" ref={catalogCoverInputRef} onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingCatalogCover(true);
                          const storageRef = ref(storage, `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`);
                          uploadBytesResumable(storageRef, file).then(snapshot => {
                            getDownloadURL(snapshot.ref).then(url => {
                              setNewImage(url);
                              setIsUploadingCatalogCover(false);
                            });
                          }).catch(() => setIsUploadingCatalogCover(false));
                        }} />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" className="bg-royal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-royal-800 transition-colors">
                          Salvar Produto
                        </button>
                        <button type="button" onClick={() => setIsAddingCatalog(false)} className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {featuredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featuredProducts.map((item) => (
                      <div key={item.id} className="bg-white border rounded-xl overflow-hidden group text-center">
                        <div className="aspect-square bg-slate-100 overflow-hidden relative">
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleDeleteFeaturedProduct(item.id)}
                              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors mb-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-bold text-slate-800">{item.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">Nenhum produto destacado.</p>
                  </div>
                )}
              </div>
            </div>
          ) : activeTab === 'blog' ? (
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
                    <h3 className="font-bold text-slate-900 mb-4">{editingPostId ? 'Editar Artigo' : 'Novo Artigo'}</h3>
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
                          {editingPostId ? 'Salvar Alterações' : 'Publicar Artigo'}
                        </button>
                        <button type="button" onClick={resetBlogForm} className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50">
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
                      <div className="flex gap-2">
                        <button onClick={() => handleEditPost(post)} className="bg-slate-50 text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors" title="Editar Artigo">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeletePost(post.id)} className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-colors" title="Remover Artigo">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Imagens do Produto</label>
                        <p className="text-xs text-slate-500 mb-2">Você pode selecionar várias imagens. Tamanho ideal recomendado: <strong>800 x 800 pixels</strong> (Formato Quadrado 1:1).</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => multiFileInputRef.current?.click()}
                            disabled={isUploadingMultiImages}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingMultiImages ? 'Enviando...' : 'Fazer Upload (Múltiplas)'}
                          </button>
                          <input 
                            type="url" 
                            value={newImage}
                            onChange={(e) => {
                                setNewImage(e.target.value);
                                if (e.target.value) {
                                  setNewProductImages(prev => [...prev, e.target.value]);
                                  setNewImage(''); // clear input after adding
                                }
                            }}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                            placeholder="Ou cole a URL da imagem aqui"
                          />
                        </div>
                        {newProductImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {newProductImages.map((imgUrl, index) => (
                              <div key={index} className="relative group">
                                <img src={imgUrl} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded-lg border border-slate-200" />
                                <button
                                  type="button"
                                  onClick={() => setNewProductImages(prev => prev.filter((_, i) => i !== index))}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        <input type="file" multiple accept="image/*" className="hidden" ref={multiFileInputRef} onChange={handleMultiImageUpload} />
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

              {/* SECTION: CATÁLOGOS */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900">Catálogos da Fábrica ({catalogs.length})</h3>
                  {!isAddingCatalog && (
                    <button 
                      onClick={() => setIsAddingCatalog(true)}
                      className="text-sm font-medium text-royal-700 hover:text-royal-800 flex items-center gap-1"
                    >
                      <Upload className="w-4 h-4" /> Adicionar Catálogo
                    </button>
                  )}
                </div>

                {isAddingCatalog && (
                  <form onSubmit={handleAddCatalog} className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                    <h4 className="font-bold text-slate-900 mb-4">Novo Catálogo</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título do Catálogo</label>
                        <input 
                          type="text" 
                          required
                          value={newCatalogTitle}
                          onChange={(e) => setNewCatalogTitle(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                          placeholder="Ex: Catálogo 2024"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Arquivo do Catálogo (Upload de PDF ou Imagem)</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => catalogInputRef.current?.click()}
                            disabled={isUploadingCatalog}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingCatalog ? 'Enviando...' : 'Fazer Upload'}
                          </button>
                          <input 
                            type="url" 
                            required
                            value={newCatalogFile}
                            onChange={(e) => setNewCatalogFile(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                            placeholder="Ou cole a URL do arquivo aqui"
                          />
                        </div>
                        <input type="file" accept="application/pdf,image/*" className="hidden" ref={catalogInputRef} onChange={handleCatalogUpload} />
                        {newCatalogFile && <p className="text-sm text-green-600 mt-2">✓ Arquivo carregado</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Foto de Capa do Catálogo (Opcional)</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => catalogCoverInputRef.current?.click()}
                            disabled={isUploadingCatalogCover}
                            className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200 flex-shrink-0 disabled:opacity-50"
                          >
                            {isUploadingCatalogCover ? 'Enviando...' : 'Fazer Upload de Foto'}
                          </button>
                          <input 
                            type="url" 
                            value={newCatalogCover}
                            onChange={(e) => setNewCatalogCover(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-royal-500 focus:border-royal-500"
                            placeholder="URL da imagem (opcional)"
                          />
                        </div>
                        <input type="file" accept="image/*" className="hidden" ref={catalogCoverInputRef} onChange={handleCatalogCoverUpload} />
                        {newCatalogCover && (
                          <div className="mt-2">
                             <img src={newCatalogCover} alt="Capa" className="h-16 w-auto object-cover rounded shadow" />
                             <p className="text-sm text-green-600 mt-1">✓ Capa carregada</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="submit"
                          className="bg-royal-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-royal-800 transition-colors"
                        >
                          Salvar Catálogo
                        </button>
                        <button 
                          type="button"
                          onClick={() => setIsAddingCatalog(false)}
                          className="bg-white text-slate-700 border border-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {catalogs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catalogs.map((catalog) => (
                      <div key={catalog.id} className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {catalog.coverImageUrl ? (
                            <img src={catalog.coverImageUrl} alt="Capa" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                          ) : (
                            <div className="w-10 h-10 bg-royal-50 text-royal-700 rounded-lg flex items-center justify-center shrink-0">
                              {catalog.fileUrl?.includes('.pdf') ? <i className="text-xs font-bold">PDF</i> : <ImageIcon className="w-5 h-5" />}
                            </div>
                          )}
                          <div>
                            <h5 className="font-bold text-slate-800 truncate">{catalog.title}</h5>
                            <a href={catalog.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-royal-600 hover:underline">Ver arquivo</a>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteCatalog(catalog.id)}
                          className="text-slate-400 hover:text-red-500 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">Nenhum catálogo disponível para esta marca.</p>
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

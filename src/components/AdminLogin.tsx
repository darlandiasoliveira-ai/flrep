import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AdminLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === 'darlandiasoliveira@gmail.com') {
           navigate('/admin');
        } else {
           setError('Acesso negado. Usuário sem permissões de administrador.');
           auth.signOut();
           setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'darlandiasoliveira@gmail.com') {
         setError('Acesso negado. Usuário não é o administrador cadastrado.');
         await auth.signOut();
      } else {
         navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-royal-700">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-royal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Acesso Restrito
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Painel de administração FL Representações
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100 text-center">
            
            <p className="mb-6 text-slate-600">
              Acesse com a sua conta Google autorizada, para gerenciar o catálogo.
            </p>

            {error && (
              <div className="text-red-500 text-sm text-center font-medium mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full flex justify-center py-3 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-royal-700 hover:bg-royal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Entrar com Google
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

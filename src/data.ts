import { Bed, Utensils, Monitor, Sofa, Armchair, Box } from 'lucide-react';

export const products = [
  { id: 1, title: 'Dormitórios & Roupeiros', description: 'Linha completa de móveis para quartos, desde roupeiros tradicionais a closets modulados com foco em aproveitamento de espaço.', icon: Bed },
  { id: 2, title: 'Cozinhas Planejadas', description: 'Soluções inteligentes para cozinhas, unindo design moderno, alta durabilidade e ergonomia nas atividades diárias.', icon: Utensils },
  { id: 3, title: 'Racks e Estantes', description: 'Painéis, racks, bancadas e estantes desenhados para otimizar e embelezar as modernas salas de estar.', icon: Monitor },
  { id: 4, title: 'Salas e Estofados', description: 'Sofás, poltronas, mesas e cadeiras com rígido padrão construtivo e o mais alto nível de conforto no acabamento.', icon: Sofa }
];

export const brands = [
  { 
    id: 1, 
    slug: 'moval',
    name: 'Moval', 
    specialty: 'A marca do móvel', 
    logo: '/logo-moval.png',
    products: [] 
  },
  { 
    id: 2, 
    slug: 'bm-tubulares',
    name: 'BM Tubulares', 
    specialty: 'Móveis tubulares', 
    logo: '/logo-bm.png',
    products: [] 
  },
  { 
    id: 3, 
    slug: 'bertolini',
    name: 'Bertolini', 
    specialty: 'Móveis de Aço', 
    logo: '/logo-bertolini.png',
    products: [] 
  },
  { 
    id: 4, 
    slug: 'rimo',
    name: 'Rimo', 
    specialty: 'Seu sonho, sua casa', 
    logo: '/logo-rimo.png',
    products: [] 
  },
  { 
    id: 5, 
    slug: 'houston',
    name: 'Houston', 
    specialty: 'Bicicletas', 
    logo: '/logo-houston.png',
    products: [] 
  }
];

export const blogPosts = [
  { id: 1, title: 'Tendências em Cozinhas Moduladas para o Próximo Ano', date: '10 Junho 2026', excerpt: 'Descubra como os novos laminados e ferragens de toque estão dominando os novos modelos.' },
  { id: 2, title: 'Visual Merchandising: Como expor Racks na sua loja', date: '25 Maio 2026', excerpt: 'Um guia completo para aumentar a conversão ambientando peças em espaços compactos no showroom.' },
  { id: 3, title: 'Crescimento da busca por Roupeiros inteligentes', date: '05 Maio 2026', excerpt: 'Entenda os benefícios das divisórias otimizadas e luzes de LED embutidas nos projetos.' }
];

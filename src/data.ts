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
    specialty: 'Dormitórios', 
    logo: '/logo-moval.png',
    regions: 'Sergipe e Alagoas',
    products: [] 
  },
  { 
    id: 2, 
    slug: 'bm',
    name: 'BM', 
    specialty: 'Móveis tubulares', 
    logo: '/logo-bm.png',
    regions: 'Sergipe e Alagoas',
    products: [] 
  },
  { 
    id: 3, 
    slug: 'houston',
    name: 'Houston', 
    specialty: 'Bicicletas', 
    logo: '/logo-houston.png',
    regions: 'Sergipe e Alagoas',
    products: [] 
  },
  { 
    id: 4, 
    slug: 'philco',
    name: 'Philco', 
    specialty: 'Eletrodomésticos', 
    logo: '/logo-philco.png',
    regions: 'Sergipe e Alagoas',
    products: [] 
  },
  { 
    id: 5, 
    slug: 'britania',
    name: 'Britânia', 
    specialty: 'Eletroportáteis', 
    logo: '/logo-britania.jpg',
    regions: 'Sergipe e Alagoas',
    products: [] 
  },
  { 
    id: 6, 
    slug: 'kits-parana',
    name: 'Kits Paraná', 
    specialty: 'Cozinhas', 
    logo: '/logo-kits-parana.jpg',
    regions: 'Somente Alagoas',
    products: [] 
  },
  { 
    id: 7, 
    slug: 'rimo',
    name: 'Rimo', 
    specialty: 'Dormitórios em MDF', 
    logo: '/logo-rimo.png',
    regions: 'Somente Alagoas',
    products: [] 
  },
  { 
    id: 8, 
    slug: 'kappesberg',
    name: 'Kappesberg', 
    specialty: 'Sala de Estar', 
    logo: '/logo-kappesberg.png',
    regions: 'Somente Alagoas',
    products: [] 
  }
];

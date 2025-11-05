// Sistema avançado de imagens únicas para cada produto
export const getProductImage = (product: { codigo: string; nome: string; categoria: string; info: string }): string => {
  const { codigo, nome, categoria, info } = product;
  const nomeUpper = nome.toUpperCase();
  const infoUpper = info.toUpperCase();
  
  // Gerar um hash simples baseado no código do produto para consistência
  const generateHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  // Pool de imagens por categoria e tipo de produto
  const imagePool = {
    // FERRAGENS
    ferramentas: [
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    parafusos: [
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    fechaduras: [
      'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    discos: [
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    
    // PLOMERIA
    torneiras: [
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    tubos: [
      'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    conexoes: [
      'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    
    // ELÉTRICA
    cabos: [
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    tomadas: [
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    adaptadores: [
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    
    // BAZAR
    cozinha: [
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    limpeza: [
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    costura: [
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    higiene: [
      'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400'
    ]
  };

  // Função para selecionar imagem baseada no tipo de produto
  const selectImageFromPool = (pool: string[]): string => {
    const hash = generateHash(codigo + nome);
    return pool[hash % pool.length];
  };

  // Classificação por categoria e tipo específico
  switch (categoria) {
    case 'Ferreteria':
      // Ferramentas específicas
      if (nomeUpper.includes('DESTORNILLADOR') || nomeUpper.includes('CHAVE')) {
        return selectImageFromPool(imagePool.ferramentas);
      }
      // Discos de corte e lixas
      if (nomeUpper.includes('DISCO') || nomeUpper.includes('LIJA')) {
        return selectImageFromPool(imagePool.discos);
      }
      // Parafusos, pregos, tarugos
      if (nomeUpper.includes('TORNILLO') || nomeUpper.includes('CLAVO') || nomeUpper.includes('TARUGO') || nomeUpper.includes('KIT TORN')) {
        return selectImageFromPool(imagePool.parafusos);
      }
      // Fechaduras, cadeados, bisagras
      if (nomeUpper.includes('CANDADO') || nomeUpper.includes('CERRADURA') || nomeUpper.includes('BISAGRA') || nomeUpper.includes('PASSADOR')) {
        return selectImageFromPool(imagePool.fechaduras);
      }
      // Pitons e ganchos
      if (nomeUpper.includes('PITON') || nomeUpper.includes('GRAMPA')) {
        return selectImageFromPool(imagePool.parafusos);
      }
      // Guantes e EPIs
      if (nomeUpper.includes('GUANTE')) {
        return selectImageFromPool(imagePool.ferramentas);
      }
      // Válvulas
      if (nomeUpper.includes('VALVULA')) {
        return selectImageFromPool(imagePool.tubos);
      }
      // Cola e adesivos
      if (nomeUpper.includes('COLA')) {
        return selectImageFromPool(imagePool.ferramentas);
      }
      return selectImageFromPool(imagePool.ferramentas);

    case 'Plomeria':
      // Torneiras e canillas
      if (nomeUpper.includes('CANILLA') || nomeUpper.includes('GRIF') || nomeUpper.includes('LLAVE VALVE')) {
        return selectImageFromPool(imagePool.torneiras);
      }
      // Uniões, codos, T
      if (nomeUpper.includes('UNIÓN') || nomeUpper.includes('CODO') || nomeUpper.includes('"T"')) {
        return selectImageFromPool(imagePool.conexoes);
      }
      // Tampões e reduções
      if (nomeUpper.includes('TAPON') || nomeUpper.includes('REDUTOR')) {
        return selectImageFromPool(imagePool.conexoes);
      }
      // Alma e roscas
      if (nomeUpper.includes('ALMA') || nomeUpper.includes('ROSCA')) {
        return selectImageFromPool(imagePool.tubos);
      }
      // Boquillas e acessórios de jardim
      if (nomeUpper.includes('BOQUILLA') || nomeUpper.includes('LANZARRIEGO')) {
        return selectImageFromPool(imagePool.torneiras);
      }
      // Acoples e uniões para mangueira
      if (nomeUpper.includes('ACOPLE') || nomeUpper.includes('MANGUERA')) {
        return selectImageFromPool(imagePool.conexoes);
      }
      // Abrazaderas
      if (nomeUpper.includes('ABRAZADERA')) {
        return selectImageFromPool(imagePool.tubos);
      }
      // Cinta teflon e adesivos
      if (nomeUpper.includes('CINTA') || nomeUpper.includes('ADHESIVO')) {
        return selectImageFromPool(imagePool.conexoes);
      }
      // Rejillas e conexões flexíveis
      if (nomeUpper.includes('REJILLA') || nomeUpper.includes('FLEXIBLE')) {
        return selectImageFromPool(imagePool.tubos);
      }
      return selectImageFromPool(imagePool.tubos);

    case 'Elétrica':
      // Adaptadores e fichas
      if (nomeUpper.includes('ADAPTADOR') || nomeUpper.includes('FICHA') || nomeUpper.includes('ENCHUFE')) {
        return selectImageFromPool(imagePool.adaptadores);
      }
      // Tomadas e interruptores
      if (nomeUpper.includes('TOMA') || (nomeUpper.includes('LLAVE') && !nomeUpper.includes('BUSCA'))) {
        return selectImageFromPool(imagePool.tomadas);
      }
      // Placas e coberturas
      if (nomeUpper.includes('PLACA') || nomeUpper.includes('CUBRE') || nomeUpper.includes('PICO')) {
        return selectImageFromPool(imagePool.tomadas);
      }
      // Porta lâmpadas
      if (nomeUpper.includes('PORTA') && nomeUpper.includes('LÁMPARA')) {
        return selectImageFromPool(imagePool.adaptadores);
      }
      // Cabos e prolongadores
      if (nomeUpper.includes('CABLE') || nomeUpper.includes('PROLONGADOR')) {
        return selectImageFromPool(imagePool.cabos);
      }
      // Conectores
      if (nomeUpper.includes('CONECTOR')) {
        return selectImageFromPool(imagePool.adaptadores);
      }
      // Testador de polo
      if (nomeUpper.includes('BUSCA') && nomeUpper.includes('POLO')) {
        return selectImageFromPool(imagePool.cabos);
      }
      // Cinta aislante
      if (nomeUpper.includes('CINTA') && nomeUpper.includes('AISLANTE')) {
        return selectImageFromPool(imagePool.cabos);
      }
      // Abrazaderas elétricas
      if (nomeUpper.includes('ABRAZADERA')) {
        return selectImageFromPool(imagePool.cabos);
      }
      return selectImageFromPool(imagePool.cabos);

    case 'Bazar':
      // Utensílios de cozinha
      if (nomeUpper.includes('COLADOR') || nomeUpper.includes('BOMBILLA') || nomeUpper.includes('ABRIDOR') || 
          nomeUpper.includes('PELADOR') || nomeUpper.includes('GOMA P/TAPA OLLA')) {
        return selectImageFromPool(imagePool.cozinha);
      }
      // Produtos de limpeza e organização
      if (nomeUpper.includes('GANCHO') || (nomeUpper.includes('PINZAS') && nomeUpper.includes('ROPA')) || 
          nomeUpper.includes('TENDEDERO') || nomeUpper.includes('GOMA DE EQUIPAGEM') || nomeUpper.includes('JABONERA')) {
        return selectImageFromPool(imagePool.limpeza);
      }
      // Produtos de higiene pessoal
      if (nomeUpper.includes('CORTA UÑAS') || nomeUpper.includes('TEJERA') || 
          (nomeUpper.includes('PINZAS') && nomeUpper.includes('CEJAS')) || nomeUpper.includes('LIJA P/UÑA') || 
          nomeUpper.includes('LIJA P/PIES')) {
        return selectImageFromPool(imagePool.higiene);
      }
      // Produtos para cabelo
      if (nomeUpper.includes('PEINE') || (nomeUpper.includes('GOMA') && nomeUpper.includes('CABELLO')) || 
          (nomeUpper.includes('PINZA') && nomeUpper.includes('PELO')) || nomeUpper.includes('ALFILER')) {
        return selectImageFromPool(imagePool.higiene);
      }
      // Costura
      if (nomeUpper.includes('AGUJA') || nomeUpper.includes('HILO') || nomeUpper.includes('TIJERA') || 
          nomeUpper.includes('BOTÓN') || nomeUpper.includes('CINTA MÉTRICA') || nomeUpper.includes('GOMA ELASTICA')) {
        return selectImageFromPool(imagePool.costura);
      }
      // Produtos de proteção e chuva
      if (nomeUpper.includes('GORRO') || (nomeUpper.includes('CAPA') && nomeUpper.includes('LLUVIA')) || 
          nomeUpper.includes('SONBRINHA') || nomeUpper.includes('CHALECO') || nomeUpper.includes('REDE P/CASCO')) {
        return selectImageFromPool(imagePool.limpeza);
      }
      // Jogos e entretenimento
      if (nomeUpper.includes('BARAJA')) {
        return selectImageFromPool(imagePool.cozinha);
      }
      return selectImageFromPool(imagePool.cozinha);

    default:
      return selectImageFromPool(imagePool.ferramentas);
  }
};

// Função para obter imagem de fallback por categoria
export const getCategoryFallbackImage = (categoria: string): string => {
  const categoryImages: Record<string, string> = {
    'Ferreteria': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Plomeria': 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Elétrica': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    'Bazar': 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400'
  };
  
  return categoryImages[categoria] || 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=400';
};
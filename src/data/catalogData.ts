import { Product, ProductCategory } from '../types/Product';

// CSV data as string
const csvData = `Código;Nome;Info;Quantidade;Código de Barra;Categoria
Cód. B186;COLADOR PLÁSTICO;7CM;1 Unid.;1860001007892;Bazar
Cód. B188;BOMBILLA LISA INOX;C04 19CM;1 Unid.;1881701004561;Bazar
Cód. B190;GOMA P/TAPA OLLA PRECION;5, 7 Y 10L;1 Unid.;1905710011232;Bazar
Cód. B193;ABRIDOR;3 EM 1;1 Unid.;1933101001234;Bazar
Cód. B194;PELADOR DE PAPAS;PLASTICO;1 Unid.;1940001004562;Bazar
Cód. B196;GANCHO PLASTICO;GOGADOR;3 Unid.;1960003001239;Bazar
Cód. B197;PINZAS P/ ROPA;MADERA;12 Unid.;1970010004567;Bazar
Cód. B198;TENDEDERO PIOLIN NYLON;20MT;1 Unid.;1981501007899;Bazar
Cód. B199;GOMA DE EQUIPAGEM;2MT;1 Unid.;1991501001230;Bazar
Cód. B201;CORTA UÑAS;AÇO INOXIDÁVEL;1 Unid.;2010001007890;Bazar
Cód. B202;TEJERA MANICURE;40X80;1 Unid.;2020001001231;Bazar
Cód. B203;PINZAS P/CEJAS;AÇO INOXIDÁVEL;1 Unid.;2030001004569;Bazar
Cód. B204;LIJA P/UÑA MINI;24X1;4 Unid.;2040004007894;Bazar
Cód. B205;LIJA P/PIES;PIEDRA;1 Unid.;2050001001238;Bazar
Cód. B206;PEINE DE BOLSILLO COLOR;PLASTICO;2 Unid.;2060002004565;Bazar
Cód. B207;PEINE DOBLABLE;PLASTICO;1 Unid.;2070001007894;Bazar
Cód. B208;PEINE FINO;PLASTICO;1 Unid.;2080001001235;Bazar
Cód. B209;GOMA PARA CABELLO ;AGOGO;6 Unid.;2090006004568;Bazar
Cód. B210;PINZA PARA PELO / PIRANA;PLASTICO;2 Unid.;2100002007897;Bazar
Cód. B211;ALFILER / PRENDEDOR;METAL;40 Unid.;2110030001231;Bazar
Cód. B212;BOTÓN ;POLIÉSTER;30 Unid.;2120020004562;Bazar
Cód. B213;CINTA MÉTRICA;150CM;1 Unid.;2130001007895;Bazar
Cód. B214;GOMA ELASTICA P/ROPA;75CM;2 Unid.;2147502001239;Bazar
Cód. B215;KIT AGUJA;COSER;1 Unid.;2150001004564;Bazar
Cód. B216;HILO DE COSER;BLACO Y NEGRO;2 Unid.;2160003007890;Bazar
Cód. B217;TIJERA P/TELA;PQ.;1 Unid.;2170001001233;Bazar
Cód. B219;GORRO PLASTICO;60x1;3 Unid.;2190006004565;Bazar
Cód. B220;JABONERA;72x1;1 Unid.;2200007007899;Bazar
Cód. B227;BARAJA ESPANOL;8.5X12,30M;1 Unid.;2270005001236;Bazar
Cód. B228;PINZAS P/CEJAS;METAL;1 Unid.;2280006004563;Bazar
Cód. B236;CAPA SACO DE LLUVIA;PLASTICO;1 Unid.;2366599447120;Bazar
Cód. B237;CAPA DE LLUVIA ADULTO COL.;C/BOTON;1 Unid.;2371535889469;Bazar
Cód. B238;CAPA DE LLUVIA INF. COL. ;C/BOTON;1 Unid.;2384006497544;Bazar
Cód. B239;SONBRINHA PRETA ;(JC304);1 Unid.;2390365597412;Bazar
Cód. B240;SONBRINHA COLORIDA ;(JC403);1 Unid.;2408754711636;Bazar
Cód. B241;CHALECO CINTA REFLECTIVA;AJUSTABLE;1 Unid.;2414511876005;Bazar
Cód. B242;CHALECO P/MOTOQUERO NARANJA ;C/VELCO;1 Unid.;2426231985875;Bazar
Cód. B243;CHALECO PARA MOTOQUERO ;C/ZIPER;1 Unid.;2433568415999;Bazar
Cód. B244;REDE P/CASCO;35X35CM;1 Unid.;2440259159360;Bazar
Cód. E160;FIXA ADAPTADOR TRIPLE COLORIDO;10/20A;1 Unid.;1601020010780;Elétrica
Cód. E161;FIXA ADAPTADOR MULTIPLE;10A;1 Unid.;1611001001232;Elétrica
Cód. E162;FIXA ADAPTADOR BOB ESPONJA;10A/20A;1 Unid.;1621020014564;Elétrica
Cód. E163;FIXA ENCHUFE MACHO;10A;1 Unid.;1631001007898;Elétrica
Cód. E164;FIXA ENCHUFE HEMBRA;10A;1 Unid.;1641001001239;Elétrica
Cód. E165;TOMA SIMPLES EXTERNA;CREMA 15A;1 Unid.;1651001004567;Elétrica
Cód. E166;LLAVE EXTERNO 1 PONTO;CREMA;1 Unid.;1660601007892;Elétrica
Cód. E168;PICO TOMA SIMPLES;BLANCO 15A;1 Unid.;1681501004569;Elétrica
Cód. E169;PICO TOMA COMPUTADORA;15A;1 Unid.;1691501007897;Elétrica
Cód. E170;PICO LLAVE PUNTO;SIMPLES;1 Unid.;1701501001235;Elétrica
Cód. E171;PICO CIEGO BELGE;...;2 Unid.;1710002004560;Elétrica
Cód. E172;PLACA TRES MÓDULO 12X8;BLANCO;1 Unid.;1721280107898;Elétrica
Cód. E173;CUBRE TOMA RONDA;...;2 Unid.;1730002001239;Elétrica
Cód. E174;PORTA LÁMPARA DE;CERAMICA;1 Unid.;1740001004568;Elétrica
Cód. E175;PORTA LÁMPARA SIMPLES;NEGRA;1 Unid.;1750001007896;Elétrica
Cód. E176;PORTA LAMPADA BASE DISCO;...;1 Unid.;1760001001237;Elétrica
Cód. E178;CABLE PROLONGADOR DE TENSIÓN;2.5MT;1 Unid.;1782501007892;Elétrica
Cód. E218;CABLE PROLONGADOR DE TENSIÓN;5MT;1 Unid.;2180501001237;Elétrica
Cód. E179;CABLE DE ALIMENTACION;...;1 Unid.;1790001004563;Elétrica
Cód. E180;CONECTOR PLASTICO TIRABOMERA;4MM 6POLO;1 Unid.;1800301007895;Elétrica
Cód. E181;LLAVE BUSCA POLO / DESTOR;...;1 Unid.;1810001001239;Elétrica
Cód. E182;CINTA AISLANTE PRETA;5MT NEGRA;1 Unid.;1820501004562;Elétrica
Cód. E183;ABRAZADERA;3.6X150MM;50 Unid.;1833615050783;Elétrica
Cód. E252;FICHA ADAPTARORA;UNIVERSAL DE VIAJEN;1 Unid.;2523365159988;Elétrica
Cód. F101;TORNILLO CHIBORARD CAB. CHATA;4.0X16;30 Unid.;1014016301234;Ferreteria
Cód. F102;TORNILLO CHIBORARD CAB. CHATA;4.0X25;20 Unid.;1024025202347;Ferreteria
Cód. F103;TORNILLO CHIBORARD CAB. CHATA;4.0X40;12 Unid.;1034040123459;Ferreteria
Cód. F104;TORNILLO CHIBORARD CAB. CHATA;5.0X45;10 Unid.;1045045104565;Ferreteria
Cód. F105;TORNILLO CHIBORARD CAB. CHATA;6.0X50;4 Unid.;1056050047891;Ferreteria
Cód. F106;TARUGO ;6MM;12 Unid.;1066612001230;Ferreteria
Cód. F107;TARUGO ;8MM;8 Unid.;1078808004567;Ferreteria
Cód. F108;TARUGO ;10MM C/TOP;4 Unid.;1081010087891;Ferreteria
Cód. F109;KIT TORN. CHIPB. CAB. CHATA;4.0X40 C/BUJA 6;6 Unid.;1094040661238;Ferreteria
Cód. F110;KIT TORN. CHIPB. CAB. CHATA;5.0X45 C/BUJA 8;4 Unid.;1105045844561;Ferreteria
Cód. F111;KIT TORN. CHIPB. CAB. CHATA;6.0X50 C/BUJA 10;3 Unid.;1116050103789;Ferreteria
Cód. F112;PITON ABIERTO;4.4X67 C/BUJA 8;2 Unid.;1124467821233;Ferreteria
Cód. F113;PITON CERRADO;5.5X67 C/BUJA 10;2 Unid.;1134567824560;Ferreteria
Cód. F114;"PITON ""L""";3.4X57 C/BUJA 6;4 Unid.;1143457647899;Ferreteria
Cód. F115;TORNILLO AUTOPERFURANTE;4.2X13;10 Unid.;1154213101234;Ferreteria
Cód. F116;TORNILLO AUTOPERFURANTE;4.2X18;10 Unid.;1164218104567;Ferreteria
Cód. F117;TORNILLO AUTOPERFURANTE;4.2X25 ;10 Unid.;1174225107895;Ferreteria
Cód. F118;CLAVO C/CABEZA;12X12/60G;100 Unid.;1181212601236;Ferreteria
Cód. F119;CLAVO C/CABEZA;15X15/100G;100 Unid.;1191515100459;Ferreteria
Cód. F120;CLAVO C/CABEZA;17X21/100G;30 Unid.;1201721104674;Ferreteria
Cód. F121;GRAMPA CABLE;ABERTURA DE 8MM;25 Unid.;1210825000898;Ferreteria
Cód. F122;GRAMPA CABLE COAXIAL;ABERTURA DE 8MM;25 Unid.;1220825001238;Ferreteria
Cód. F123;BISAGRA REFORZADA;1.1/2;2 Unid.;1232112024561;Ferreteria
Cód. F124;BISAGRA REFORZADA;2 FURO;2 Unid.;1242020207895;Ferreteria
Cód. F125;BISAGRA REFORZADA;3 FURO;2 Unid.;1253302001230;Ferreteria
Cód. F126;PASSADOR MARIPOZA;1.1/2;1 Unid.;1261120104569;Ferreteria
Cód. F128;CANDADO HONGDA;25 MM;1 Unid.;1282501001239;Ferreteria
Cód. F129;CANDADO HONGDA;30 MM;1 Unid.;1293001004569;Ferreteria
Cód. F130;CANDADO HONGDA;40 MM;1 Unid.;1304001007891;Ferreteria
Cód. F223;"PITON ""L"" GALV.";5.0X60 C/BUJA 8;2 Unid.;2230001007892;Ferreteria
Cód. F224;PITON ABIERTO GALV.;P/BUJA 6;5 Unid.;2240002001232;Ferreteria
Cód. F225;PITON ABIERTO GALV.;P/BUJA 8;4 Unid.;2250003004569;Ferreteria
Cód. F226;PITON ABIERTO GALV.;C/BUJA 10 P/REDE;2 Unid.;2260004007896;Ferreteria
Cód. F231;DESTORNILLADOR PUNTA DOBLE;XXXX;1 Unid.;2310009004564;Ferreteria
Cód. F232;DISCO DE CORTE;115X3 2X22.2 MASTER;1 Unid.;2320001007890;Ferreteria
Cód. F233;DISCO DE LIJA;GR.36 ALO-4.1/2;1 Unid.;2330002001230;Ferreteria
Cód. F235;COLA ALMASUPER;20G;1 Unid.;2350004008914;Ferreteria
Cód. F245;GUANTES GOMA ;P/TRABAJO;1 Unid.;2450013589517;Ferreteria
Cód. F246;GUANTE ALGODÓN ;P/TRABAJO;1 Unid.;2461135766540;Ferreteria
Cód. F248;CERRADURA PARA MUEBLE ;GABINETE MADERA;1 Unid.;2488151300473;Ferreteria
Cód. F249;CERRADURA PARA MUEBLE ;CAJÓN MADERA;1 Unid.;2497785115933;Ferreteria
Cód. F250;VALVULA P/GAS S/MANGUERA;10KG;1 Unid.;2500351195465;Ferreteria
Cód. F251;VALVULA P/GAS C/MANGUERA;13KG;1 Unid.;2513369985850;Ferreteria
Cód. P131;UNIÓN SOLDABLE;20MM;1 Unid.;1312001000125;Plomeria
Cód. P132;UNIÓN SOLDABLE;25MM;1 Unid.;1322501000457;Plomeria
Cód. P133;UNIÓN CODO SOLDABLE;90° 20MM;1 Unid.;1339020017897;Plomeria
Cód. P134;UNIÓN CODO SOLDABLE;90° 25MM;1 Unid.;1349025011233;Plomeria
Cód. P135;"UNIÓN ""T""  SOLDABLE";20MM;1 Unid.;1352001004563;Plomeria
Cód. P136;"UNIÓN ""T""  SOLDABLE";25MM;1 Unid.;1362501007896;Plomeria
Cód. P138;ALMA DOBLE ROSCA;1/2;1 Unid.;1382001004560;Plomeria
Cód. P139;ALMA DOBLE ROSCA;3/4;1 Unid.;1392501007893;Plomeria
Cód. P140;GRIF LLAVE VALVE PLASTICA;25MM;1 Unid.;1402501001231;Plomeria
Cód. P141;TAPON HEMBRA SOLDABLE;20MM;1 Unid.;1412004004561;Plomeria
Cód. P142;TAPON HEMBRA SOLDABLE;25MM;1 Unid.;1422501007897;Plomeria
Cód. P143;TAPON MACHO ROSCABLE;20MM;1 Unid.;1432001001233;Plomeria
Cód. P144;TAPON MACHO ROSCABLE;25MM;1 Unid.;1442501004566;Plomeria
Cód. P146;REJILLA 10X10;CUADRADO BLANCO;1 Unid.;1461010011230;Plomeria
Cód. P147;GRIF CANILLA LAVATORIO PLAST.;BLANCA 3/4;1 Unid.;1472501004563;Plomeria
Cód. P148;GRIF CANILLA PLAST.;3/4 10CM BLANCA;1 Unid.;1482501007891;Plomeria
Cód. P149;GRIF CANILLA PLASTICA;3/4 NEGRA;1 Unid.;1492501001232;Plomeria
Cód. P150;CONEXIÓN FLEXIBLE PLASTICA;40CM;1 Unid.;1504001004566;Plomeria
Cód. P151;BOQUILLA LANZARRIEGO;FAMASTIL;1 Unid.;1510001007896;Plomeria
Cód. P152;ACOPLE RAPIDO;1/2 P/MANGUERA;1 Unid.;1520001001237;Plomeria
Cód. P153;UNIÓN P/MANGUERA;1/2;1 Unid.;1530001004565;Plomeria
Cód. P155;ABRAZADERA METAL;"3/4""";2 Unid.;1553402001230;Plomeria
Cód. P156;ABRAZADERA METAL;1/2;2 Unid.;1561120204567;Plomeria
Cód. P157;ABRAZADERA GRAMPA;"TIPO U 3/4""";2 Unid.;1573402007896;Plomeria
Cód. P158;CINTA TEFLON;12X10M;1 Unid.;1580001001231;Plomeria
Cód. P159;ADHESIVO CANO PVC;17G TIGRE;1 Unid.;1591701004569;Plomeria
Cód. P221;REDUTOR COTO SOLDABLE;25X20MM;1 Unid.;2210008001239;Plomeria
Cód. P222;TAPON PlASTICO P/LAVABO;25MM;1 Unid.;2220009004566;Plomeria
Cód. P229;ADHESIVO CANO PVC;17G PISAFIX;1 Unid.;2290007007890;Plomeria
Cód. P230;CINTA TEFLON;12X10M VIQUA;1 Unid.;2300008001237;Plomeria
Cód. P234;BOQUILLA LANZARRIEGO;TRAMONTINA;1 Unid.;2340003004567;Plomeria
Cód. P247;KIT ACOPLE ;P/MANGUERA;1 Unid.;2476541225871;Plomeria`;

export const parseCSVData = (csvText: string): Product[] => {
  const lines = csvText.split('\n');
  const products: Product[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const columns = line.split(';');
      if (columns.length >= 6) {
        products.push({
          codigo: columns[0],
          nome: columns[1],
          info: columns[2],
          quantidade: columns[3],
          codigoBarra: columns[4],
          categoria: columns[5]
        });
      }
    }
  }
  
  return products;
};

export const getAllProducts = (): Product[] => {
  return parseCSVData(csvData);
};

export const getProductCategories = (): ProductCategory[] => {
  const products = getAllProducts();
  const categoryMap = new Map<string, number>();
  
  products.forEach(product => {
    const category = product.categoria;
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  });

  const categories: ProductCategory[] = [
    {
      id: 'all',
      name: 'all',
      displayName: 'Todos los Productos',
      count: products.length,
      description: 'Visualiza todos los productos disponibles',
      image: 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const categoryImages: Record<string, string> = {
    'Bazar': 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Elétrica': 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Ferreteria': 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Plomeria': 'https://images.pexels.com/photos/8293641/pexels-photo-8293641.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  const categoryDescriptions: Record<string, string> = {
    'Bazar': 'Utensilios domésticos, productos de limpieza y artículos para el día a día',
    'Elétrica': 'Materiales eléctricos, cables, tomacorrientes y componentes electrónicos',
    'Ferreteria': 'Herramientas, tornillos, clavos, cerraduras y materiales de construcción',
    'Plomeria': 'Tubos, conexiones, registros y materiales para instalaciones hidráulicas'
  };

  categoryMap.forEach((count, categoryName) => {
    categories.push({
      id: categoryName.toLowerCase(),
      name: categoryName,
      displayName: categoryName,
      count,
      description: categoryDescriptions[categoryName] || `Productos de la categoría ${categoryName}`,
      image: categoryImages[categoryName] || 'https://images.pexels.com/photos/5691641/pexels-photo-5691641.jpeg?auto=compress&cs=tinysrgb&w=600'
    });
  });

  return categories;
};
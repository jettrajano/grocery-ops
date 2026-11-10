const STORAGE_KEY = 'enxoval-em-conta.v1';
const LEGACY_STORAGE_KEY = 'precoclaro.v1.offers';
const HISTORY_DAYS = 90;
const DEFAULT_PRODUCTS = [
  { id: 'berco-inmetro', name: 'Berço certificado INMETRO', category: 'Quarto', priority: 'Alta', targetWeek: 15, responsible: 'Pai', preferredStore: 'Loja Especializada', referencePrice: 1200 },
  { id: 'colchao-berco', name: 'Colchão para Berço (Densidade 18)', category: 'Quarto', priority: 'Alta', targetWeek: 15, responsible: 'Pai', preferredStore: 'Loja de Colchões', referencePrice: 250 },
  { id: 'kit-berco-seguro', name: 'Kit Berço Seguro (Lençóis com elástico)', category: 'Quarto', priority: 'Alta', targetWeek: 20, responsible: 'Mãe', preferredStore: 'Internet', referencePrice: 200 },
  { id: 'banheira-suporte', name: 'Banheira com Suporte e Mangueira', category: 'Banho', priority: 'Alta', targetWeek: 22, responsible: 'Ambos', preferredStore: 'Internet', referencePrice: 280 },
  { id: 'carrinho-travel-system', name: 'Carrinho de Bebê (com travel system)', category: 'Passeio', priority: 'Alta', targetWeek: 16, responsible: 'Pai', preferredStore: 'Loja Física/Internet', referencePrice: 1800 },
  { id: 'bebe-conforto-isofix', name: 'Bebê Conforto + Base ISOFIX', category: 'Passeio', priority: 'Alta', targetWeek: 16, responsible: 'Pai', preferredStore: 'Loja Especializada', referencePrice: 1300 },
  { id: 'roupas-rn-p', name: 'Roupas RN e P (Bodies e Mijões)', category: 'Roupas', priority: 'Alta', targetWeek: 22, responsible: 'Mãe', preferredStore: 'Lojas de Departamento', referencePrice: 500 },
  { id: 'fraldas-rn', name: 'Fraldas Descartáveis RN (Estoque Inicial)', category: 'Higiene', priority: 'Alta', targetWeek: 25, responsible: 'Pai', preferredStore: 'Farmácia/Atacado', referencePrice: 200 },
  { id: 'kit-higiene', name: 'Kit Higiene (Algodão, hastes, álcool 70)', category: 'Higiene', priority: 'Alta', targetWeek: 25, responsible: 'Mãe', preferredStore: 'Farmácia', referencePrice: 150 },
  { id: 'garrafa-termica-potes', name: 'Garrafa Térmica e Potes para Trocador', category: 'Higiene', priority: 'Alta', targetWeek: 24, responsible: 'Ambos', preferredStore: 'Internet', referencePrice: 120 },
  { id: 'mala-maternidade-mae', name: 'Mala da Maternidade (Mãe)', category: 'Maternidade', priority: 'Alta', targetWeek: 30, responsible: 'Mãe', preferredStore: 'Internet', referencePrice: 300 },
  { id: 'mala-maternidade-bebe', name: 'Mala da Maternidade (Bebê)', category: 'Maternidade', priority: 'Alta', targetWeek: 30, responsible: 'Ambos', preferredStore: 'Internet', referencePrice: 250 },
  { id: 'sutia-amamentacao', name: 'Sutiãs de Amamentação e Absorventes', category: 'Maternidade', priority: 'Alta', targetWeek: 26, responsible: 'Mãe', preferredStore: 'Loja Especializada', referencePrice: 180 },
  { id: 'robo-aspirador-xiaomi', name: 'Robô Aspirador (Xiaomi Robot Vacuum X20 Max)', category: 'Casa/Automação', priority: 'Média', targetWeek: 18, responsible: 'Pai', preferredStore: 'Loja Oficial/Importação', referencePrice: 4500 },
  { id: 'poltrona-amamentacao', name: 'Poltrona de Amamentação', category: 'Quarto', priority: 'Média', targetWeek: 20, responsible: 'Ambos', preferredStore: 'Loja de Móveis', referencePrice: 1000 },
  { id: 'comoda-trocador', name: 'Cômoda / Trocador', category: 'Quarto', priority: 'Média', targetWeek: 15, responsible: 'Pai', preferredStore: 'Loja de Móveis', referencePrice: 850 },
  { id: 'kit-organizacao', name: 'Kit de Organização (Colmeias para Gavetas)', category: 'Quarto', priority: 'Média', targetWeek: 21, responsible: 'Mãe', preferredStore: 'Internet', referencePrice: 120 },
  { id: 'baba-eletronica', name: 'Babá Eletrônica com Câmera', category: 'Segurança', priority: 'Média', targetWeek: 24, responsible: 'Pai', preferredStore: 'Internet', referencePrice: 450 },
  { id: 'termometro-infravermelho', name: 'Termômetro Digital Infravermelho', category: 'Higiene', priority: 'Média', targetWeek: 24, responsible: 'Ambos', preferredStore: 'Farmácia', referencePrice: 130 },
  { id: 'toalhas-fralda', name: 'Toalhas Fralda (Alta absorção)', category: 'Banho', priority: 'Média', targetWeek: 22, responsible: 'Mãe', preferredStore: 'Internet', referencePrice: 180 },
  { id: 'bomba-eletrica', name: 'Bomba Extratora de Leite (Elétrica)', category: 'Alimentação', priority: 'Média', targetWeek: 28, responsible: 'Mãe', preferredStore: 'Farmácia/Internet', referencePrice: 350 },
  { id: 'almofada-amamentacao', name: 'Almofada de Amamentação', category: 'Alimentação', priority: 'Média', targetWeek: 24, responsible: 'Mãe', preferredStore: 'Internet', referencePrice: 120 },
  { id: 'roupas-m', name: 'Roupas Tamanho M', category: 'Roupas', priority: 'Média', targetWeek: 28, responsible: 'Mãe', preferredStore: 'Lojas de Departamento', referencePrice: 400 },
  { id: 'decoracao-quarto', name: 'Decoração do Quarto (Papel de parede, quadros)', category: 'Quarto', priority: 'Baixa', targetWeek: 21, responsible: 'Ambos', preferredStore: 'Internet', referencePrice: 600 },
  { id: 'extras-passeio', name: 'Itens Extras de Passeio (Bolsa térmica, etc)', category: 'Passeio', priority: 'Baixa', targetWeek: 32, responsible: 'Pai', preferredStore: 'Internet', referencePrice: 250 },
  { id: 'roupas-g', name: 'Roupas Tamanho G', category: 'Roupas', priority: 'Baixa', targetWeek: 34, responsible: 'Ambos', preferredStore: 'Lojas de Departamento', referencePrice: 300 },
  { id: 'tapete-atividades', name: 'Tapete de Atividades / Brinquedos Iniciais', category: 'Lazer', priority: 'Baixa', targetWeek: 35, responsible: 'Pai', preferredStore: 'Internet', referencePrice: 200 },
  { id: 'cadeira-alimentacao', name: 'Cadeira de Alimentação (Para 6 meses+)', category: 'Alimentação', priority: 'Baixa', targetWeek: 36, responsible: 'Pai', preferredStore: 'Internet', referencePrice: 450 },
];

const productGrid = document.querySelector('#productGrid');
const emptyState = document.querySelector('#emptyState');
const productDialog = document.querySelector('#productDialog');
const productForm = document.querySelector('#productForm');
const newProductNameInput = document.querySelector('#newProductNameInput');
const newProductCategoryInput = document.querySelector('#newProductCategoryInput');
const newProductPriorityInput = document.querySelector('#newProductPriorityInput');
const newProductWeekInput = document.querySelector('#newProductWeekInput');
const newProductResponsibleInput = document.querySelector('#newProductResponsibleInput');
const newProductStoreInput = document.querySelector('#newProductStoreInput');
const newProductLinkInput = document.querySelector('#newProductLinkInput');
const newProductReferenceInput = document.querySelector('#newProductReferenceInput');
const productFormError = document.querySelector('#productFormError');
const offerDialog = document.querySelector('#offerDialog');
const offerForm = document.querySelector('#offerForm');
const productInput = document.querySelector('#productInput');
const storeInput = document.querySelector('#storeInput');
const priceInput = document.querySelector('#priceInput');
const dateInput = document.querySelector('#dateInput');
const sourceInput = document.querySelector('#sourceInput');
const linkInput = document.querySelector('#linkInput');
const notesInput = document.querySelector('#notesInput');
const formError = document.querySelector('#formError');
const toast = document.querySelector('#toast');
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const moneyInputFormat = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
const palette = ['#27724e', '#8b6caa', '#c47850', '#4e7da4', '#bb5970', '#8b873e'];

let state = loadState();
let activeSummaryFilter = '';
let toastTimer;

const SUMMARY_FILTERS = {
  tracked: {
    button: '#filterTrackedButton',
    heading: 'Itens pesquisados',
    notice: 'Mostrando itens com pelo menos um preço registrado.',
    emptyTitle: 'Nenhum item pesquisado ainda',
    emptyDescription: 'Registre um preço para que o item apareça aqui.',
  },
  records: {
    button: '#filterRecordsButton',
    heading: 'Registros de preço',
    notice: 'Mostrando os itens pesquisados com o histórico de registros aberto.',
    emptyTitle: 'Nenhum registro de preço ainda',
    emptyDescription: 'Registre uma consulta para acompanhar preços nesta lista.',
  },
  belowTarget: {
    button: '#filterBelowTargetButton',
    heading: 'Abaixo da referência',
    notice: 'Mostrando itens cujo menor preço recente está na referência ou abaixo dela.',
    emptyTitle: 'Nenhum item abaixo da referência',
    emptyDescription: 'Quando o menor preço registrado ficar igual ou abaixo da referência, o item aparecerá aqui.',
  },
};

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalize(value) {
  return String(value || '').trim().toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function parseBrazilianMoney(value) {
  const cleaned = String(value ?? '').trim().replace(/^R\$\s*/i, '').replace(/[\s\u00a0]/g, '');
  if (!cleaned) return NaN;

  let normalized = cleaned;
  if (cleaned.includes(',')) {
    if ((cleaned.match(/,/g) || []).length !== 1) return NaN;
    const [integer, decimal] = cleaned.split(',');
    const validInteger = /^\d+$/.test(integer) || /^\d{1,3}(?:\.\d{3})+$/.test(integer);
    if (!validInteger || !/^\d{1,2}$/.test(decimal)) return NaN;
    normalized = `${integer.replace(/\./g, '')}.${decimal}`;
  } else if (/^\d{1,3}(?:\.\d{3})+$/.test(cleaned)) {
    normalized = cleaned.replace(/\./g, '');
  } else if (!/^\d+(?:\.\d{1,2})?$/.test(cleaned)) {
    return NaN;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : NaN;
}

function formatBrazilianMoneyField(event) {
  const field = event.currentTarget;
  if (!field.value.trim()) return;
  const amount = parseBrazilianMoney(field.value);
  if (Number.isFinite(amount)) field.value = moneyInputFormat.format(amount);
}

function safeUrl(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

function sanitizeProduct(product) {
  if (!product || typeof product.name !== 'string' || !product.name.trim()) return null;
  return {
    id: String(product.id || createId()),
    name: product.name.trim().slice(0, 100),
    category: typeof product.category === 'string' ? product.category.trim().slice(0, 40) || 'Outros' : 'Outros',
    priority: ['Alta', 'Média', 'Baixa'].includes(product.priority) ? product.priority : 'Baixa',
    targetWeek: Number.isInteger(Number(product.targetWeek)) && Number(product.targetWeek) > 0 ? Number(product.targetWeek) : null,
    responsible: typeof product.responsible === 'string' ? product.responsible.slice(0, 40) : '',
    preferredStore: typeof product.preferredStore === 'string' ? product.preferredStore.slice(0, 80) : '',
    productLink: safeUrl(typeof product.productLink === 'string' ? product.productLink.trim().slice(0, 1000) : ''),
    referencePrice: Number.isFinite(Number(product.referencePrice)) && Number(product.referencePrice) > 0 ? Number(product.referencePrice) : null,
    custom: Boolean(product.custom),
  };
}

function sanitizeObservation(observation, productId) {
  if (!observation || typeof observation.store !== 'string' || !observation.store.trim()) return null;
  const price = Number(observation.price);
  const observedAt = Date.parse(observation.observedAt || observation.updatedAt || '');
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(observedAt)) return null;
  return {
    id: String(observation.id || createId()),
    productId: String(productId || observation.productId || ''),
    store: observation.store.trim().slice(0, 80),
    price,
    source: typeof observation.source === 'string' ? observation.source.trim().slice(0, 80) : '',
    link: safeUrl(observation.link),
    notes: typeof observation.notes === 'string' ? observation.notes.trim().slice(0, 160) : (typeof observation.unit === 'string' ? observation.unit.trim().slice(0, 160) : ''),
    observedAt: new Date(observedAt).toISOString(),
  };
}

function createInitialState() {
  return { version: 1, products: DEFAULT_PRODUCTS.map((product) => ({ ...product })), observations: [] };
}

function findOrAddProduct(productList, importedProduct) {
  const clean = sanitizeProduct(importedProduct);
  if (!clean) return null;
  let existing = productList.find((product) => product.id === clean.id || normalize(product.name) === normalize(clean.name));
  if (existing) {
    if (!existing.referencePrice && clean.referencePrice) existing.referencePrice = clean.referencePrice;
    return existing;
  }
  if (productList.some((product) => product.id === clean.id)) clean.id = createId();
  productList.push(clean);
  return clean;
}

function loadState() {
  const base = createInitialState();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved && Array.isArray(saved.products) && Array.isArray(saved.observations)) {
      for (const product of saved.products) findOrAddProduct(base.products, product);
      const ids = new Set(base.products.map((product) => product.id));
      base.observations = saved.observations.map((observation) => sanitizeObservation(observation, observation?.productId))
        .filter((observation) => observation && ids.has(observation.productId));
      return base;
    }
  } catch { /* start with the built-in catalog */ }

  // Preserve data from the earlier generic price-comparison version.
  try {
    const oldOffers = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || '[]');
    if (Array.isArray(oldOffers)) {
      for (const offer of oldOffers) {
        if (!offer || typeof offer.product !== 'string') continue;
        let product = base.products.find((item) => normalize(item.name) === normalize(offer.product));
        if (!product) product = findOrAddProduct(base.products, { id: createId(), name: offer.product, custom: true });
        const observation = sanitizeObservation({ ...offer, observedAt: offer.updatedAt, source: 'Importado do Preço Claro' }, product?.id);
        if (observation) base.observations.push(observation);
      }
    }
  } catch { /* ignore an invalid legacy backup */ }
  return base;
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    showToast('Não foi possível salvar. Exporte um backup e verifique o espaço deste dispositivo.');
    return false;
  }
}

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getProductObservations(productId) {
  return state.observations.filter((observation) => observation.productId === productId)
    .sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt));
}

function getLatestByStore(productId) {
  const latest = new Map();
  for (const observation of getProductObservations(productId)) {
    const key = normalize(observation.store);
    if (!latest.has(key)) latest.set(key, observation);
  }
  return [...latest.values()].sort((a, b) => a.price - b.price || a.store.localeCompare(b.store, 'pt-BR'));
}

function updateSummary() {
  const tracked = state.products.filter((product) => getProductObservations(product.id).length > 0).length;
  const belowTarget = state.products.filter((product) => {
    const best = getLatestByStore(product.id)[0];
    return best && product.referencePrice && best.price <= product.referencePrice;
  }).length;
  document.querySelector('#productCount').textContent = state.products.length;
  document.querySelector('#trackedCount').textContent = tracked;
  document.querySelector('#observationCount').textContent = state.observations.length;
  document.querySelector('#belowTargetCount').textContent = belowTarget;
  document.querySelector('#exportButton').disabled = false;
}

function icon(name) {
  const paths = {
    store: '<path d="M3 8h14l-1.2-5H4.2L3 8Zm1 0v9h12V8M7 17v-5h6v5M3 8a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>',
    link: '<path d="M8 12a4 4 0 0 0 5.7 0l2-2A4 4 0 0 0 10 4.3L8.8 5.5M12 8a4 4 0 0 0-5.7 0l-2 2A4 4 0 0 0 11 15.7l1.2-1.2"/>',
    trash: '<path d="M3.5 5.5h13M7 5.5V3.8h6v1.7m2.5 0-.7 10.7H6.2L5.5 5.5M8.5 8.5v5m3-5v5"/>',
    plus: '<path d="M10 4v12M4 10h12"/>',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = paths[name];
  return svg;
}

function storeColor(store) {
  let hash = 0;
  for (const char of normalize(store)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function createHistoryChart(observations) {
  const cutoff = Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000;
  const recent = observations.filter((item) => Date.parse(item.observedAt) >= cutoff).sort((a, b) => Date.parse(a.observedAt) - Date.parse(b.observedAt));
  if (!recent.length) return null;
  const minPrice = Math.min(...recent.map((item) => item.price));
  const maxPrice = Math.max(...recent.map((item) => item.price));
  const spread = Math.max(maxPrice - minPrice, maxPrice * 0.08, 1);
  const lower = Math.max(0, minPrice - spread * 0.12);
  const upper = maxPrice + spread * 0.12;
  const minTime = Math.min(cutoff, Date.parse(recent[0].observedAt));
  const maxTime = Date.now();
  const plot = { left: 42, right: 310, top: 9, bottom: 65 };
  const x = (date) => plot.left + ((Date.parse(date) - minTime) / Math.max(maxTime - minTime, 1)) * (plot.right - plot.left);
  const y = (price) => plot.bottom - ((price - lower) / Math.max(upper - lower, 1)) * (plot.bottom - plot.top);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 320 88');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Variação de preços nos últimos ${HISTORY_DAYS} dias`);
  for (const value of [upper, lower]) {
    const label = document.createElementNS(svg.namespaceURI, 'text');
    label.setAttribute('x', '0');
    label.setAttribute('y', String(y(value) + 3));
    label.setAttribute('class', 'chart-label');
    label.textContent = currency.format(value);
    svg.append(label);
    const guide = document.createElementNS(svg.namespaceURI, 'line');
    guide.setAttribute('x1', String(plot.left));
    guide.setAttribute('x2', String(plot.right));
    guide.setAttribute('y1', String(y(value)));
    guide.setAttribute('y2', String(y(value)));
    guide.setAttribute('class', 'chart-guide');
    svg.append(guide);
  }
  const groups = new Map();
  for (const item of recent) {
    const key = normalize(item.store);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  for (const group of groups.values()) {
    const points = group.map((item) => `${x(item.observedAt)},${y(item.price)}`).join(' ');
    const color = storeColor(group[0].store);
    if (group.length > 1) {
      const line = document.createElementNS(svg.namespaceURI, 'polyline');
      line.setAttribute('points', points);
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-linejoin', 'round');
      svg.append(line);
    }
    for (const item of group) {
      const point = document.createElementNS(svg.namespaceURI, 'circle');
      point.setAttribute('cx', String(x(item.observedAt)));
      point.setAttribute('cy', String(y(item.price)));
      point.setAttribute('r', '3.2');
      point.setAttribute('fill', color);
      const title = document.createElementNS(svg.namespaceURI, 'title');
      title.textContent = `${item.store}: ${currency.format(item.price)} · ${dateFormat.format(new Date(item.observedAt))}`;
      point.append(title);
      svg.append(point);
    }
  }
  const first = document.createElementNS(svg.namespaceURI, 'text');
  first.setAttribute('x', String(plot.left));
  first.setAttribute('y', '83');
  first.setAttribute('class', 'chart-label');
  first.textContent = dateFormat.format(new Date(minTime));
  const last = document.createElementNS(svg.namespaceURI, 'text');
  last.setAttribute('x', String(plot.right));
  last.setAttribute('y', '83');
  last.setAttribute('text-anchor', 'end');
  last.setAttribute('class', 'chart-label');
  last.textContent = 'hoje';
  svg.append(first, last);
  return svg;
}

function createObservationRow(observation, best) {
  const row = document.createElement('div');
  row.className = `offer-row${observation.id === best?.id ? ' is-best' : ''}`;
  const storeWrap = document.createElement('div');
  storeWrap.className = 'offer-store-wrap';
  const mark = document.createElement('span');
  mark.className = 'store-mark';
  mark.style.setProperty('--store-color', storeColor(observation.store));
  mark.textContent = observation.store.slice(0, 1);
  const info = document.createElement('div');
  info.className = 'offer-store-info';
  const storeName = document.createElement('div');
  storeName.className = 'offer-store';
  storeName.textContent = observation.store;
  if (observation.id === best?.id) {
    const badge = document.createElement('span');
    badge.className = 'best-tag';
    badge.textContent = 'MENOR';
    storeName.append(badge);
  }
  info.append(storeName);
  const detail = document.createElement('div');
  detail.className = 'offer-detail';
  detail.textContent = [observation.source, observation.notes].filter(Boolean).join(' · ') || 'Preço registrado';
  info.append(detail);
  storeWrap.append(mark, info);

  const priceWrap = document.createElement('div');
  priceWrap.className = 'offer-price-wrap';
  const price = document.createElement('div');
  price.className = 'offer-price';
  price.textContent = currency.format(observation.price);
  const date = document.createElement('div');
  date.className = 'offer-date';
  date.textContent = dateFormat.format(new Date(observation.observedAt));
  priceWrap.append(price, date);

  const actions = document.createElement('div');
  actions.className = 'offer-actions';
  if (observation.link) {
    const link = document.createElement('a');
    link.className = 'icon-button';
    link.href = observation.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Abrir página do produto na loja ${observation.store}`);
    link.title = 'Abrir página do produto';
    link.append(icon('link'));
    actions.append(link);
  }
  const remove = document.createElement('button');
  remove.className = 'icon-button delete-offer';
  remove.type = 'button';
  remove.setAttribute('aria-label', `Remover preço de ${observation.store} registrado em ${dateFormat.format(new Date(observation.observedAt))}`);
  remove.title = 'Remover este registro';
  remove.append(icon('trash'));
  remove.addEventListener('click', () => removeObservation(observation.id));
  actions.append(remove);
  row.append(storeWrap, priceWrap, actions);
  return row;
}

function createMarketplaceSearch(product) {
  const group = document.createElement('div');
  group.className = 'marketplace-search';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', `Abrir anúncio ou pesquisar ${product.name} em marketplaces`);

  if (product.productLink) {
    const listing = document.createElement('a');
    listing.className = 'product-listing-link';
    listing.href = product.productLink;
    listing.target = '_blank';
    listing.rel = 'noopener noreferrer';
    listing.textContent = 'Ver anúncio salvo';
    listing.setAttribute('aria-label', `Abrir anúncio salvo de ${product.name}`);
    group.append(listing);
  }

  const label = document.createElement('span');
  label.className = 'marketplace-search-label';
  label.textContent = 'Pesquisar em';
  group.append(label);

  const query = product.name.trim();
  const marketplaces = [
    { name: 'Mercado Livre', url: `https://lista.mercadolivre.com.br/${encodeURIComponent(query).replace(/%20/g, '-')}` },
    { name: 'Amazon', url: `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}` },
    { name: 'Shopee', url: `https://shopee.com.br/search?keyword=${encodeURIComponent(query)}` },
  ];

  marketplaces.forEach((marketplace) => {
    const link = document.createElement('a');
    link.href = marketplace.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = marketplace.name;
    link.setAttribute('aria-label', `Pesquisar ${product.name} no ${marketplace.name}`);
    group.append(link);
  });

  return group;
}

function createProductCard(product) {
  const allObservations = getProductObservations(product.id);
  const latest = getLatestByStore(product.id);
  const best = latest[0] || null;
  const card = document.createElement('article');
  card.className = 'product-card';

  const top = document.createElement('div');
  top.className = 'product-card-top';
  const titleBlock = document.createElement('div');
  const category = document.createElement('p');
  category.className = 'product-category';
  category.textContent = `${product.category} · prioridade ${product.priority.toLocaleLowerCase('pt-BR')}`;
  const title = document.createElement('h3');
  title.className = 'product-name';
  title.textContent = product.name;
  titleBlock.append(category, title);
  const count = document.createElement('span');
  count.className = 'offer-count-badge';
  count.append(icon('store'), document.createTextNode(`${latest.length} ${latest.length === 1 ? 'loja' : 'lojas'}`));
  top.append(titleBlock, count);

  const meta = document.createElement('p');
  meta.className = 'product-meta';
  meta.textContent = [product.targetWeek ? `comprar até a semana ${product.targetWeek}` : '', product.responsible ? `responsável: ${product.responsible}` : '', product.preferredStore ? `buscar em: ${product.preferredStore}` : '']
    .filter(Boolean).join(' · ');

  const target = document.createElement('div');
  target.className = 'reference-block';
  const targetLabel = document.createElement('span');
  targetLabel.textContent = 'Preço de referência informado';
  const targetValue = document.createElement('strong');
  targetValue.textContent = product.referencePrice ? currency.format(product.referencePrice) : 'Não informado';
  target.append(targetLabel, targetValue);
  if (best && product.referencePrice) {
    const difference = product.referencePrice - best.price;
    const evaluation = document.createElement('span');
    evaluation.className = `target-status ${difference >= 0 ? 'is-under-target' : 'is-over-target'}`;
    evaluation.textContent = difference >= 0
      ? `${currency.format(difference)} abaixo da referência`
      : `${currency.format(Math.abs(difference))} acima da referência`;
    target.append(evaluation);
  }

  const pricesHeading = document.createElement('p');
  pricesHeading.className = 'prices-heading';
  pricesHeading.textContent = latest.length ? 'Preço mais recente por loja' : 'Ainda sem preço observado';
  const list = document.createElement('div');
  list.className = 'offer-list';
  latest.forEach((observation, index) => list.append(createObservationRow(observation, index === 0 ? observation : null)));
  if (!latest.length) {
    const empty = document.createElement('p');
    empty.className = 'no-price-note';
    empty.textContent = 'Registre uma consulta para iniciar o histórico deste item.';
    list.append(empty);
  }
  if (activeSummaryFilter === 'records') {
    pricesHeading.hidden = true;
    list.hidden = true;
  }

  const history = document.createElement('details');
  history.className = 'history-details';
  const summary = document.createElement('summary');
  const recentCount = allObservations.filter((item) => Date.parse(item.observedAt) >= Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).length;
  summary.textContent = activeSummaryFilter === 'records'
    ? `Registros deste item · ${allObservations.length}`
    : `Histórico de 90 dias · ${recentCount} ${recentCount === 1 ? 'registro' : 'registros'}`;
  history.append(summary);
  const chart = createHistoryChart(allObservations);
  if (chart) {
    const chartWrap = document.createElement('div');
    chartWrap.className = 'history-chart';
    chartWrap.append(chart);
    history.append(chartWrap);
  } else {
    const waiting = document.createElement('p');
    waiting.className = 'history-empty';
    waiting.textContent = 'Ainda não há registros nos últimos 90 dias. Você pode lançar preços de notas ou pesquisas antigas com a data em que foram observados.';
    history.append(waiting);
  }
  const historyInfo = document.createElement('p');
  historyInfo.className = 'history-info';
  historyInfo.textContent = 'O gráfico usa registros manuais por loja. Uma série contínua depende de novas observações ao longo do tempo.';
  history.append(historyInfo);
  history.open = activeSummaryFilter === 'records';
  if (allObservations.length) {
    const historyList = document.createElement('div');
    historyList.className = 'history-list';
    allObservations.forEach((observation) => historyList.append(createObservationRow(observation, best?.id === observation.id ? best : null)));
    history.append(historyList);
  }

  const footer = document.createElement('div');
  footer.className = 'card-footer';
  const note = document.createElement('p');
  note.className = 'difference-note';
  if (latest.length > 1) {
    const spread = latest.at(-1).price - latest[0].price;
    note.textContent = `Diferença entre lojas: ${currency.format(spread)}`;
  } else if (latest.length === 1) {
    note.textContent = `Último preço registrado em ${dateFormat.format(new Date(latest[0].observedAt))}`;
  } else {
    note.textContent = 'Compare ofertas de duas ou mais lojas';
  }
  const add = document.createElement('button');
  add.className = 'add-offer-link';
  add.type = 'button';
  add.append(icon('plus'), document.createTextNode('Registrar preço'));
  add.addEventListener('click', () => openOfferDialog(product.name));
  footer.append(note, add);

  card.append(top, meta, target, pricesHeading, list, createMarketplaceSearch(product), history, footer);
  return card;
}

function updateCategoryFilter() {
  const select = document.querySelector('#categoryFilter');
  const current = select.value;
  const categories = getCategories();
  select.replaceChildren(new Option('Todas as categorias', ''), ...categories.map((category) => new Option(category, category)));
  select.value = categories.includes(current) ? current : '';
}

function getCategories() {
  return [...new Set(state.products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

function updateCategorySuggestions() {
  const options = getCategories().map((category) => new Option(category, category));
  document.querySelector('#categorySuggestions').replaceChildren(...options);
}

function render() {
  updateSummary();
  updateCategoryFilter();
  const selectedSummary = SUMMARY_FILTERS[activeSummaryFilter];
  document.querySelector('#catalogHeadingText').textContent = selectedSummary?.heading || 'Acompanhe o enxoval';
  document.querySelector('#summaryFilterNote').hidden = !selectedSummary;
  document.querySelector('#summaryFilterText').textContent = selectedSummary?.notice || '';
  for (const [key, filter] of Object.entries(SUMMARY_FILTERS)) {
    document.querySelector(filter.button).setAttribute('aria-pressed', String(key === activeSummaryFilter));
  }
  const search = normalize(document.querySelector('#searchInput').value);
  const category = document.querySelector('#categoryFilter').value;
  const priority = document.querySelector('#priorityFilter').value;
  const sort = document.querySelector('#sortSelect').value;
  const visible = state.products.filter((product) => {
    if ((activeSummaryFilter === 'tracked' || activeSummaryFilter === 'records') && getProductObservations(product.id).length === 0) return false;
    if (activeSummaryFilter === 'belowTarget') {
      const best = getLatestByStore(product.id)[0];
      if (!best || !product.referencePrice || best.price > product.referencePrice) return false;
    }
    if (category && product.category !== category) return false;
    if (priority && product.priority !== priority) return false;
    if (!search) return true;
    const searchText = [product.name, product.category, product.responsible, product.preferredStore,
      ...getProductObservations(product.id).map((item) => item.store)].map(normalize).join(' ');
    return searchText.includes(search);
  });
  const rank = { Alta: 0, Média: 1, Baixa: 2 };
  visible.sort((a, b) => {
    if (sort === 'priority') return rank[a.priority] - rank[b.priority] || (a.targetWeek || 99) - (b.targetWeek || 99) || a.name.localeCompare(b.name, 'pt-BR');
    if (sort === 'lowest') return (getLatestByStore(a.id)[0]?.price ?? Infinity) - (getLatestByStore(b.id)[0]?.price ?? Infinity) || a.name.localeCompare(b.name, 'pt-BR');
    if (sort === 'week') return (a.targetWeek || 99) - (b.targetWeek || 99) || a.name.localeCompare(b.name, 'pt-BR');
    return a.name.localeCompare(b.name, 'pt-BR');
  });
  productGrid.replaceChildren(...visible.map(createProductCard));
  productGrid.classList.toggle('is-records-view', activeSummaryFilter === 'records');
  const resultCount = activeSummaryFilter === 'records'
    ? visible.reduce((count, product) => count + getProductObservations(product.id).length, 0)
    : visible.length;
  document.querySelector('#resultCount').textContent = resultCount;
  const noMatches = visible.length === 0;
  emptyState.hidden = !noMatches;
  productGrid.hidden = noMatches;
  document.querySelector('#emptyKicker').textContent = selectedSummary ? 'RESUMO DO ENXOVAL' : 'FILTROS DA PESQUISA';
  document.querySelector('#emptyTitle').textContent = selectedSummary?.emptyTitle || 'Nenhum item encontrado';
  document.querySelector('#emptyDescription').textContent = selectedSummary?.emptyDescription || 'Tente outro termo de busca ou limpe os filtros para ver a lista completa do enxoval.';
  document.querySelector('#emptyAddButton').hidden = true;
  const suggestions = state.products.map((product) => {
    const option = document.createElement('option');
    option.value = product.name;
    return option;
  });
  document.querySelector('#productSuggestions').replaceChildren(...suggestions);
  updateCategorySuggestions();
}

function toggleSummaryFilter(filter) {
  if (!SUMMARY_FILTERS[filter]) return;
  activeSummaryFilter = activeSummaryFilter === filter ? '' : filter;
  document.querySelector('#searchInput').value = '';
  document.querySelector('#categoryFilter').value = '';
  document.querySelector('#priorityFilter').value = '';
  render();
  if (activeSummaryFilter) document.querySelector('.catalog-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearSummaryFilter() {
  activeSummaryFilter = '';
  render();
}

function handleManualFilterChange() {
  activeSummaryFilter = '';
  render();
}

function openProductDialog() {
  productForm.reset();
  newProductPriorityInput.value = 'Média';
  productFormError.hidden = true;
  productDialog.showModal();
  window.setTimeout(() => newProductNameInput.focus(), 0);
}

function closeProductDialog() {
  productDialog.close();
  productFormError.hidden = true;
}

function showProductFormError(message) {
  productFormError.textContent = message;
  productFormError.hidden = false;
}

function handleProductSubmit(event) {
  event.preventDefault();
  const name = newProductNameInput.value.trim().slice(0, 100);
  const typedCategory = newProductCategoryInput.value.trim().slice(0, 40);
  const targetWeekValue = newProductWeekInput.value.trim();
  const rawProductLink = newProductLinkInput.value.trim();
  const productLink = rawProductLink ? safeUrl(rawProductLink) : '';
  const referencePriceValue = newProductReferenceInput.value.trim();
  const referencePrice = referencePriceValue ? parseBrazilianMoney(referencePriceValue) : null;

  if (!name || !typedCategory) {
    showProductFormError('Informe o nome do item e a categoria.');
    return;
  }
  if (state.products.some((product) => normalize(product.name) === normalize(name))) {
    showProductFormError('Já existe um item com esse nome. Confira a lista e tente outro nome.');
    return;
  }
  if (rawProductLink && !productLink) {
    showProductFormError('Informe um link válido começando com http:// ou https://.');
    return;
  }

  const targetWeek = targetWeekValue ? Number(targetWeekValue) : null;
  if (targetWeekValue && (!Number.isInteger(targetWeek) || targetWeek < 1)) {
    showProductFormError('A semana de compra deve ser um número inteiro maior que zero.');
    return;
  }
  if (referencePriceValue && (!Number.isFinite(referencePrice) || referencePrice <= 0)) {
    showProductFormError('Informe um preço de referência válido em reais (R$), maior que zero.');
    return;
  }

  const matchingCategory = state.products.find((product) => normalize(product.category) === normalize(typedCategory))?.category;
  const product = sanitizeProduct({
    id: createId(),
    name,
    category: matchingCategory || typedCategory,
    priority: newProductPriorityInput.value,
    targetWeek,
    responsible: newProductResponsibleInput.value.trim(),
    preferredStore: newProductStoreInput.value.trim(),
    productLink,
    referencePrice,
    custom: true,
  });
  if (!product) {
    showProductFormError('Não foi possível cadastrar esse item. Confira os dados e tente novamente.');
    return;
  }

  state.products.push(product);
  if (!persistState()) {
    state.products = state.products.filter((item) => item.id !== product.id);
    return;
  }
  closeProductDialog();
  document.querySelector('#searchInput').value = '';
  document.querySelector('#categoryFilter').value = '';
  document.querySelector('#priorityFilter').value = '';
  activeSummaryFilter = '';
  render();
  showToast('Item adicionado à lista do enxoval.');
}

function openOfferDialog(productName = '') {
  offerForm.reset();
  productInput.value = productName;
  dateInput.value = localDateValue();
  formError.hidden = true;
  offerDialog.showModal();
  window.setTimeout(() => (productName ? storeInput : productInput).focus(), 0);
}

function closeOfferDialog() {
  offerDialog.close();
  formError.hidden = true;
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function handleSubmit(event) {
  event.preventDefault();
  const productName = productInput.value.trim().slice(0, 100);
  const store = storeInput.value.trim().slice(0, 80);
  const price = parseBrazilianMoney(priceInput.value);
  const dateValue = dateInput.value;
  const source = sourceInput.value.trim().slice(0, 80);
  const rawLink = linkInput.value.trim();
  const link = rawLink ? safeUrl(rawLink) : '';
  if (!productName || !store || !Number.isFinite(price) || price <= 0 || !dateValue) {
    showFormError('Informe produto, loja, data e um preço válido em reais (R$), maior que zero.');
    return;
  }
  if (rawLink && !link) {
    showFormError('Informe um link válido começando com http:// ou https://.');
    return;
  }
  const observationDate = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(observationDate.getTime()) || dateValue > localDateValue()) {
    showFormError('A data do preço precisa ser válida e não pode estar no futuro.');
    return;
  }
  let product = state.products.find((item) => normalize(item.name) === normalize(productName));
  if (!product) {
    product = sanitizeProduct({ id: createId(), name: productName, category: 'Outros', priority: 'Baixa', custom: true });
    state.products.push(product);
  }
  state.observations.push(sanitizeObservation({
    id: createId(), productId: product.id, store, price, source, link,
    notes: notesInput.value, observedAt: observationDate.toISOString(),
  }, product.id));
  if (!persistState()) return;
  closeOfferDialog();
  render();
  showToast('Preço registrado no histórico.');
}

function removeObservation(id) {
  state.observations = state.observations.filter((observation) => observation.id !== id);
  persistState();
  render();
  showToast('Registro de preço removido.');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function exportState() {
  const blob = new Blob([JSON.stringify({ app: 'Enxoval em Conta', version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `enxoval-em-conta-${localDateValue()}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('Backup do enxoval exportado.');
}

function importLegacyOffers(offers) {
  if (!Array.isArray(offers)) return 0;
  let imported = 0;
  for (const offer of offers) {
    if (!offer || typeof offer.product !== 'string') continue;
    let product = state.products.find((item) => normalize(item.name) === normalize(offer.product));
    if (!product) {
      product = sanitizeProduct({ id: createId(), name: offer.product, category: 'Outros', priority: 'Baixa', custom: true });
      state.products.push(product);
    }
    const observation = sanitizeObservation({ ...offer, observedAt: offer.updatedAt, source: 'Importado do backup anterior' }, product.id);
    if (observation) {
      const duplicate = state.observations.some((item) => item.productId === observation.productId && normalize(item.store) === normalize(observation.store) && item.price === observation.price && item.observedAt === observation.observedAt);
      if (!duplicate) { state.observations.push(observation); imported += 1; }
    }
  }
  return imported;
}

async function importBackup(file) {
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('O arquivo deve ter até 5 MB.');
    return;
  }
  try {
    const payload = JSON.parse(await file.text());
    let imported = 0;
    if (Array.isArray(payload)) {
      imported = importLegacyOffers(payload);
    } else if (Array.isArray(payload?.offers)) {
      imported = importLegacyOffers(payload.offers);
    } else if (Array.isArray(payload?.products) && Array.isArray(payload?.observations)) {
      const idMap = new Map();
      for (const incoming of payload.products) {
        const product = findOrAddProduct(state.products, incoming);
        if (product) idMap.set(String(incoming.id), product.id);
      }
      for (const item of payload.observations) {
        const productId = idMap.get(String(item.productId)) || String(item.productId || '');
        const observation = sanitizeObservation(item, productId);
        if (!observation || !state.products.some((product) => product.id === observation.productId)) continue;
        const duplicate = state.observations.some((saved) => saved.productId === observation.productId && normalize(saved.store) === normalize(observation.store) && saved.price === observation.price && saved.observedAt === observation.observedAt);
        if (!duplicate) { state.observations.push(observation); imported += 1; }
      }
    } else {
      throw new Error('Formato inválido');
    }
    if (!persistState()) return;
    render();
    showToast(imported ? `${imported} ${imported === 1 ? 'registro importado' : 'registros importados'}.` : 'Backup lido; não havia novos registros de preço.');
  } catch {
    showToast('Não foi possível ler o backup. Selecione um JSON exportado pelo Enxoval em Conta ou Preço Claro.');
  }
}

document.querySelector('#openOfferButton').addEventListener('click', () => openOfferDialog());
document.querySelector('#addProductButton').addEventListener('click', openProductDialog);
document.querySelector('#exportButton').addEventListener('click', exportState);
document.querySelector('#importButton').addEventListener('click', () => document.querySelector('#importInput').click());
document.querySelector('#importInput').addEventListener('change', (event) => {
  importBackup(event.currentTarget.files?.[0]);
  event.currentTarget.value = '';
});
document.querySelector('#closeDialogButton').addEventListener('click', closeOfferDialog);
document.querySelector('#cancelDialogButton').addEventListener('click', closeOfferDialog);
document.querySelector('#closeProductDialogButton').addEventListener('click', closeProductDialog);
document.querySelector('#cancelProductDialogButton').addEventListener('click', closeProductDialog);
offerForm.addEventListener('submit', handleSubmit);
productForm.addEventListener('submit', handleProductSubmit);
priceInput.addEventListener('blur', formatBrazilianMoneyField);
newProductReferenceInput.addEventListener('blur', formatBrazilianMoneyField);
document.querySelector('#filterTrackedButton').addEventListener('click', () => toggleSummaryFilter('tracked'));
document.querySelector('#filterRecordsButton').addEventListener('click', () => toggleSummaryFilter('records'));
document.querySelector('#filterBelowTargetButton').addEventListener('click', () => toggleSummaryFilter('belowTarget'));
document.querySelector('#clearSummaryFilterButton').addEventListener('click', clearSummaryFilter);
document.querySelector('#searchInput').addEventListener('input', handleManualFilterChange);
document.querySelector('#sortSelect').addEventListener('change', render);
document.querySelector('#categoryFilter').addEventListener('change', handleManualFilterChange);
document.querySelector('#priorityFilter').addEventListener('change', handleManualFilterChange);
offerDialog.addEventListener('click', (event) => {
  if (event.target === offerDialog) closeOfferDialog();
});
productDialog.addEventListener('click', (event) => {
  if (event.target === productDialog) closeProductDialog();
});
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.querySelector('#searchInput').focus();
  }
});

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

persistState();
render();


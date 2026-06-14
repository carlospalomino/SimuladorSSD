import { PAGE_FREE, PAGE_VALID, PAGE_INVALID } from '../useSSD.js';

/**
 * Escenario 4 – Disco Casi Lleno: GC Urgente
 * Solo 2 páginas libres, 7 inválidas acumuladas.
 * Concepto: Garbage Collection y recuperación de espacio.
 */
const escenarioGC = {
  id: 'gc_needed',
  emoji: '🔴',
  title: 'Disco Casi Lleno — ¡GC Urgente!',
  subtitle: 'Solo 2 páginas libres, 7 inválidas',
  description:
    'El disco está al límite: solo quedan 2 páginas libres y hay 7 inválidas acumuladas. Si intentas escribir algo nuevo el SSD no podrá. Ejecuta Garbage Collection y observa cómo selecciona el bloque víctima, mueve páginas válidas y borra el bloque físicamente para recuperar espacio.',
  concept: 'Garbage Collection — recuperación de espacio en NAND',
  blocks: [
    { id: 0, eraseCount: 1, pages: [
      { id: 0, state: PAGE_INVALID, lba: null, data: 'old_v1' },
      { id: 1, state: PAGE_INVALID, lba: null, data: 'old_v2' },
      { id: 2, state: PAGE_INVALID, lba: null, data: 'old_v3' },
      { id: 3, state: PAGE_VALID,   lba: 0,    data: 'datos.db' },
    ]},
    { id: 1, eraseCount: 0, pages: [
      { id: 0, state: PAGE_VALID,   lba: 1,    data: 'img.png' },
      { id: 1, state: PAGE_INVALID, lba: null, data: 'borrado' },
      { id: 2, state: PAGE_INVALID, lba: null, data: 'borrado' },
      { id: 3, state: PAGE_VALID,   lba: 2,    data: 'video.mp4' },
    ]},
    { id: 2, eraseCount: 0, pages: [
      { id: 0, state: PAGE_INVALID, lba: null, data: 'cache_old' },
      { id: 1, state: PAGE_INVALID, lba: null, data: 'temp_old' },
      { id: 2, state: PAGE_VALID,   lba: 3,    data: 'kernel.sys' },
      { id: 3, state: PAGE_FREE,    lba: null, data: '' },
    ]},
    { id: 3, eraseCount: 0, pages: [
      { id: 0, state: PAGE_VALID,   lba: 4,    data: 'user.cfg' },
      { id: 1, state: PAGE_INVALID, lba: null, data: 'swap_old' },
      { id: 2, state: PAGE_FREE,    lba: null, data: '' },
      { id: 3, state: PAGE_VALID,   lba: 5,    data: 'log.txt' },
    ]},
  ],
  ftl: {
    0: { blockId: 0, pageId: 3 },
    1: { blockId: 1, pageId: 0 },
    2: { blockId: 1, pageId: 3 },
    3: { blockId: 2, pageId: 2 },
    4: { blockId: 3, pageId: 0 },
    5: { blockId: 3, pageId: 3 },
  },
  trimEnabled: true,
  osWrites: 12,
  nandWrites: 12,
  nandErases: 1,
};

export default escenarioGC;

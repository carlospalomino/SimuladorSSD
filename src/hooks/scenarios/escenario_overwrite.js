import { PAGE_FREE, PAGE_VALID, PAGE_INVALID } from '../useSSD.js';

/**
 * Escenario 2 – La Paradoja de la Sobrescritura
 * LBA 0 fue escrito y reescrito 3 veces → basura acumulada.
 * Concepto: No existe sobrescritura directa en NAND.
 */
const escenarioOverwrite = {
  id: 'overwrite_paradox',
  emoji: '♻️',
  title: 'Paradoja de la Sobrescritura',
  subtitle: 'LBA 0 fue sobrescrito 3 veces',
  description:
    'El LBA 0 fue escrito y reescrito 3 veces. El SSD no puede borrar las páginas antiguas individualmente: solo escribe en páginas libres y marca las anteriores como INVÁLIDAS. Esa "basura" ocupa espacio físico real hasta que el GC la elimine.',
  concept: 'No hay sobrescritura directa en NAND Flash',
  blocks: [
    { id: 0, eraseCount: 0, pages: [
      { id: 0, state: PAGE_INVALID, lba: 0, data: 'foto_v1.jpg' },
      { id: 1, state: PAGE_INVALID, lba: 0, data: 'foto_v2.jpg' },
      { id: 2, state: PAGE_VALID,   lba: 0, data: 'foto_v3.jpg' },
      { id: 3, state: PAGE_FREE,    lba: null, data: '' },
    ]},
    { id: 1, eraseCount: 0, pages: [
      { id: 0, state: PAGE_VALID, lba: 1, data: 'video.mp4' },
      { id: 1, state: PAGE_VALID, lba: 2, data: 'doc.pdf' },
      { id: 2, state: PAGE_FREE,  lba: null, data: '' },
      { id: 3, state: PAGE_FREE,  lba: null, data: '' },
    ]},
    { id: 2, eraseCount: 0, pages: [
      { id: 0, state: PAGE_FREE, lba: null, data: '' },
      { id: 1, state: PAGE_FREE, lba: null, data: '' },
      { id: 2, state: PAGE_FREE, lba: null, data: '' },
      { id: 3, state: PAGE_FREE, lba: null, data: '' },
    ]},
    { id: 3, eraseCount: 0, pages: [
      { id: 0, state: PAGE_FREE, lba: null, data: '' },
      { id: 1, state: PAGE_FREE, lba: null, data: '' },
      { id: 2, state: PAGE_FREE, lba: null, data: '' },
      { id: 3, state: PAGE_FREE, lba: null, data: '' },
    ]},
  ],
  ftl: {
    0: { blockId: 0, pageId: 2 },
    1: { blockId: 1, pageId: 0 },
    2: { blockId: 1, pageId: 1 },
  },
  trimEnabled: true,
  osWrites: 5,
  nandWrites: 5,
  nandErases: 0,
};

export default escenarioOverwrite;

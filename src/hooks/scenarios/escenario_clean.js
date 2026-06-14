import { PAGE_FREE, PAGE_VALID } from '../useSSD.js';

/**
 * Escenario 1 – Estado Limpio
 * Chip NAND recién formateado, todas las páginas libres.
 * Concepto: Escritura básica y mapeo FTL.
 */
const escenarioClean = {
  id: 'clean',
  emoji: '🟢',
  title: 'Estado Limpio',
  subtitle: 'Chip NAND recién formateado',
  description:
    'Todas las páginas están libres. Estado inicial ideal. Prueba escribir en varios LBAs y observa cómo la FTL asigna automáticamente páginas físicas priorizando el bloque con menor desgaste.',
  concept: 'Escritura básica y mapeo FTL',
  blocks: [
    { id: 0, eraseCount: 0, pages: [
      { id: 0, state: PAGE_FREE, lba: null, data: '' },
      { id: 1, state: PAGE_FREE, lba: null, data: '' },
      { id: 2, state: PAGE_FREE, lba: null, data: '' },
      { id: 3, state: PAGE_FREE, lba: null, data: '' },
    ]},
    { id: 1, eraseCount: 0, pages: [
      { id: 0, state: PAGE_FREE, lba: null, data: '' },
      { id: 1, state: PAGE_FREE, lba: null, data: '' },
      { id: 2, state: PAGE_FREE, lba: null, data: '' },
      { id: 3, state: PAGE_FREE, lba: null, data: '' },
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
  ftl: {},
  trimEnabled: true,
  osWrites: 0,
  nandWrites: 0,
  nandErases: 0,
};

export default escenarioClean;

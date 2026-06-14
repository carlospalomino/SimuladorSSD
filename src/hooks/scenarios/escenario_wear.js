import { PAGE_FREE, PAGE_VALID } from '../useSSD.js';

/**
 * Escenario 5 – Desgaste Desigual (Wear Leveling)
 * Bloque 0 sobreexplotado (18 ciclos) vs. el resto casi nuevo.
 * Concepto: La FTL prioriza bloques con menos ciclos de borrado.
 */
const escenarioWear = {
  id: 'wear_leveling',
  emoji: '⚖️',
  title: 'Desgaste Desigual',
  subtitle: 'Bloque 0: 18 ciclos vs. Bloque 3: 0 ciclos',
  description:
    'El Bloque 0 ha sido borrado 18 veces mientras el Bloque 3 nunca fue usado. Escribe varios LBAs nuevos y observa en cuál bloque el FTL decide colocar los datos: debería evitar el Bloque 0 y preferir los de menor desgaste para extender la vida útil del chip.',
  concept: 'Wear Leveling — distribución equitativa del desgaste',
  blocks: [
    { id: 0, eraseCount: 18, pages: [
      { id: 0, state: PAGE_FREE, lba: null, data: '' },
      { id: 1, state: PAGE_FREE, lba: null, data: '' },
      { id: 2, state: PAGE_FREE, lba: null, data: '' },
      { id: 3, state: PAGE_FREE, lba: null, data: '' },
    ]},
    { id: 1, eraseCount: 2, pages: [
      { id: 0, state: PAGE_VALID, lba: 0, data: 'archivo_a' },
      { id: 1, state: PAGE_FREE,  lba: null, data: '' },
      { id: 2, state: PAGE_FREE,  lba: null, data: '' },
      { id: 3, state: PAGE_FREE,  lba: null, data: '' },
    ]},
    { id: 2, eraseCount: 1, pages: [
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
    0: { blockId: 1, pageId: 0 },
  },
  trimEnabled: true,
  osWrites: 1,
  nandWrites: 1,
  nandErases: 21,
};

export default escenarioWear;

import { PAGE_FREE, PAGE_VALID } from '../useSSD.js';

/**
 * Escenario 3 – TRIM ON vs OFF
 * Archivos borrados por el SO con TRIM desactivado.
 * Concepto: Sin TRIM el SSD cree que los datos siguen válidos.
 */
const escenarioTrim = {
  id: 'trim_demo',
  emoji: '🗑️',
  title: 'TRIM ON vs OFF',
  subtitle: 'TRIM desactivado — el SSD no sabe qué borrar',
  description:
    'El SO borró "musica.mp3", "temp.tmp", "config.ini" y "cache.dat", pero con TRIM desactivado el SSD NO fue notificado: esas páginas siguen como VÁLIDAS (verdes). Activa TRIM, borra un LBA y observa cómo cambia el estado. Luego ejecuta GC y compara el trabajo que tuvo que hacer.',
  concept: 'Impacto del comando TRIM en la eficiencia del GC',
  blocks: [
    { id: 0, eraseCount: 0, pages: [
      { id: 0, state: PAGE_VALID, lba: 0, data: 'musica.mp3' },
      { id: 1, state: PAGE_VALID, lba: 1, data: 'temp.tmp' },
      { id: 2, state: PAGE_VALID, lba: 2, data: 'sistema.dll' },
      { id: 3, state: PAGE_VALID, lba: 3, data: 'config.ini' },
    ]},
    { id: 1, eraseCount: 0, pages: [
      { id: 0, state: PAGE_VALID, lba: 4, data: 'app.exe' },
      { id: 1, state: PAGE_VALID, lba: 5, data: 'cache.dat' },
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
    0: { blockId: 0, pageId: 0 },
    1: { blockId: 0, pageId: 1 },
    2: { blockId: 0, pageId: 2 },
    3: { blockId: 0, pageId: 3 },
    4: { blockId: 1, pageId: 0 },
    5: { blockId: 1, pageId: 1 },
  },
  trimEnabled: false,
  osWrites: 6,
  nandWrites: 6,
  nandErases: 0,
};

export default escenarioTrim;

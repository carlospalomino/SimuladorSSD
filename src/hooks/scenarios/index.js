/**
 * index.js – Punto de entrada de todos los escenarios educativos.
 * Importar desde aquí para mantener la estructura modular.
 */
import escenarioClean    from './escenario_clean.js';
import escenarioOverwrite from './escenario_overwrite.js';
import escenarioTrim     from './escenario_trim.js';
import escenarioGC       from './escenario_gc.js';
import escenarioWear     from './escenario_wear.js';

export const SCENARIOS = [
  escenarioClean,
  escenarioOverwrite,
  escenarioTrim,
  escenarioGC,
  escenarioWear,
];

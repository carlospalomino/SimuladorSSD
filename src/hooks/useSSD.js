import { useState, useCallback } from 'react';

/* ─── CONSTANTES ───────────────────────────────────────────────── */
export const NUM_BLOCKS = 4;
export const PAGES_PER_BLOCK = 4;

export const PAGE_FREE    = 'free';
export const PAGE_VALID   = 'valid';
export const PAGE_INVALID = 'invalid';

// ─── Estado inicial ────────────────────────────────────────────
function buildInitialState() {
  const blocks = Array.from({ length: NUM_BLOCKS }, (_, bi) => ({
    id: bi,
    eraseCount: 0,
    pages: Array.from({ length: PAGES_PER_BLOCK }, (_, pi) => ({
      id: pi,
      state: PAGE_FREE,
      lba: null,
      data: '',
    })),
  }));

  return {
    blocks,
    // FTL: mapea LBA -> { blockId, pageId } | null
    ftl: {},
    trimEnabled: true,
    osWrites: 0,
    nandWrites: 0,
    nandErases: 0,
    log: [],
  };
}

/* ─── HELPERS ──────────────────────────────────────────────────── */
function findFreePage(blocks) {
  // Wear-leveling: iterar por bloque con menor eraseCount
  const sorted = [...blocks].sort((a, b) => a.eraseCount - b.eraseCount);
  for (const block of sorted) {
    const pageIdx = block.pages.findIndex(p => p.state === PAGE_FREE);
    if (pageIdx !== -1) return { blockId: block.id, pageId: pageIdx };
  }
  return null;
}

function hasFreePages(blocks) {
  return blocks.some(b => b.pages.some(p => p.state === PAGE_FREE));
}

/* ─── HOOK ─────────────────────────────────────────────────────── */
export function useSSD() {
  const [state, setState] = useState(buildInitialState);

  const addLog = useCallback((msg, type = 'info') => {
    setState(prev => ({
      ...prev,
      log: [{ id: Date.now() + Math.random(), msg, type, ts: new Date().toLocaleTimeString() }, ...prev.log].slice(0, 60),
    }));
  }, []);

  /* ── 1. ESCRITURA ─────────────────────────────────────────────── */
  const writeLBA = useCallback((lba, data) => {
    setState(prev => {
      const blocks = prev.blocks.map(b => ({ ...b, pages: b.pages.map(p => ({ ...p })) }));
      const ftl = { ...prev.ftl };
      let osWrites = prev.osWrites + 1;
      let nandWrites = prev.nandWrites;
      const logs = [...prev.log];

      const pushLog = (msg, type) =>
        logs.unshift({ id: Date.now() + Math.random(), msg, type, ts: new Date().toLocaleTimeString() });

      // Invalidar página antigua si existe
      if (ftl[lba]) {
        const { blockId, pageId } = ftl[lba];
        blocks[blockId].pages[pageId].state = PAGE_INVALID;
        pushLog(`FTL: LBA ${lba} sobrescrito → Bloque ${blockId}, Pág ${pageId} marcada como INVÁLIDA (basura generada)`, 'warn');
      }

      // Buscar página libre (wear-leveling)
      const target = findFreePage(blocks);
      if (!target) {
        pushLog('⚠️ Sin páginas libres. Ejecuta Garbage Collection primero.', 'error');
        return { ...prev, log: logs.slice(0, 60) };
      }

      const { blockId, pageId } = target;
      blocks[blockId].pages[pageId] = { id: pageId, state: PAGE_VALID, lba, data };
      ftl[lba] = { blockId, pageId };
      nandWrites++;

      pushLog(`✏️ OS escribe LBA ${lba} → Bloque ${blockId}, Pág ${pageId} [${data}]`, 'success');

      return { ...prev, blocks, ftl, osWrites, nandWrites, log: logs.slice(0, 60) };
    });
  }, []);

  /* ── 2. BORRADO LÓGICO (OS Delete) ────────────────────────────── */
  const deleteLBA = useCallback((lba) => {
    setState(prev => {
      const blocks = prev.blocks.map(b => ({ ...b, pages: b.pages.map(p => ({ ...p })) }));
      const ftl = { ...prev.ftl };
      const logs = [...prev.log];

      const pushLog = (msg, type) =>
        logs.unshift({ id: Date.now() + Math.random(), msg, type, ts: new Date().toLocaleTimeString() });

      if (!ftl[lba]) {
        pushLog(`LBA ${lba} no existe en la FTL.`, 'error');
        return { ...prev, log: logs.slice(0, 60) };
      }

      const { blockId, pageId } = ftl[lba];

      if (prev.trimEnabled) {
        // TRIM activo: se avisa al SSD → marcamos inválida
        blocks[blockId].pages[pageId].state = PAGE_INVALID;
        blocks[blockId].pages[pageId].lba = null;
        pushLog(`🗑️ TRIM ON: OS eliminó LBA ${lba} → Bloque ${blockId}, Pág ${pageId} INVÁLIDA (SSD informado)`, 'trim');
      } else {
        // TRIM desactivado: SSD no sabe → página sigue VÁLIDA (desperdicio)
        pushLog(`🗑️ TRIM OFF: OS eliminó LBA ${lba} lógicamente, pero el SSD NO fue avisado → Pág sigue VÁLIDA (overhead GC)`, 'warn');
      }

      delete ftl[lba];
      return { ...prev, blocks, ftl, log: logs.slice(0, 60) };
    });
  }, []);

  /* ── 3. GARBAGE COLLECTION ────────────────────────────────────── */
  const garbageCollect = useCallback(() => {
    setState(prev => {
      const blocks = prev.blocks.map(b => ({ ...b, pages: b.pages.map(p => ({ ...p })) }));
      const ftl = { ...prev.ftl };
      const logs = [...prev.log];
      let nandWrites = prev.nandWrites;
      let nandErases = prev.nandErases;

      const pushLog = (msg, type) =>
        logs.unshift({ id: Date.now() + Math.random(), msg, type, ts: new Date().toLocaleTimeString() });

      // Seleccionar bloque víctima: el que más páginas inválidas tenga
      const victim = blocks.reduce((best, b) => {
        const inv = b.pages.filter(p => p.state === PAGE_INVALID).length;
        return inv > (best ? best.pages.filter(p => p.state === PAGE_INVALID).length : -1) ? b : best;
      }, null);

      if (!victim || victim.pages.every(p => p.state === PAGE_FREE || p.state === PAGE_VALID)) {
        pushLog('ℹ️ Garbage Collection: no hay bloques con páginas inválidas para limpiar.', 'info');
        return { ...prev, log: logs.slice(0, 60) };
      }

      pushLog(`🗂️ GC inicia → Bloque víctima: Bloque ${victim.id} (${victim.pages.filter(p => p.state === PAGE_INVALID).length} inválidas)`, 'gc');

      // Copiar páginas VÁLIDAS a otro bloque libre
      const validPages = victim.pages.filter(p => p.state === PAGE_VALID);
      for (const vp of validPages) {
        const dest = findFreePage(blocks.map((b, i) => i === victim.id ? { ...b, pages: b.pages.map(() => ({ state: PAGE_INVALID })) } : b));
        if (dest && dest.blockId !== victim.id) {
          blocks[dest.blockId].pages[dest.pageId] = { ...vp };
          ftl[vp.lba] = { blockId: dest.blockId, pageId: dest.pageId };
          nandWrites++;
          pushLog(`  ↳ Mueve página válida LBA ${vp.lba} → Bloque ${dest.blockId}, Pág ${dest.pageId} (WAF++)`, 'gc');
        } else {
          // intentar any block
          const anyDest = findFreePage(blocks.filter((_, i) => i !== victim.id).concat());
          if (anyDest) {
            blocks[anyDest.blockId].pages[anyDest.pageId] = { ...vp };
            ftl[vp.lba] = { blockId: anyDest.blockId, pageId: anyDest.pageId };
            nandWrites++;
            pushLog(`  ↳ Mueve página válida LBA ${vp.lba} → Bloque ${anyDest.blockId}, Pág ${anyDest.pageId}`, 'gc');
          }
        }
      }

      // Borrar el bloque completo
      blocks[victim.id].pages = blocks[victim.id].pages.map(p => ({
        id: p.id, state: PAGE_FREE, lba: null, data: '',
      }));
      blocks[victim.id].eraseCount += 1;
      nandErases++;
      pushLog(`✅ GC: Bloque ${victim.id} BORRADO FÍSICAMENTE. Ciclos de borrado: ${blocks[victim.id].eraseCount}`, 'success');

      return { ...prev, blocks, ftl, nandWrites, nandErases, log: logs.slice(0, 60) };
    });
  }, []);

  /* ── 4. TOGGLE TRIM ───────────────────────────────────────────── */
  const toggleTrim = useCallback(() => {
    setState(prev => ({
      ...prev,
      trimEnabled: !prev.trimEnabled,
      log: [
        { id: Date.now(), msg: `🔧 TRIM ${!prev.trimEnabled ? 'ACTIVADO ✅' : 'DESACTIVADO ⛔'}`, type: !prev.trimEnabled ? 'success' : 'warn', ts: new Date().toLocaleTimeString() },
        ...prev.log,
      ].slice(0, 60),
    }));
  }, []);

  // Guarda una copia profunda del escenario activo para poder reiniciar sobre él
  const [activeScenario, setActiveScenario] = useState(null);

  /* ── 5. RESET ──────────────────────────────────────────────────── */
  const reset = useCallback(() => {
    if (activeScenario) {
      setState({
        blocks:      JSON.parse(JSON.stringify(activeScenario.blocks)),
        ftl:         JSON.parse(JSON.stringify(activeScenario.ftl)),
        trimEnabled: activeScenario.trimEnabled,
        osWrites:    activeScenario.osWrites,
        nandWrites:  activeScenario.nandWrites,
        nandErases:  activeScenario.nandErases,
        log: [{
          id: Date.now(),
          msg: `♻️ Escenario reiniciado: "${activeScenario.title}"`,
          type: 'info',
          ts: new Date().toLocaleTimeString(),
        }],
      });
    } else {
      setState(buildInitialState());
    }
  }, [activeScenario]);

  /* ── 6. CARGAR ESCENARIO ──────────────────────────────────── */
  const loadScenario = useCallback((scenario) => {
    setActiveScenario(scenario);
    setState({
      blocks:      JSON.parse(JSON.stringify(scenario.blocks)),
      ftl:         JSON.parse(JSON.stringify(scenario.ftl)),
      trimEnabled: scenario.trimEnabled,
      osWrites:    scenario.osWrites,
      nandWrites:  scenario.nandWrites,
      nandErases:  scenario.nandErases,
      log: [{
        id: Date.now(),
        msg: `📚 Escenario cargado: "${scenario.title}" — ${scenario.description}`,
        type: 'info',
        ts: new Date().toLocaleTimeString(),
      }],
    });
  }, []);

  /* ── STATS derivadas ──────────────────────────────────────────── */
  const waf = state.osWrites > 0 ? (state.nandWrites / state.osWrites).toFixed(2) : '1.00';
  const freePages  = state.blocks.flatMap(b => b.pages).filter(p => p.state === PAGE_FREE).length;
  const validPages = state.blocks.flatMap(b => b.pages).filter(p => p.state === PAGE_VALID).length;
  const invalidPages = state.blocks.flatMap(b => b.pages).filter(p => p.state === PAGE_INVALID).length;
  const totalPages = NUM_BLOCKS * PAGES_PER_BLOCK;
  const health = Math.max(0, 100 - Math.round((state.blocks.reduce((s, b) => s + b.eraseCount, 0) / (NUM_BLOCKS * 100)) * 100));

  return {
    blocks: state.blocks,
    ftl: state.ftl,
    trimEnabled: state.trimEnabled,
    osWrites: state.osWrites,
    nandWrites: state.nandWrites,
    nandErases: state.nandErases,
    log: state.log,
    waf,
    freePages,
    validPages,
    invalidPages,
    totalPages,
    health,
    writeLBA,
    deleteLBA,
    garbageCollect,
    toggleTrim,
    reset,
    loadScenario,
  };
}

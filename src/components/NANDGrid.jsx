import React from 'react';
import { PAGE_FREE, PAGE_VALID, PAGE_INVALID } from '../hooks/useSSD.js';

/**
 * NANDGrid – Representación visual de los bloques y páginas NAND físicos.
 * Cada bloque muestra sus páginas coloreadas según su estado:
 *   • Libre   (free)    → gris
 *   • Válida  (valid)   → verde
 *   • Inválida(invalid) → rojo
 */
function PageCell({ page, blockId, pageId }) {
  const stateClass = {
    [PAGE_FREE]:    'page-free',
    [PAGE_VALID]:   'page-valid',
    [PAGE_INVALID]: 'page-invalid',
  }[page.state];

  const label = {
    [PAGE_FREE]:    'LIBRE',
    [PAGE_VALID]:   `LBA ${page.lba}`,
    [PAGE_INVALID]: 'INVÁLIDA',
  }[page.state];

  return (
    <div className={`nand-page ${stateClass}`} title={`Bloque ${blockId}, Pág ${pageId} — ${page.state}${page.data ? ` — ${page.data}` : ''}`}>
      <span className="page-id">Pág {pageId}</span>
      <span className="page-label">{label}</span>
      {page.data && <span className="page-data">{page.data}</span>}
    </div>
  );
}

export default function NANDGrid({ blocks }) {
  return (
    <div className="panel nand-panel">
      <div className="panel-header">
        <span className="panel-icon">🔲</span>
        <h2 className="panel-title">Chip NAND Flash — Bloques Físicos</h2>
      </div>

      <div className="nand-legend">
        <span className="legend-item legend-free">■ Libre</span>
        <span className="legend-item legend-valid">■ Válida (datos activos)</span>
        <span className="legend-item legend-invalid">■ Inválida (basura)</span>
      </div>

      <div className="nand-grid">
        {blocks.map(block => {
          const invalid = block.pages.filter(p => p.state === PAGE_INVALID).length;
          const valid   = block.pages.filter(p => p.state === PAGE_VALID).length;
          const free    = block.pages.filter(p => p.state === PAGE_FREE).length;

          // Salud del bloque basada en ciclos de borrado (máx ~100 ciclos demo)
          const health = Math.max(0, 100 - block.eraseCount * 5);
          const healthClass = health > 70 ? 'health-good' : health > 40 ? 'health-warn' : 'health-bad';

          return (
            <div key={block.id} className={`nand-block ${invalid > 0 ? 'block-has-garbage' : ''}`}>
              <div className="block-header">
                <span className="block-title">BLOQUE {block.id}</span>
                <div className="block-meta">
                  <span className="erase-count" title="Ciclos de borrado">🔄 {block.eraseCount}</span>
                  <span className={`health-pill ${healthClass}`}>{health}%</span>
                </div>
              </div>

              <div className="block-bar">
                {valid   > 0 && <div className="bar-valid"   style={{ flex: valid }}   title={`${valid} válidas`} />}
                {invalid > 0 && <div className="bar-invalid" style={{ flex: invalid }} title={`${invalid} inválidas`} />}
                {free    > 0 && <div className="bar-free"    style={{ flex: free }}    title={`${free} libres`} />}
              </div>

              <div className="block-pages">
                {block.pages.map(page => (
                  <PageCell key={page.id} page={page} blockId={block.id} pageId={page.id} />
                ))}
              </div>

              <div className="block-stats">
                <span>{free} lib.</span>
                <span>{valid} vál.</span>
                <span>{invalid} inv.</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

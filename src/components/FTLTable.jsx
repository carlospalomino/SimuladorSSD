import React from 'react';

/**
 * FTLTable – Tabla de traducción Flash (FTL).
 * Muestra el mapeo lógico (LBA) → físico (Bloque, Página).
 */
export default function FTLTable({ ftl, blocks }) {
  const entries = Object.entries(ftl).sort((a, b) => Number(a[0]) - Number(b[0]));

  return (
    <div className="panel ftl-panel">
      <div className="panel-header">
        <span className="panel-icon">🗺️</span>
        <h2 className="panel-title">Capa de Traducción Flash (FTL)</h2>
      </div>
      <p className="panel-desc">Mapeo lógico (LBA del SO) → físico (Bloque + Página NAND).</p>

      {entries.length === 0 ? (
        <div className="ftl-empty">
          <span>Sin entradas aún.<br />Escribe en un LBA para comenzar.</span>
        </div>
      ) : (
        <div className="ftl-table-wrapper">
          <table className="ftl-table">
            <thead>
              <tr>
                <th>LBA (Lógico)</th>
                <th>→</th>
                <th>Bloque Físico</th>
                <th>Página Física</th>
                <th>Dato</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([lba, { blockId, pageId }]) => {
                const page = blocks[blockId]?.pages[pageId];
                return (
                  <tr key={lba} className="ftl-row">
                    <td className="ftl-lba">LBA {lba}</td>
                    <td className="ftl-arrow">→</td>
                    <td className="ftl-block">Bloque {blockId}</td>
                    <td className="ftl-page">Pág {pageId}</td>
                    <td className="ftl-data">{page?.data || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="ftl-footer">
        <span className="ftl-count">{entries.length} entrada{entries.length !== 1 ? 's' : ''} activas</span>
        <span className="ftl-hint">La FTL abstrae la geometría física del chip NAND</span>
      </div>
    </div>
  );
}

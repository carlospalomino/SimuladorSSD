import React from 'react';
import { useSSD } from './hooks/useSSD.js';
import OSPanel from './components/OSPanel.jsx';
import FTLTable from './components/FTLTable.jsx';
import NANDGrid from './components/NANDGrid.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import EventLog from './components/EventLog.jsx';

/**
 * App – Orquestador principal del Simulador SSD.
 * Conecta el hook useSSD con todos los componentes visuales.
 */
export default function App() {
  const ssd = useSSD();

  return (
    <div className="app-root">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">💾</span>
            <div>
              <h1 className="brand-title">Simulador Gestión Interna de SSD</h1>
              <p className="brand-sub">NAND Flash · FTL · Garbage Collection · TRIM · Wear Leveling</p>
            </div>
          </div>
          <div className="header-badges">
            <span className="badge badge-blue">UTP</span>
            <span className="badge badge-gray">Sistemas Operativos</span>
            <a
              href="https://carlospalomino.me/PlanificadorDiscos/"
              target="_blank"
              rel="noopener noreferrer"
              className="badge badge-link"
            >
              ↗ Simulador HDD
            </a>
          </div>
        </div>
      </header>

      {/* ── Top row: OS Panel | FTL Table | Stats ───────────────── */}
      <main className="app-main">
        <section className="top-row">
          <OSPanel
            trimEnabled={ssd.trimEnabled}
            onWrite={ssd.writeLBA}
            onDelete={ssd.deleteLBA}
            onGC={ssd.garbageCollect}
            onToggleTrim={ssd.toggleTrim}
            onReset={ssd.reset}
          />
          <FTLTable ftl={ssd.ftl} blocks={ssd.blocks} />
          <StatsPanel
            osWrites={ssd.osWrites}
            nandWrites={ssd.nandWrites}
            nandErases={ssd.nandErases}
            waf={ssd.waf}
            freePages={ssd.freePages}
            validPages={ssd.validPages}
            invalidPages={ssd.invalidPages}
            totalPages={ssd.totalPages}
            health={ssd.health}
          />
        </section>

        {/* ── NAND Grid ────────────────────────────────────────── */}
        <section className="nand-section">
          <NANDGrid blocks={ssd.blocks} />
        </section>

        {/* ── Event Log ────────────────────────────────────────── */}
        <section className="log-section">
          <EventLog log={ssd.log} />
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="app-footer">
        <span>Universidad Tecnológica de Panamá · Sistemas Operativos</span>
        <span>Simulador con fines educativos</span>
      </footer>
    </div>
  );
}

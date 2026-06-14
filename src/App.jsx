import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useSSD } from './hooks/useSSD.js';
import OSPanel from './components/OSPanel.jsx';
import FTLTable from './components/FTLTable.jsx';
import NANDGrid from './components/NANDGrid.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import EventLog from './components/EventLog.jsx';
import ScenarioSelector from './components/ScenarioSelector.jsx';
import Footer from './components/Footer.jsx';

/**
 * App – Orquestador principal del Simulador SSD.
 * Conecta el hook useSSD con todos los componentes visuales.
 */
export default function App() {
  const ssd = useSSD();
  const [darkMode, setDarkMode] = useState(true);
  const [sessionOps, setSessionOps] = useState(0);

  // Aplicar clase de tema al html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Contar operaciones de sesión (escrituras + borrados + GC)
  const prevOsWrites = React.useRef(0);
  const prevNandErases = React.useRef(0);
  useEffect(() => {
    const delta = (ssd.osWrites - prevOsWrites.current) + (ssd.nandErases - prevNandErases.current);
    if (delta > 0) setSessionOps(s => s + delta);
    prevOsWrites.current = ssd.osWrites;
    prevNandErases.current = ssd.nandErases;
  }, [ssd.osWrites, ssd.nandErases]);

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
            <span className="badge badge-gray">Sistemas Operativos</span>
            <a
              href="https://carlospalomino.me/PlanificadorDiscos/"
              target="_blank"
              rel="noopener noreferrer"
              className="badge badge-link"
            >
              ↗ Simulador HDD
            </a>
            {/* Toggle tema */}
            <button
              id="btn-theme-toggle"
              className="theme-toggle-btn"
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              {darkMode ? 'Claro' : 'Oscuro'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────────── */}
      <main className="app-main">
        <section className="top-row">
          <div className="left-col">
            <ScenarioSelector onLoad={ssd.loadScenario} />
            <OSPanel
              trimEnabled={ssd.trimEnabled}
              onWrite={ssd.writeLBA}
              onDelete={ssd.deleteLBA}
              onGC={ssd.garbageCollect}
              onToggleTrim={ssd.toggleTrim}
              onReset={ssd.reset}
            />
          </div>
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

        <section className="nand-section">
          <NANDGrid blocks={ssd.blocks} />
        </section>

        <section className="log-section">
          <EventLog log={ssd.log} />
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <Footer sessionOps={sessionOps} />
    </div>
  );
}

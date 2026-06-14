import React, { useState } from 'react';
import { SCENARIOS } from '../hooks/scenarios/index.js';

/**
 * ScenarioSelector – Selector de escenarios educativos precargados.
 * Muestra una tarjeta por escenario con descripción del concepto.
 */
export default function ScenarioSelector({ onLoad }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="panel scenario-panel">
      <div className="panel-header">
        <span className="panel-icon">📚</span>
        <h2 className="panel-title">Escenarios Educativos</h2>
      </div>
      <p className="panel-desc">
        Selecciona un escenario para cargar un estado predefinido y explorar un concepto específico.
      </p>

      <div className="scenario-list">
        {SCENARIOS.map((s) => (
          <div
            key={s.id}
            className={`scenario-card ${expanded === s.id ? 'scenario-expanded' : ''}`}
          >
            <button
              id={`scenario-btn-${s.id}`}
              className="scenario-header"
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
            >
              <span className="scenario-emoji">{s.emoji}</span>
              <div className="scenario-meta">
                <span className="scenario-title">{s.title}</span>
                <span className="scenario-subtitle">{s.subtitle}</span>
              </div>
              <span className="scenario-chevron">{expanded === s.id ? '▲' : '▼'}</span>
            </button>

            {expanded === s.id && (
              <div className="scenario-body">
                <div className="scenario-concept">
                  <span className="concept-label">Concepto:</span>
                  <span className="concept-text">{s.concept}</span>
                </div>
                <p className="scenario-desc">{s.description}</p>
                <button
                  id={`scenario-load-${s.id}`}
                  className="scenario-load-btn"
                  onClick={() => { onLoad(s); setExpanded(null); }}
                >
                  ▶ Cargar este escenario
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

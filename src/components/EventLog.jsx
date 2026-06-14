import React from 'react';

/**
 * EventLog – Registro cronológico de operaciones del simulador.
 * Muestra cada evento con color según su tipo.
 */
const TYPE_STYLE = {
  success: 'log-success',
  warn:    'log-warn',
  error:   'log-error',
  info:    'log-info',
  trim:    'log-trim',
  gc:      'log-gc',
};

export default function EventLog({ log }) {
  if (!log || log.length === 0) {
    return (
      <div className="panel log-panel">
        <div className="panel-header">
          <span className="panel-icon">📋</span>
          <h2 className="panel-title">Registro de Eventos</h2>
        </div>
        <div className="log-empty">Sin eventos. Ejecuta una operación para comenzar.</div>
      </div>
    );
  }

  return (
    <div className="panel log-panel">
      <div className="panel-header">
        <span className="panel-icon">📋</span>
        <h2 className="panel-title">Registro de Eventos</h2>
      </div>
      <div className="log-list">
        {log.map(entry => (
          <div key={entry.id} className={`log-entry ${TYPE_STYLE[entry.type] || 'log-info'}`}>
            <span className="log-ts">{entry.ts}</span>
            <span className="log-msg">{entry.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

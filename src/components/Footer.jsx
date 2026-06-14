import React, { useState, useEffect } from 'react';

const COUNTER_NS = 'simulador-ssd-utp';

export default function Footer({ sessionOps = 0 }) {
  const [visitCount, setVisitCount] = useState('–');
  const [globalOps,  setGlobalOps]  = useState('–');

  useEffect(() => {
    fetch(`https://abacus.jasoncameron.dev/hit/${COUNTER_NS}/visitas`)
      .then(r => r.json()).then(d => setVisitCount(d.value)).catch(() => {});
    fetch(`https://abacus.jasoncameron.dev/get/${COUNTER_NS}/operaciones`)
      .then(r => r.json()).then(d => setGlobalOps(d.value)).catch(() => {});
  }, []);

  return (
    <footer className="app-footer-full">
      {/* Contadores */}
      <div className="footer-counters">
        <div className="footer-counter-item">
          <span className="footer-counter-label">Visitas</span>
          <span className="footer-counter-value">{visitCount}</span>
        </div>
        <div className="footer-counter-sep" />
        <div className="footer-counter-item">
          <span className="footer-counter-label">Ops. Globales</span>
          <span className="footer-counter-value">{globalOps}</span>
        </div>
        <div className="footer-counter-sep" />
        <div className="footer-counter-item">
          <span className="footer-counter-label">Sesión</span>
          <span className="footer-counter-value footer-counter-session">{sessionOps}</span>
        </div>
      </div>

      {/* Créditos */}
      <p className="footer-credits">
        © {new Date().getFullYear()}{' '}
        <a
          href="https://carlospalomino.me"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-author-link"
        >
          Dr. Ing. Carlos Palomino Vidal
        </a>
      </p>
    </footer>
  );
}

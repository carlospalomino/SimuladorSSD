import React from 'react';
import { TrendingUp, HardDrive, Activity, Zap, Shield } from 'lucide-react';

/**
 * StatsPanel – Panel de estadísticas del simulador SSD.
 * Muestra WAF, escrituras OS vs NAND, borrados, estado de páginas y salud.
 */
export default function StatsPanel({
  osWrites, nandWrites, nandErases,
  waf, freePages, validPages, invalidPages, totalPages, health
}) {
  const usedPct = Math.round(((validPages + invalidPages) / totalPages) * 100);

  return (
    <div className="panel stats-panel">
      <div className="panel-header">
        <span className="panel-icon">📊</span>
        <h2 className="panel-title">Estadísticas del SSD</h2>
      </div>

      {/* WAF – métrica estrella */}
      <div className="waf-card">
        <div className="waf-label">
          <TrendingUp size={16} />
          Write Amplification Factor (WAF)
        </div>
        <div className="waf-value">{waf}×</div>
        <div className="waf-sub">
          {Number(waf) <= 1.05
            ? '🟢 Ideal – Sin amplificación'
            : Number(waf) <= 1.5
            ? '🟡 Aceptable – Algo de overhead GC'
            : '🔴 Alto – GC intensivo, reduce vida útil'}
        </div>
      </div>

      {/* Contadores */}
      <div className="stats-grid">
        <div className="stat-card" id="stat-os-writes">
          <HardDrive size={18} className="stat-icon blue" />
          <div className="stat-body">
            <span className="stat-num">{osWrites}</span>
            <span className="stat-lbl">Escrituras OS</span>
          </div>
        </div>
        <div className="stat-card" id="stat-nand-writes">
          <Activity size={18} className="stat-icon purple" />
          <div className="stat-body">
            <span className="stat-num">{nandWrites}</span>
            <span className="stat-lbl">Escrituras NAND</span>
          </div>
        </div>
        <div className="stat-card" id="stat-erases">
          <Zap size={18} className="stat-icon orange" />
          <div className="stat-body">
            <span className="stat-num">{nandErases}</span>
            <span className="stat-lbl">Borrados Físicos</span>
          </div>
        </div>
        <div className="stat-card" id="stat-health">
          <Shield size={18} className={health > 70 ? 'stat-icon green' : health > 40 ? 'stat-icon orange' : 'stat-icon red'} />
          <div className="stat-body">
            <span className="stat-num">{health}%</span>
            <span className="stat-lbl">Salud del Chip</span>
          </div>
        </div>
      </div>

      {/* Distribución de páginas */}
      <div className="page-dist">
        <div className="dist-label">Distribución de páginas ({totalPages} total)</div>
        <div className="dist-bar">
          {validPages   > 0 && <div className="dist-valid"   style={{ flex: validPages }}   title={`${validPages} válidas`} />}
          {invalidPages > 0 && <div className="dist-invalid" style={{ flex: invalidPages }} title={`${invalidPages} inválidas`} />}
          {freePages    > 0 && <div className="dist-free"    style={{ flex: freePages }}    title={`${freePages} libres`} />}
        </div>
        <div className="dist-legend">
          <span className="dl-item valid-txt">Válidas: {validPages}</span>
          <span className="dl-item invalid-txt">Inválidas: {invalidPages}</span>
          <span className="dl-item free-txt">Libres: {freePages}</span>
        </div>
      </div>

      {/* Uso lógico */}
      <div className="usage-row">
        <span className="usage-lbl">Uso del chip</span>
        <div className="usage-bar-wrap">
          <div className="usage-bar" style={{ width: `${usedPct}%` }} />
        </div>
        <span className="usage-pct">{usedPct}%</span>
      </div>

      <div className="stats-note">
        💡 WAF &gt; 1 indica escrituras extra generadas por GC (amplificación de escritura). TRIM reduce el WAF al evitar mover páginas ya obsoletas.
      </div>
    </div>
  );
}

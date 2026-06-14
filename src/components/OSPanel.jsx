import React, { useState } from 'react';
import { PenLine, Trash2, ToggleLeft, ToggleRight, Play, RotateCcw } from 'lucide-react';

/**
 * OSPanel – Panel de controles del sistema operativo.
 * Permite escribir, borrar, activar/desactivar TRIM, ejecutar GC y resetear.
 */
export default function OSPanel({ trimEnabled, onWrite, onDelete, onGC, onToggleTrim, onReset }) {
  const [lba, setLba] = useState('');
  const [data, setData] = useState('');
  const [delLba, setDelLba] = useState('');
  const [activeTab, setActiveTab] = useState('write');

  const handleWrite = () => {
    const l = parseInt(lba, 10);
    if (isNaN(l) || l < 0 || l > 15 || !data.trim()) return;
    onWrite(l, data.trim());
    setData('');
  };

  const handleDelete = () => {
    const l = parseInt(delLba, 10);
    if (isNaN(l)) return;
    onDelete(l);
    setDelLba('');
  };

  return (
    <div className="panel os-panel">
      <div className="panel-header">
        <span className="panel-icon">💻</span>
        <h2 className="panel-title">Panel del Sistema Operativo</h2>
      </div>

      {/* Tabs */}
      <div className="tab-row">
        <button
          id="tab-write"
          className={`tab-btn ${activeTab === 'write' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('write')}
        >
          <PenLine size={14} /> Escribir
        </button>
        <button
          id="tab-delete"
          className={`tab-btn ${activeTab === 'delete' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          <Trash2 size={14} /> Borrar
        </button>
        <button
          id="tab-gc"
          className={`tab-btn ${activeTab === 'gc' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('gc')}
        >
          <Play size={14} /> Garbage Col.
        </button>
      </div>

      {/* Contenido del tab */}
      {activeTab === 'write' && (
        <div className="tab-content">
          <p className="tab-desc">Escribe datos en una dirección lógica (LBA). El FTL mapeará automáticamente a la página física disponible con menor desgaste.</p>
          <label className="field-label">LBA (0–15)</label>
          <input
            id="input-lba-write"
            type="number"
            min="0"
            max="15"
            className="field-input"
            placeholder="Ej: 3"
            value={lba}
            onChange={e => setLba(e.target.value)}
          />
          <label className="field-label">Dato / Nombre de archivo</label>
          <input
            id="input-data"
            type="text"
            className="field-input"
            placeholder="Ej: foto.jpg"
            value={data}
            onChange={e => setData(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleWrite()}
          />
          <button id="btn-write" className="action-btn btn-green" onClick={handleWrite}>
            <PenLine size={15} /> Escribir LBA {lba || '?'}
          </button>
        </div>
      )}

      {activeTab === 'delete' && (
        <div className="tab-content">
          <p className="tab-desc">Borra un LBA desde el SO. Con TRIM activo, el SSD es notificado y la página se marca inválida de inmediato. Sin TRIM, el SSD no sabe nada.</p>
          <label className="field-label">LBA a borrar</label>
          <input
            id="input-lba-delete"
            type="number"
            min="0"
            max="15"
            className="field-input"
            placeholder="Ej: 3"
            value={delLba}
            onChange={e => setDelLba(e.target.value)}
          />
          <button id="btn-delete" className="action-btn btn-red" onClick={handleDelete}>
            <Trash2 size={15} /> Borrar LBA {delLba || '?'}
          </button>
        </div>
      )}

      {activeTab === 'gc' && (
        <div className="tab-content">
          <p className="tab-desc">El Garbage Collector selecciona el bloque con más páginas inválidas, copia las válidas a otro bloque libre y luego borra el bloque físicamente, incrementando sus ciclos de borrado.</p>
          <button id="btn-gc" className="action-btn btn-purple" onClick={onGC}>
            <Play size={15} /> Ejecutar Garbage Collection
          </button>
        </div>
      )}

      {/* TRIM Toggle */}
      <div className="trim-row">
        <span className="trim-label">Comando TRIM</span>
        <button
          id="btn-trim-toggle"
          className={`trim-toggle ${trimEnabled ? 'trim-on' : 'trim-off'}`}
          onClick={onToggleTrim}
          title={trimEnabled ? 'TRIM activo – click para desactivar' : 'TRIM inactivo – click para activar'}
        >
          {trimEnabled
            ? <><ToggleRight size={20} /> ON</>
            : <><ToggleLeft size={20} /> OFF</>
          }
        </button>
      </div>

      {/* Reset */}
      <button id="btn-reset" className="reset-btn" onClick={onReset}>
        <RotateCcw size={13} /> Reiniciar simulador
      </button>
    </div>
  );
}

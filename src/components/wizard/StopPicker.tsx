import { useState, useMemo } from 'react';
import { getAllZones, getStopsByZone, searchStops } from '../../data/locations';
import type { Stop } from '../../types';

interface Props {
  value: string;
  onChange: (stopId: string) => void;
  label: string;
}

export default function StopPicker({ value, onChange, label }: Props) {
  const [query, setQuery] = useState('');

  const zones = useMemo(() => getAllZones(), []);

  const filtered = useMemo(() => {
    if (!query.trim()) return null;
    return searchStops(query.trim());
  }, [query]);

  const selectedName = query || value;

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>{label}</div>
      <input
        type="text"
        className="stop-picker__input"
        data-testid="stop-picker-input"
        placeholder="搜索停靠点…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 12px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          fontSize: 14,
        }}
      />

      {filtered !== null ? (
        <div
          data-testid="stop-picker-results"
          style={{
            marginTop: 8,
            maxHeight: 180,
            overflowY: 'auto',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {filtered.length === 0 && (
            <div style={{ padding: 12, color: 'var(--text-muted)', fontSize: 13 }}>无匹配结果</div>
          )}
          {filtered.map((stop: Stop) => (
            <button
              key={stop.id}
              data-testid={`stop-option-${stop.id}`}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 12px',
                borderBottom: '1px solid var(--border)',
                background: stop.id === value ? 'rgba(34,211,238,0.08)' : 'transparent',
                fontSize: 13,
              }}
              onClick={() => {
                onChange(stop.id);
                setQuery('');
              }}
            >
              <span style={{ fontWeight: 500 }}>{stop.name}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 8, fontSize: 11 }}>
                {stop.zone}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          {zones.map((zone) => (
            <div key={zone} style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {zone}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {getStopsByZone(zone).map((stop: Stop) => (
                  <button
                    key={stop.id}
                    data-testid={`stop-chip-${stop.id}`}
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: stop.id === value ? 'var(--primary)' : 'var(--border)',
                      background: stop.id === value ? 'rgba(34,211,238,0.12)' : 'transparent',
                      color: stop.id === value ? 'var(--primary)' : 'var(--text-dim)',
                      fontWeight: stop.id === value ? 600 : 400,
                    }}
                    onClick={() => onChange(stop.id)}
                  >
                    {stop.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

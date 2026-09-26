import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  width: number;
  height: number;
  children: React.ReactNode;
}

export default function CampusMap({ width, height, children }: Props) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setTransform((t) => ({
      ...t,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform((t) => ({
      ...t,
      scale: Math.max(0.5, Math.min(3, t.scale * delta)),
    }));
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsPanning(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="campus-map"
      style={{ width, height, overflow: 'hidden', position: 'relative', cursor: isPanning ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
    >
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          position: 'absolute',
          width: 1279,
          height: 1670,
        }}
      >
        <img
          src="/assets/campus-map.jpg"
          alt="校园地图"
          style={{ width: 1279, height: 1670, display: 'block' }}
          draggable={false}
        />
        <svg
          width={1279}
          height={1670}
          style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
          {children}
        </svg>
      </div>
      <div className="campus-map__controls" style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: 8 }}>
        <button className="btn-ghost" onClick={() => setTransform((t) => ({ ...t, scale: Math.min(3, t.scale * 1.2) }))}>+</button>
        <button className="btn-ghost" onClick={() => setTransform((t) => ({ ...t, scale: Math.max(0.5, t.scale * 0.8) }))}>−</button>
        <button className="btn-ghost" onClick={resetView}>⌖</button>
      </div>
    </div>
  );
}

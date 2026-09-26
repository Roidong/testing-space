import type { RoutePath } from '../../types';

interface Props {
  route: RoutePath;
  progress: number;
}

export default function MiniMapThumb({ route, progress }: Props) {
  if (route.pts.length < 1) return null;

  const xs = route.pts.map((p) => p.x);
  const ys = route.pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const pad = 4;
  const vbX = minX - pad;
  const vbY = minY - pad;
  const vbW = Math.max(maxX - minX + pad * 2, 20);
  const vbH = Math.max(maxY - minY + pad * 2, 20);

  const pathD = route.pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  let totalLen = 0;
  const segLens: number[] = [0];
  for (let i = 1; i < route.pts.length; i++) {
    const dx = route.pts[i].x - route.pts[i - 1].x;
    const dy = route.pts[i].y - route.pts[i - 1].y;
    totalLen += Math.sqrt(dx * dx + dy * dy);
    segLens.push(totalLen);
  }

  const frac = route.meters > 0 ? Math.min(progress / route.meters, 1) : 0;
  const traveledLen = frac * totalLen;

  let robotX = route.pts[0].x;
  let robotY = route.pts[0].y;
  for (let i = 1; i < route.pts.length; i++) {
    if (segLens[i] >= traveledLen) {
      const segFrac = totalLen > 0 ? (traveledLen - segLens[i - 1]) / (segLens[i] - segLens[i - 1]) : 0;
      robotX = route.pts[i - 1].x + (route.pts[i].x - route.pts[i - 1].x) * segFrac;
      robotY = route.pts[i - 1].y + (route.pts[i].y - route.pts[i - 1].y) * segFrac;
      break;
    }
    if (i === route.pts.length - 1) {
      robotX = route.pts[i].x;
      robotY = route.pts[i].y;
    }
  }

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      width="100%"
      height="100%"
      style={{ background: 'rgba(30,42,68,0.5)', borderRadius: 'var(--radius-sm)' }}
    >
      <path d={pathD} fill="none" stroke="#1e2a44" strokeWidth={2} />
      <circle cx={robotX} cy={robotY} r={3} fill="var(--primary)" />
    </svg>
  );
}
